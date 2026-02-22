"use client";

import { AnalysisResult } from "@/lib/types";
import { Stethoscope, Activity, Pill, AlertCircle, HeartPulse, UserCircle } from "lucide-react";

export function StructuredData({ result }: { result: AnalysisResult | null }) {
    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 min-h-0">
                <Activity className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Awaiting transcript analysis...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 pr-2 space-y-6">

            {/* Vitals & Symptoms Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Vitals */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400 font-semibold">
                        <HeartPulse className="w-4 h-4" /> Vitals
                    </div>
                    <div className="space-y-2 text-sm">
                        {Object.keys(result.vitals || {}).length > 0 ? (
                            Object.entries(result.vitals || {}).map(([k, v]) => (
                                <div key={k} className="flex justify-between border-b border-blue-200/50 dark:border-blue-800/30 pb-1">
                                    <span className="text-neutral-600 dark:text-neutral-400 capitalize">{k}:</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-200">{String(v)}</span>
                                </div>
                            ))
                        ) : <span className="text-neutral-500 italic">None mentioned</span>}
                    </div>
                </div>

                {/* Symptoms */}
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-2 mb-3 text-orange-700 dark:text-orange-400 font-semibold">
                        <AlertCircle className="w-4 h-4" /> Symptoms
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
                        {(result.symptoms || []).length > 0 ? (
                            (result.symptoms || []).map((s, i) => <li key={i}>{s}</li>)
                        ) : <span className="text-neutral-500 italic">None listed</span>}
                    </ul>
                </div>
            </div>

            {/* Diagnoses with ICD-10 */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-neutral-800 dark:text-neutral-200 font-semibold">
                    <Stethoscope className="w-5 h-5 text-indigo-500" /> Diagnoses & ICD-10
                </div>
                <div className="space-y-2">
                    {(result.diagnoses || []).map((d, i) => (
                        <div key={i} className="flex items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <span className="font-medium">{d.condition}</span>
                            <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2.5 py-1 rounded-md font-mono border border-indigo-200 dark:border-indigo-800">
                                {d.icd10}
                            </span>
                        </div>
                    ))}
                    {(result.diagnoses || []).length === 0 && <p className="text-sm text-neutral-500 italic">No specific diagnoses identified.</p>}
                </div>
            </div>

            {/* Treatments */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-neutral-800 dark:text-neutral-200 font-semibold">
                    <Pill className="w-5 h-5 text-emerald-500" /> Recommended Treatments
                </div>
                <div className="flex flex-wrap gap-2">
                    {(result.treatments || []).map((t, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm px-3 py-1.5 rounded-full">
                            {t}
                        </span>
                    ))}
                    {(result.treatments || []).length === 0 && <p className="text-sm text-neutral-500 italic">No treatments mentioned.</p>}
                </div>
            </div>

            {/* Patient Friendly Summary */}
            <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 rounded-xl p-5 mt-4">
                <div className="flex items-center gap-2 mb-3 text-violet-800 dark:text-violet-300 font-semibold text-lg border-b border-violet-200/50 dark:border-violet-800/30 pb-2">
                    <UserCircle className="w-6 h-6" /> Patient-Friendly Recovery Plan
                </div>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm whitespace-pre-wrap">
                    {result.patientSummary}
                </p>
            </div>

        </div>
    );
}
