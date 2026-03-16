import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { DATA_EXTRACTION_PROMPT, PCR_GENERATION_PROMPT } from "@/lib/prompts";

export const maxDuration = 60; // Allow sufficient time for LLM generation

// Initialize the OpenAI Client pointing to the Azure API
const client = new OpenAI({
    baseURL: process.env.AZURE_OPENAI_ENDPOINT ? `${process.env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, '')}/openai/v1` : undefined,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_API_KEY, // Ensure Azure key header is sent just in case
    }
});

function cleanJSON(content: string) {
    let clean = content.trim();
    if (clean.startsWith("```json")) clean = clean.replace(/^```json/, "");
    if (clean.startsWith("```")) clean = clean.replace(/^```/, "");
    if (clean.endsWith("```")) clean = clean.replace(/```$/, "");
    return clean.trim();
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid text provided" }, { status: 400 });
        }

        const dataPromptContent = DATA_EXTRACTION_PROMPT;
        const pcrPromptContent = PCR_GENERATION_PROMPT;

        const callApi = async (systemContent: string) => {
            const response = await client.chat.completions.create({
                model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "synapse-gpt4o-mini",
                messages: [
                    { role: "system", content: systemContent },
                    { role: "user", content: `Here is the transcript:\n\n${text}` }
                ],
                temperature: 0.1,
                // This guarantees the model outputs strict JSON
                response_format: { type: "json_object" },
            });

            return response.choices[0].message.content || "{}";
        };

        const [dataResultRaw, pcrResultRaw] = await Promise.all([
            callApi(dataPromptContent),
            callApi(pcrPromptContent)
        ]);

        let dataParsed = {};
        let pcrParsed = {};

        try {
            dataParsed = JSON.parse(cleanJSON(dataResultRaw));
        } catch (e) {
            console.error("Failed to parse data extraction", dataResultRaw);
        }

        try {
            pcrParsed = JSON.parse(cleanJSON(pcrResultRaw));
        } catch (e) {
            console.error("Failed to parse PCR", pcrResultRaw);
        }

        const finalResult = {
            ...dataParsed,
            ...pcrParsed
        };

        return NextResponse.json(finalResult);

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
