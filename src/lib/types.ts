export interface AnalysisResult {
    vitals: Record<string, string>;
    symptoms: string[];
    diagnoses: { condition: string; icd10: string }[];
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
        mockTranscript: "Patient is a 55-year-old male presenting with severe, crushing chest pain radiating to the left arm that started 30 minutes ago. He reports shortness of breath and diaphoresis. Vitals show BP 160/95, HR 110, SpO2 94% on room air. He has a history of hypertension but no known coronary artery disease."
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
