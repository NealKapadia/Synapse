"use client";

import { AnalysisResult } from "@/lib/types";
import { Activity, AlertCircle, Heart, Wind, Droplets, Thermometer, Zap } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface VitalsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const VITAL_ICONS: Record<string, typeof Heart> = {
  heartRate: Heart,
  bloodPressure: Zap,
  respiratoryRate: Wind,
  spO2: Droplets,
  temperature: Thermometer,
  bloodGlucose: Activity,
};

function formatVitalKey(key: string): string {
  const map: Record<string, string> = {
    heartRate: "Heart Rate",
    bloodPressure: "Blood Pressure",
    respiratoryRate: "Resp Rate",
    spO2: "SpO2",
    temperature: "Temperature",
    bloodGlucose: "Glucose",
  };
  return map[key] || key.replace(/([A-Z])/g, " $1").trim();
}

export function VitalsPanel({ result, isAnalyzing }: VitalsPanelProps) {
  const vitals = result?.vitals;
  const hasVitals = vitals && Object.keys(vitals).length > 0;

  if (!hasVitals && (!isAnalyzing || result)) {
    return (
      <div className="glass p-5 h-full flex flex-col items-center justify-center min-h-[200px]">
        <Activity className="w-10 h-10 text-slate-700 mb-3" />
        <p className="text-sm text-slate-500 font-medium">Vital Signs</p>
        <p className="text-xs text-slate-600 mt-1">Awaiting transcript analysis</p>
      </div>
    );
  }

  if (isAnalyzing && !result) {
    return (
      <div className="glass p-5 h-full flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30" />
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          <Activity className="absolute inset-0 m-auto w-5 h-5 text-blue-400" />
        </div>
        <p className="text-sm text-blue-400 font-medium">Reading vitals...</p>
      </div>
    );
  }

  const vitalEntries = Object.entries(vitals || {}).filter(([_, v]) => v != null && typeof v === 'object');

  return (
    <div className="glass p-5 h-full">
      <p className="section-label mb-4 flex items-center gap-2">
        <Activity className="w-3 h-3" />
        Vital Signs
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vitalEntries.map(([key, vital], i) => {
          const isAbnormal = vital.is_abnormal;
          const IconComp = VITAL_ICONS[key] || Activity;
          return (
            <TiltCard
              key={key}
              className={`relative rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all border fade-in stagger-${Math.min(i + 1, 6)} ${isAbnormal
                  ? "bg-red-500/8 border-red-500/20 glow-red"
                  : "bg-white/[0.02] border-white/[0.05]"
                }`}
            >
              <IconComp className={`w-4 h-4 mb-2 ${isAbnormal ? "text-red-400" : "text-slate-500"}`} />
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                {formatVitalKey(key)}
              </span>
              <span className={`text-xl font-bold vital-value leading-tight ${isAbnormal ? "text-red-400" : "text-white"}`}>
                {vital.measurement}
              </span>
              {isAbnormal && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-[9px] text-red-400 font-semibold uppercase">Abnormal</span>
                </div>
              )}
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
