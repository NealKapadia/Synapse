"use client";

import { AnalysisResult } from "@/lib/types";
import { Activity, AlertCircle } from "lucide-react";

interface VitalsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const VITAL_CONFIG: Record<string, { label: string; unit: string; icon: string }> = {
  heartRate: { label: "HR", unit: "bpm", icon: "heart" },
  bloodPressure: { label: "BP", unit: "mmHg", icon: "bp" },
  respiratoryRate: { label: "RR", unit: "/min", icon: "lungs" },
  spO2: { label: "SpO2", unit: "%", icon: "o2" },
  temperature: { label: "Temp", unit: "°F", icon: "temp" },
  bloodGlucose: { label: "Glucose", unit: "mg/dL", icon: "glucose" },
};

function formatVitalKey(key: string): string {
  const config = VITAL_CONFIG[key];
  if (config) return config.label;
  return key.replace(/([A-Z])/g, " $1").trim();
}

export function VitalsPanel({ result, isAnalyzing }: VitalsPanelProps) {
  const vitals = result?.vitals;
  const hasVitals = vitals && Object.keys(vitals).length > 0;

  if (!hasVitals && !isAnalyzing) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="section-label mb-3 flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Vitals
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-slate-500">Awaiting analysis...</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing && !hasVitals) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="section-label mb-3 flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Vitals
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-blue-400">Reading vitals...</p>
          </div>
        </div>
      </div>
    );
  }

  const vitalEntries = Object.entries(vitals || {});

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="section-label mb-3 flex items-center gap-2">
        <Activity className="w-3 h-3" />
        Vitals
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1 content-start">
        {vitalEntries.map(([key, vital]) => {
          const isAbnormal = vital.is_abnormal;
          return (
            <div
              key={key}
              className={`rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition-all ${
                isAbnormal
                  ? "bg-red-500/10 border border-red-500/20 glow-red"
                  : "bg-white/[0.03] border border-white/[0.06]"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                {formatVitalKey(key)}
              </span>
              <span
                className={`text-base font-semibold vital-value leading-tight ${
                  isAbnormal ? "text-red-400" : "text-white"
                }`}
              >
                {vital.measurement}
              </span>
              {isAbnormal && (
                <AlertCircle className="w-3 h-3 text-red-400 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
