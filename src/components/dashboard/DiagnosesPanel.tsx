"use client";

import { AnalysisResult } from "@/lib/types";
import { Stethoscope, Pill, ChevronRight, Activity } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface DiagnosesPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

function confidenceColor(score: number) {
  if (score > 75) return { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15", glow: "shadow-[0_0_12px_rgba(34,197,94,0.25)]", label: "High" };
  if (score > 50) return { bar: "bg-amber-500", text: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/15", glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]", label: "Moderate" };
  return { bar: "bg-red-500", text: "text-red-400", bg: "bg-red-500/8 border-red-500/15", glow: "shadow-[0_0_12px_rgba(239,68,68,0.25)]", label: "Low" };
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
    <div className="glass p-5 h-full flex flex-col gap-4">
      {/* Diagnoses */}
      <div>
        <p className="section-label mb-3 flex items-center gap-2">
          <Stethoscope className="w-3 h-3" />
          Diagnoses & ICD-10
        </p>

        <div className="space-y-3">
          {diagnoses.map((d, i) => {
            const colors = confidenceColor(d.confidence_score);
            return (
              <TiltCard
                key={i}
                className={`glass-inner p-4 space-y-3 fade-in stagger-${Math.min(i + 1, 6)}`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/12 text-indigo-300 border border-indigo-500/15 shrink-0">
                        {d.icd_10_code}
                      </span>
                      {i === 0 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/12 text-teal-400 border border-teal-500/15 font-semibold uppercase tracking-wider">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-white leading-tight">{d.condition_name}</p>
                  </div>

                  {/* Confidence badge */}
                  {d.confidence_score !== undefined && (
                    <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border shrink-0 ${colors.bg} ${colors.glow}`}>
                      <span className={`text-xl font-bold tabular-nums leading-none ${colors.text}`}>
                        {d.confidence_score}%
                      </span>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider mt-0.5 ${colors.text} opacity-70`}>
                        {colors.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confidence bar */}
                {d.confidence_score !== undefined && (
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
                      style={{ width: `${d.confidence_score}%` }}
                    />
                  </div>
                )}

                {/* Differential diagnoses */}
                {d.differential_diagnoses && d.differential_diagnoses.length > 0 && (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1.5">Differentials to Rule Out</p>
                    <div className="flex flex-wrap gap-1.5">
                      {d.differential_diagnoses.map((diff, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-white/[0.03] text-slate-400 border border-white/[0.05]">
                          <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                          {diff}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Treatments */}
      {treatments.length > 0 && (
        <div className="pt-3 border-t border-white/[0.05]">
          <p className="section-label mb-3 flex items-center gap-2">
            <Pill className="w-3 h-3" />
            Recommended Treatments
          </p>
          <div className="space-y-2">
            {treatments.map((t, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 hover:bg-emerald-500/[0.07] transition-all fade-in stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
