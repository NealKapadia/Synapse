const FEATHERLESS_API_URL = "https://api.featherless.ai/v1/chat/completions";
const API_KEY = "rc_1f6a9735be08501c70566ad7a1e86000191bbaf6d6345aa3ac51590442651a1f";
const MODEL = "Qwen/Qwen2.5-72B-Instruct";

const DATA_EXTRACTION_PROMPT = `You are an expert AI clinical diagnostic assistant.
Your task is to analyze the provided patient-clinician transcript and extract structured medical data into a minimal, flat JSON object.
Act as an autonomous clinical agent. Evaluate the transcript against standard OPQRST/SAMPLE medical assessment frameworks. Identify critical missing information (e.g., if chest pain is mentioned but not duration or radiation). Return 2-3 short, urgent questions the clinician should ask the patient right now to close these diagnostic gaps.

You MUST return your response as a single, valid JSON object with EXACTLY the following structure. Do not wrap it in markdown codeblocks (no \`\`\`json). Just return the raw JSON string.

{
  "vitals": {
    "bloodPressure": { "measurement": "string", "is_abnormal": "boolean (true if clinically abnormal)" },
    "heartRate": { "measurement": "string", "is_abnormal": "boolean (true if clinically abnormal)" },
    "...any other vitals mentioned": { "measurement": "string", "is_abnormal": "boolean (true if clinically abnormal)" }
  },
  "symptoms": ["string", "string"],
  "diagnoses": [
    {
      "condition_name": "string",
      "icd_10_code": "string",
      "confidence_score": 94,
      "differential_diagnoses": ["string", "string"]
    }
  ],
  "treatments": ["string", "string"],
  "agentic_follow_ups": ["string", "string"]
}

Important Rules:
- If a value is not mentioned in the transcript, omit it from the array or set the object key to null (for vitals).
- When determining "is_abnormal" for vitals, use standard clinical bounds (e.g., HR > 100 or < 60 is abnormal, BP > 120/80 is abnormal, SpO2 < 95 is abnormal).
- DO NOT INCLUDE ANY OUTSIDE TEXT, ONLY RETURN VALID JSON.`;

async function test() {
  const text = "[Transcribed from Cardiac.wav]\n\n Good morning, I've been reviewing your chart. You mentioned having some chest heaviness and palpitations lately. Yes, Doctor, it feels like a weight is sitting on my chest and my heart starts racing even when I'm just watching TV. I'm sorry to hear that. Your blood pressure is 142 over 90 today and your heart rate is currently 102. Your oxygen is fine at 96% due to the family history of heart disease. Actually, my father had a heart attack when he was exactly my age. I'm pretty worried about it.";

  const res = await fetch(FEATHERLESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: DATA_EXTRACTION_PROMPT },
        { role: "user", content: `Here is the transcript:\n\n${text}` }
      ],
      temperature: 0.1,
    })
  });

  const data = await res.json();
  console.log(data);
}

test();
