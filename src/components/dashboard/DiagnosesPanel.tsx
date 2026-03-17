"use client";

import { AnalysisResult } from "@/lib/types";
import { Stethoscope, Pill } from "lucide-react";

interface DiagnosesPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

function confidenceColor(score: number): string {
  if (score > 85) return "bg-emerald-500";
  if (score > 60) return "bg-amber-500";
  return "bg-red-500";
}

function confidenceGlow(score: number): string {
  if (score > 85) return "shadow-[0_0_8px_rgba(34,197,94,0.3)]";
  if (score > 60) return "shadow-[0_0_8px_rgba(245,158,11,0.3)]";
  return "shadow-[0_0_8px_rgba(239,68,68,0.3)]";
}

export function DiagnosesPanel({ result, isAnalyzing }: DiagnosesPanelProps) {
  const diagnoses = result?.diagnoses || [];
  const treatments = result?.treatments || [];
  const hasDiagnoses = diagnoses.length > 0;

  if (!hasDiagnoses && !isAnalyzing) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="section-label mb-3 flex items-center gap-2">
          <Stethoscope className="w-3 h-3" />
          Diagnoses & ICD-10
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-slate-500">Awaiting analysis...</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing && !hasDiagnoses) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="section-label mb-3 flex items-center gap-2">
          <Stethoscope className="w-3 h-3" />
          Diagnoses & ICD-10
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-teal-400">Analyzing diagnoses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 h-full flex flex-col overflow-hidden">
      <div className="section-label mb-3 flex items-center gap-2">
        <Stethoscope className="w-3 h-3" />
        Diagnoses & ICD-10
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {diagnoses.map((d, i) => (
          <div
            key={i}
            className="glass-card-sm p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{d.condition_name}</p>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                  {d.icd_10_code}
                </span>
              </div>
              {d.confidence_score !== undefined && (
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] text-slate-400 mb-1">Confidence</span>
                  <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${confidenceColor(d.confidence_score)} ${confidenceGlow(d.confidence_score)}`}
                      style={{ width: `${d.confidence_score}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300 mt-0.5">
                    {d.confidence_score}%
                  </span>
                </div>
              )}
            </div>
            {d.differential_diagnoses && d.differential_diagnoses.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                {d.differential_diagnoses.map((diff, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
                  >
                    {diff}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {treatments.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="section-label mb-2 flex items-center gap-2">
              <Pill className="w-3 h-3" />
              Treatments
            </div>
            <div className="flex flex-wrap gap-1.5">
              {treatments.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
