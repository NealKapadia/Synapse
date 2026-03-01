"use client";

import { AnalysisResult } from "@/lib/types";
import { Stethoscope, Activity, Pill, AlertCircle, HeartPulse, Bot } from "lucide-react";

interface StructuredDataProps {
    result: AnalysisResult | null;
    isAnalyzing?: boolean;
}

export function StructuredData({ result, isAnalyzing }: StructuredDataProps) {
    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 min-h-0 relative">
                {isAnalyzing ? (
                    <Activity className="w-12 h-12 mb-3 opacity-50 animate-spin text-blue-500" />
                ) : (
                    <Activity className="w-12 h-12 mb-3 opacity-20" />
                )}
                <p className="text-sm">{isAnalyzing ? "Analyzing..." : "Awaiting transcript analysis..."}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 pr-2 space-y-6 relative">
            {isAnalyzing && (
                <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all rounded-xl">
                    <div className="flex flex-col items-center">
                        <Activity className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                        <span className="text-sm font-medium text-blue-600">Analyzing...</span>
                    </div>
                </div>
            )}

            {/* Vitals & Symptoms Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Vitals */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400 font-semibold">
                        <HeartPulse className="w-4 h-4" /> Vitals
                    </div>
                    <div className="space-y-2 text-sm">
                        {Object.keys(result.vitals || {}).length > 0 ? (
                            Object.entries(result.vitals || {}).map(([k, v]) => {
                                const isAbnormal = v.is_abnormal;
                                return (
                                    <div key={k} className="flex flex-col items-center justify-center border-b border-blue-200/50 dark:border-blue-800/30 pb-2 pt-1 px-1 w-full overflow-hidden text-center">
                                        <span className="text-neutral-500 dark:text-neutral-400 capitalize text-xs mb-0.5 break-words max-w-full">
                                            {k.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className={`font-semibold flex items-center justify-center gap-1 text-sm break-words max-w-full ${isAbnormal ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-200'}`}>
                                            {isAbnormal && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                            {v.measurement}
                                        </span>
                                    </div>
                                );
                            })
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
                <div className="space-y-4">
                    {(result.diagnoses || []).map((d, i) => (
                        <div key={i} className="flex flex-col bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="font-semibold text-base block">{d.condition_name}</span>
                                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2.5 py-0.5 rounded-md font-mono border border-indigo-200 dark:border-indigo-800 inline-block mt-1">
                                        {d.icd_10_code}
                                    </span>
                                </div>
                                {d.confidence_score !== undefined && (
                                    <div className="flex flex-col items-end">
                                        <div className="text-xs font-medium text-neutral-500 mb-1">Confidence</div>
                                        <div className="w-24 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${d.confidence_score > 85 ? 'bg-green-500' : d.confidence_score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${d.confidence_score}%` }}
                                            />
                                        </div>
                                        <div className="text-xs font-bold mt-1 text-neutral-700 dark:text-neutral-300">{d.confidence_score}%</div>
                                    </div>
                                )}
                            </div>
                            {d.differential_diagnoses && d.differential_diagnoses.length > 0 && (
                                <div className="mt-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Differentials Considered</span>
                                    <div className="flex flex-wrap gap-2">
                                        {d.differential_diagnoses.map((diff, idx) => (
                                            <span key={idx} className="text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                                                {diff}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
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

            {/* Agentic Insights */}
            {result.agentic_follow_ups && result.agentic_follow_ups.length > 0 && (
                <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-xl p-5 border border-fuchsia-200 dark:border-fuchsia-800 shadow-sm relative overflow-hidden mt-4">
                    <div className="flex items-center gap-2 mb-3 text-fuchsia-800 dark:text-fuchsia-300 font-semibold text-lg border-b border-fuchsia-200/50 dark:border-fuchsia-800/30 pb-3">
                        <Bot className="w-6 h-6" /> EMT Field Insights: Suggested Interview Questions
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-fuchsia-900 dark:text-fuchsia-100/90 leading-relaxed">
                        {result.agentic_follow_ups.map((q, idx) => (
                            <li key={idx} className="font-medium">{q}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
