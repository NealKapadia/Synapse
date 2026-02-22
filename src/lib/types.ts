export interface AnalysisResult {
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
    patientSummary: string;
    fhirBundle?: any;
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    mockTranscript: string;
}

export const SCENARIOS: Scenario[] = [
    {
        id: 'home-health-admission',
        name: 'Home Health Admission',
        description: 'Initial intake assessment for a patient recently discharged for COPD exacerbation.',
        mockTranscript: "Patient is an 82-year-old male seen today for initial home health admission following a 4-day hospital stay for a COPD exacerbation. He reports feeling 'tired' but breathing is much better than last week. Vitals: BP 142/88, HR 88 regular, RR 18, and SpO2 93% on 2L nasal cannula. Lungs have mild scattered wheezes. He is taking his Prednisone taper and using Albuterol nebulizer every 6 hours as needed. He denies any new chest pain or lower extremity edema. Plan is to set up a nursing aide twice a week to assist with bathing due to generalized weakness, and will refer to respiratory therapy."
    },
    {
        id: 'telehealth',
        name: 'Telehealth Follow-up',
        description: 'Routine follow-up for type 2 diabetes.',
        mockTranscript: "Patient is here for a 3-month follow-up of type 2 diabetes. Blood sugars have been running in the 130s to 150s fasting. He has been taking Metformin 1000mg twice daily and reports no side effects. Weight is stable at 195 lbs. Blood pressure today is 125/80. He denies any neuropathy or vision changes."
    },
    {
        id: 'home-health',
        name: 'Home Health Assessment',
        description: 'Routine home care visit for a post-operative elderly patient.',
        mockTranscript: "Patient is a 78-year-old female seen at home for a routine post-operative check following a right hip replacement two weeks ago. Incision site is clean, dry, and intact with no signs of infection. Patient reports pain is well-controlled at a 3 out of 10 using Tylenol. Vitals: BP 130/80, HR 82, SpO2 97% on room air. She is ambulating well with her walker. Will continue current home physical therapy plan."
    }
];
