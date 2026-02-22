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
        id: 'er-triage',
        name: 'Emergency Room Triage',
        description: 'Patient presents with severe chest pain and shortness of breath.',
        mockTranscript: "Unit 4 to receiving, we are en route with a 55-year-old male, GCS 15, complaining of crushing substernal chest pain radiating to the left shoulder. Onset 30 minutes ago PTA. Patient is diaphoretic and tachypneic. Vitals: BP 160/95, heart rate 110 regular, respiratory rate 22, SpO2 94% on room air. We administered 324mg aspirin PO and assisted with one of the patient's own nitro tabs sublingually 5 minutes ago with no relief. No known history of CAD, but has a history of hypertension. ETA 5 minutes."
    },
    {
        id: 'telehealth',
        name: 'Telehealth Follow-up',
        description: 'Routine follow-up for type 2 diabetes.',
        mockTranscript: "Patient is here for a 3-month follow-up of type 2 diabetes. Blood sugars have been running in the 130s to 150s fasting. He has been taking Metformin 1000mg twice daily and reports no side effects. Weight is stable at 195 lbs. Blood pressure today is 125/80. He denies any neuropathy or vision changes."
    },
    {
        id: 'faster-doc',
        name: 'Faster Documentation',
        description: 'Quick outpatient clinic visit for a rash.',
        mockTranscript: "Patient comes in complaining of an itchy, red rash on the right forearm that started 2 days ago after hiking. It is raised and blistering. It looks like typical contact dermatitis, likely poison ivy. We will start on topical hydrocortisone and over the counter diphenhydramine as needed."
    }
];
