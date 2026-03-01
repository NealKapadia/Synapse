# 🚑 Synapse: The AI Second Responder

**Synapse** is an AI-powered, real-time clinical diagnostic dashboard designed specifically to streamline First Responder and EMS protocols. By actively listening to chaotic prehospital environments, Synapse seamlessly structures vital medical details and instantly generates compliant Patient Care Reports (PCR).

Built as a definitive prototype for rapid-response field care, this application listens, analyzes, and coordinates critical interventions.

[**View the Repository**](https://github.com/NealKapadia/Synapse)

---

## 🌟 Key Features

### 🎙️ Multi-Modal Input
- **Live Audio Transcription**: Record erratic patient encounters directly from the browser on the field using modern Web Audio APIs.
- **Audio File Upload**: Process existing radio chatter clips or physical recordings (`.wav`, `.mp3`) through a responsive drag-and-drop interface.
- **Scenario Testing**: Instantly deploy realistic EMS scenarios (e.g., Motor Vehicle Accident, Suspected Myocardial Infarction, Acute Stroke Alert) to evaluate the engine's extraction capabilities under pressure.

### 🧠 Advanced AI Medical Extraction
Utilizing the high-performance `mistralai/Mistral-Nemo-Instruct-2407` model, Synapse processes raw, messy field conversations and extracts pristine, structured data:
- **Vitals Tracking**: Automatically identifies and categorizes blood pressure, heart rate, and oxygen saturation. It visually flags clinically abnormal metrics for immediate attention. 
- **Automated Interventions**: Built-in rulesets dynamically map treatments based on vital bounds (e.g., forcefully recommending "Administer Oxygen" if SpO2 drops below 92%).
- **Symptom & Diagnosis Mapping**: Extracts core symptoms and maps likely conditions alongside their corresponding **ICD-10 codes** and confidence scores, providing differentials for the medic to consider.

### 🤖 EMT Field Insights
Synapse functions as an autonomous second responder. By evaluating transcripts against the standard OPQRST and SAMPLE frameworks, it actively identifies critical gaps in the patient's history. It outputs 5 immediate, highly-focused interview questions the EMT should ask the patient on the spot to close diagnostic blindspots.

### 📝 Automated Patient Care Reports (PCR)
Synapse translates raw field chatter directly into an objective, highly professional, structured clinical narrative perfect for hospital handover.
- **HIPAA Compliant**: The engine defaults to a de-identified, objective clinical tone.
- **One-Click Export**: First Responders can verify the accuracy of the timeline and instantly export the `.txt` PCR narrative to be attached to the patient's legal chart, drastically reducing post-call paperwork.

---

## 💻 Technology Stack

*   **Framework**: Next.js 16+ (App Router, Turbopack)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & Lucide Icons
*   **AI Inference**: Featherless.ai REST API (`mistralai/Mistral-Nemo-Instruct-2407`)
*   **State & UI UX**: React DOM, Framer Motion, React Hot Toast

---

## 🏆 Engineering for the Field

This project was engineered for speed, reliability, and immediate clinical value during Golden Hour emergencies. We focused heavily on crushing computational latency. 

By optimizing our LLM prompts to return raw, flat JSON objects and running parallel asynchronous data extraction and PCR generation sequences, we achieved a highly responsive dashboard that never slows down the ambulance.

*Designed for the frontline.*
