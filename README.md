# 🛡️ Axxess Aegis: Diagnostic Assistant

**Axxess Aegis** is an AI-powered, real-time clinical diagnostic dashboard designed to streamline practitioner workflows, bridge communication gaps between doctors and patients, and seamlessly integrate unstructured medical transcripts into structured healthcare systems. 

Built as a definitive prototype for the **Aegis: The Tri-Lens Diagnostic Engine** hackathon, this application actively listens, analyzes, and coordinates care.

---

## 🌟 Key Features

### 🎙️ Multi-Modal Input
- **Live Audio Transcription**: Record patient encounters directly from the browser using modern Web Audio APIs.
- **Audio File Upload**: Process existing clinical recordings (`.wav`, `.mp3`) through a responsive drag-and-drop interface.
- **Scenario Testing**: Instantly deploy realistic medical scenarios (e.g., Home Health Admission, Telehealth Follow-ups, ER Triage) to evaluate the engine's extraction capabilities.

### 🧠 Advanced AI Medical Extraction
Powered by **Featherless.ai** utilizing the high-performance `Qwen/Qwen2.5-14B-Instruct` model, Aegis processes raw, messy clinical conversations and extracts pristine, structured data:
- **Vitals Tracking**: Automatically identifies and categorizes blood pressure, heart rate, oxygen saturation, and visually flags clinically abnormal metrics.
- **Symptom & Diagnosis Mapping**: Extracts core symptoms and maps diagnosed conditions alongside their corresponding **ICD-10 codes** and confidence scores.
- **Treatment Plans**: Highlights recommended treatments, prescriptions, and clinical protocols.
- **Agentic Insights**: Evaluates the transcript against standard OPQRST/SAMPLE frameworks and proactively suggests critical follow-up questions the clinician might have forgotten to ask.

### 🌐 Patient-Friendly Recovery Plans
Medical jargon is automatically decoded into a warm, deeply compassionate recovery plan specifically tailored for the patient. 
- **Multi-Lingual Output**: Instantly translate the recovery plan into English, Spanish, Mandarin, or Vietnamese.
- **Accessible Text-to-Speech**: Listen to the formatted recovery plan using native, high-quality browser TTS engines localized to the selected language.

### 📱 Real-Time Twilio SMS Integration
Built for the modern edge of care. Clinicians can enter the patient's mobile number, and Aegis will instantly fire off the translated, empathetic recovery plan directly to their device via **Twilio SMS**, ensuring they leave with clear instructions.

### 🔗 Invisible FHIR R4 Interoperability
While the frontend remains delightfully simple and human-readable, the Next.js backend silently and programmatically translates all extracted clinical data into a deeply nested, strictly compliant **FHIR R4 JSON Bundle**. Aegis elegantly maps `Condition`, `MedicationRequest`, `Encounter`, and `DocumentReference` resources, guaranteeing immediate compliance for robust EHR handoffs.

---

## 💻 Technology Stack

*   **Framework**: Next.js 16+ (App Router, Turbopack)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & Lucide Icons
*   **AI Inference**: Featherless.ai REST API (`Qwen/Qwen2.5-14B-Instruct`)
*   **Communications**: Twilio Node SDK
*   **State & UI UX**: React DOM, Framer Motion, React Hot Toast

---

## 🏆 Hackathon Engineering

This project was engineered for speed, reliability, and immediate clinical value. We focused heavily on crushing "AI Loading Latency." 

By optimizing our LLM prompts to return raw, flat JSON objects, running parallel asynchronous data extraction sequences, and offloading the astronomically complex FHIR structural mapping entirely to pure JavaScript on the backend edge, we achieved a highly responsive dashboard that never keeps doctors waiting.

*Designed to revolutionize care coordination.*
