"use client";

import { AnalysisResult } from "@/lib/types";
import { Stethoscope, Pill } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface DiagnosesPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

function confidenceColor(score: number) {
  if (score > 85) return { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-[0_0_12px_rgba(34,197,94,0.3)]" };
  if (score > 60) return { bar: "bg-amber-500", text: "text-amber-400", glow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]" };
  return { bar: "bg-red-500", text: "text-red-400", glow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]" };
}

export function DiagnosesPanel({ result, isAnalyzing }: DiagnosesPanelProps) {
  const diagnoses = result?.diagnoses || [];
  const treatments = result?.treatments || [];

  if (!diagnoses.length && !isAnalyzing) {
    return (
      <div className="glass p-5 h-full flex flex-col items-center justify-center min-h-[200px]">
        <Stethoscope className="w-10 h-10 text-slate-700 mb-3" />
        <p className="text-sm text-slate-500 font-medium">Diagnoses & ICD-10</p>
        <p className="text-xs text-slate-600 mt-1">Awaiting transcript analysis</p>
      </div>
    );
  }

  if (isAnalyzing && !diagnoses.length) {
    return (
      <div className="glass p-5 h-full flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-teal-400/30" />
          <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
          <Stethoscope className="absolute inset-0 m-auto w-5 h-5 text-teal-400" />
        </div>
        <p className="text-sm text-teal-400 font-medium">Analyzing diagnoses...</p>
      </div>
    );
  }

  return (
    <div className="glass p-5 h-full">
      <p className="section-label mb-4 flex items-center gap-2 text-base">
        <Stethoscope className="w-4 h-4 text-teal-400" />
        Diagnoses & ICD-10
      </p>

      <div className="space-y-3">
        {diagnoses.map((d, i) => {
          const colors = confidenceColor(d.confidence_score);
          return (
            <TiltCard
              key={i}
              className={`glass-inner p-4 space-y-3 fade-in stagger-${Math.min(i + 1, 6)} shadow-lg border border-white/10 hover:border-white/20 transition-all`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg md:text-xl font-bold text-white tracking-wide">{d.condition_name}</p>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 w-fit font-medium">
                      ICD-10: {d.icd_10_code}
                    </span>
                  </div>
                </div>
                {d.confidence_score !== undefined && (
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xl font-black tabular-nums ${colors.text} ${colors.glow} drop-shadow-md`}>
                      {d.confidence_score}%
                    </span>
                    <div className={`w-20 h-2 bg-white/5 rounded-full overflow-hidden`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
                        style={{ width: `${d.confidence_score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {d.differential_diagnoses && d.differential_diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mr-1 self-center">Differential:</span>
                  {d.differential_diagnoses.map((diff, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                      {diff}
                    </span>
                  ))}
                </div>
              )}
            </TiltCard>
          );
        })}
      </div>

      {treatments.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <p className="section-label mb-3 flex items-center gap-2 text-base">
            <Pill className="w-4 h-4 text-emerald-400" />
            Recommended Treatments
          </p>
          <div className="flex flex-col gap-2">
            {treatments.map((t, i) => (
              <div
                key={i}
                className={`text-sm px-3.5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium fade-in leading-relaxed stagger-${Math.min(i + 1, 6)}`}
              >
                • {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
