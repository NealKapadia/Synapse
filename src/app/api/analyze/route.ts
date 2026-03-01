import { NextRequest, NextResponse } from "next/server";
import { DATA_EXTRACTION_PROMPT, PCR_GENERATION_PROMPT } from "@/lib/featherless";

const FEATHERLESS_API_URL = "https://api.featherless.ai/v1/chat/completions";
const API_KEY = process.env.FEATHERLESS_API_KEY || "";
const MODEL = "mistralai/Mistral-Nemo-Instruct-2407"; // 12B parameter Mistral model

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
            const res = await fetch(FEATHERLESS_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: "system", content: systemContent },
                        { role: "user", content: `Here is the transcript:\n\n${text}` }
                    ],
                    temperature: 0.1,
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API Error: ${res.status} ${text}`);
            }

            const data = await res.json();
            return data.choices[0].message.content;
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
