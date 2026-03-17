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
      <p className="section-label mb-3 flex items-center gap-2">
        <Stethoscope className="w-3 h-3" />
        Diagnoses & ICD-10
      </p>

      <div className="space-y-2">
        {diagnoses.map((d, i) => {
          const colors = confidenceColor(d.confidence_score);
          return (
            <TiltCard
              key={i}
              className={`glass-inner p-3 space-y-2 fade-in stagger-${Math.min(i + 1, 6)}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{d.condition_name}</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/12 text-indigo-300 border border-indigo-500/15">
                      {d.icd_10_code}
                    </span>
                  </div>
                </div>
                {d.confidence_score !== undefined && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`w-16 h-1.5 bg-white/5 rounded-full overflow-hidden ${colors.glow}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
                        style={{ width: `${d.confidence_score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${colors.text}`}>
                      {d.confidence_score}%
                    </span>
                  </div>
                )}
              </div>
              {d.differential_diagnoses && d.differential_diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1.5 border-t border-white/[0.04]">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-medium mr-1 self-center">DDx:</span>
                  {d.differential_diagnoses.map((diff, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.04]">
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
        <div className="mt-4 pt-3 border-t border-white/[0.04]">
          <p className="section-label mb-2 flex items-center gap-2">
            <Pill className="w-3 h-3" />
            Treatments
          </p>
          <div className="flex flex-wrap gap-1.5">
            {treatments.map((t, i) => (
              <span
                key={i}
                className={`text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/8 text-emerald-300 border border-emerald-500/15 font-medium fade-in stagger-${Math.min(i + 1, 6)}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
