export interface AnalysisResult {
    severity: {
        score: number;
        label: string;
        rationale: string;
    };
    patient_info: {
        age: string;
        sex: string;
        chief_complaint: string;
    };
    mechanism_of_injury: string;
    scene_assessment: string;
    red_flags: string[];
    vitals: Record<string, { measurement: string; is_abnormal: boolean }>;
    symptoms: string[];
    diagnoses: {
        condition_name: string;
        icd_10_code: string;
        confidence_score: number;
        differential_diagnoses: string[];
    }[];
    treatments: string[];
    agentic_follow_ups?: string[];
    clinical_timeline: string[];
    patientCareReport: string;
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    emoji: string;
    mockTranscript: string;
}

export const SCENARIOS: Scenario[] = [
    {
        id: 'trauma-mva',
        name: 'Motor Vehicle Accident',
        description: 'Blunt force trauma following a high-speed collision.',
        emoji: '🚗',
        mockTranscript: "Dispatch, Unit 7 is on scene at a two-vehicle MVA. Patient is a 28-year-old male driver, unrestrained, found outside the vehicle. He is conscious but confused. Complaining of severe abdominal pain and shortness of breath. Vitals: HR 125, BP 90/60, RR 26, SpO2 92% on room air. We observe a steering wheel contusion on his chest and a rigid, distended abdomen. Applying high-flow O2 via non-rebreather, initiating large-bore IV access, and preparing for rapid transport to the Level 1 Trauma Center."
    },
    {
        id: 'cardiac-arrest',
        name: 'Suspected Myocardial Infarction',
        description: 'Patient experiencing crushing chest pain and diaphoresis.',
        emoji: '❤️',
        mockTranscript: "Unit 4 to receiving, en route with a 55-year-old male complaining of crushing substernal chest pain radiating to the left jaw. Onset 30 minutes PTA. Patient is pale, cool, and diaphoretic. Vitals: BP 160/95, HR 110 irregular, RR 22, SpO2 94% on room air. 12-lead EKG shows ST elevation in leads V2-V4. Administered 324mg aspirin PO and 0.4mg nitro sublingually 5 minutes ago with minimal relief. Requesting STEMI alert. ETA 5 minutes."
    },
    {
        id: 'stroke-alert',
        name: 'Acute Stroke Alert',
        description: 'Elderly patient with sudden onset of unilateral weakness and slurred speech.',
        emoji: '🧠',
        mockTranscript: "Rescue 9 responding. Patient is a 72-year-old female whose husband found her with sudden right-sided weakness and a facial droop. Last known normal was 45 minutes ago. She has expressive aphasia. Vitals: BP 185/110, HR 88 atrial fibrillation, RR 16, SpO2 97%. Blood glucose is 105 mg/dL. Initiating stroke protocol. IV established in the left AC. Initiating transport to Comprehensive Stroke Center."
    }
];
