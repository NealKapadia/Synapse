import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/featherless";

const FEATHERLESS_API_URL = "https://api.featherless.ai/v1/chat/completions";
const API_KEY = process.env.FEATHERLESS_API_KEY || "";
const MODEL = "Qwen/Qwen2.5-72B-Instruct"; // Ungated, highly capable, and empathetic model

export async function POST(req: NextRequest) {
    try {
        const { text, language = "English" } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid text provided" }, { status: 400 });
        }

        const customizedPrompt = SYSTEM_PROMPT.replace("{{LANGUAGE}}", language);

        const response = await fetch(FEATHERLESS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: customizedPrompt },
                    { role: "user", content: `Here is the transcript:\n\n${text}` }
                ],
                temperature: 0.1, // Keep it deterministic for JSON output
            })
        });

        if (!response.ok) {
            console.error("Featherless API Error:", await response.text());
            return NextResponse.json({ error: "Upstream API error" }, { status: response.status });
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();

        // Sometimes LLMs still wrap in markdown despite instructions. Clean it up.
        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "");
        }
        if (content.startsWith("```")) {
            content = content.replace(/^```/, "");
        }
        if (content.endsWith("```")) {
            content = content.replace(/```$/, "");
        }
        content = content.trim();

        try {
            const parsed = JSON.parse(content);
            return NextResponse.json(parsed);
        } catch (parseError) {
            console.error("Failed to parse JSON from LLM output:", content);
            return NextResponse.json({ error: "Failed to parse structured output" }, { status: 500 });
        }

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
