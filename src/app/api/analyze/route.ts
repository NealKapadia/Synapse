import { NextRequest, NextResponse } from "next/server";
import { DATA_EXTRACTION_PROMPT, PATIENT_SUMMARY_PROMPT } from "@/lib/featherless";

const FEATHERLESS_API_URL = "https://api.featherless.ai/v1/chat/completions";
const API_KEY = process.env.FEATHERLESS_API_KEY || "";
const MODEL = "mistralai/Mistral-Nemo-Instruct-2407"; // 12B parameter Mistral model

function generateFHIRBundle(data: any, text: string) {
    const patientId = crypto.randomUUID();
    const encounterId = crypto.randomUUID();
    const practitionerId = crypto.randomUUID();

    const bundle: any = {
        resourceType: "Bundle",
        type: "collection",
        entry: [
            {
                resource: {
                    resourceType: "Patient",
                    id: patientId,
                    active: true,
                    gender: "unknown"
                }
            },
            {
                resource: {
                    resourceType: "Encounter",
                    id: encounterId,
                    status: "finished",
                    class: {
                        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                        code: "AMB",
                        display: "ambulatory"
                    },
                    subject: {
                        reference: `Patient/${patientId}`
                    }
                }
            },
            {
                resource: {
                    resourceType: "DocumentReference",
                    id: crypto.randomUUID(),
                    status: "current",
                    type: {
                        coding: [
                            {
                                system: "http://loinc.org",
                                code: "11488-4",
                                display: "Consultation note"
                            }
                        ]
                    },
                    subject: {
                        reference: `Patient/${patientId}`
                    },
                    content: [
                        {
                            attachment: {
                                contentType: "text/plain",
                                data: Buffer.from(text).toString("base64")
                            }
                        }
                    ]
                }
            }
        ]
    };

    if (data.diagnoses && Array.isArray(data.diagnoses)) {
        data.diagnoses.forEach((diag: any) => {
            bundle.entry.push({
                resource: {
                    resourceType: "Condition",
                    id: crypto.randomUUID(),
                    clinicalStatus: {
                        coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                                code: "active"
                            }
                        ]
                    },
                    code: {
                        coding: [
                            {
                                system: "http://hl7.org/fhir/sid/icd-10",
                                code: diag.icd_10_code || "Unknown",
                                display: diag.condition_name || "Unknown Condition"
                            }
                        ],
                        text: diag.condition_name
                    },
                    subject: {
                        reference: `Patient/${patientId}`
                    }
                }
            });
        });
    }

    if (data.treatments && Array.isArray(data.treatments)) {
        data.treatments.forEach((treatment: string) => {
            bundle.entry.push({
                resource: {
                    resourceType: "MedicationRequest",
                    id: crypto.randomUUID(),
                    status: "active",
                    intent: "order",
                    medicationCodeableConcept: {
                        text: treatment
                    },
                    subject: {
                        reference: `Patient/${patientId}`
                    }
                }
            });
        });
    }

    return bundle;
}

function cleanJSON(content: string) {
    let clean = content.trim();
    if (clean.startsWith("\`\`\`json")) clean = clean.replace(/^\`\`\`json/, "");
    if (clean.startsWith("\`\`\`")) clean = clean.replace(/^\`\`\`/, "");
    if (clean.endsWith("\`\`\`")) clean = clean.replace(/\`\`\`$/, "");
    return clean.trim();
}

export async function POST(req: NextRequest) {
    try {
        const { text, language = "English" } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid text provided" }, { status: 400 });
        }

        const dataPromptContent = DATA_EXTRACTION_PROMPT;
        const summaryPromptContent = PATIENT_SUMMARY_PROMPT.replace("{{LANGUAGE}}", language);

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
                throw new Error(`Featherless API Error: ${res.status} ${text}`);
            }

            const data = await res.json();
            return data.choices[0].message.content;
        };

        const [dataResultRaw, summaryResultRaw] = await Promise.all([
            callApi(dataPromptContent),
            callApi(summaryPromptContent)
        ]);

        let dataParsed = {};
        let summaryParsed = {};

        try {
            dataParsed = JSON.parse(cleanJSON(dataResultRaw));
        } catch (e) {
            console.error("Failed to parse data extraction", dataResultRaw);
        }

        try {
            summaryParsed = JSON.parse(cleanJSON(summaryResultRaw));
        } catch (e) {
            console.error("Failed to parse summary", summaryResultRaw);
        }

        const finalResult = {
            ...dataParsed,
            ...summaryParsed,
            fhirBundle: generateFHIRBundle(dataParsed, text)
        };

        return NextResponse.json(finalResult);

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
