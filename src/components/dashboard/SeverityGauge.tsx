"use client";

import { AnalysisResult } from "@/lib/types";
import { AlertTriangle, ShieldAlert, Shield, ShieldCheck } from "lucide-react";

interface SeverityGaugeProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

function getSeverityConfig(score: number) {
  if (score >= 8) return { color: "#ef4444", bg: "rgba(239,68,68,0.08)", glow: "glow-critical", icon: ShieldAlert, gradient: "from-red-500 to-orange-500" };
  if (score >= 5) return { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", glow: "glow-serious", icon: AlertTriangle, gradient: "from-amber-500 to-yellow-500" };
  if (score >= 3) return { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", glow: "glow-moderate", icon: Shield, gradient: "from-blue-500 to-cyan-500" };
  return { color: "#22c55e", bg: "rgba(34,197,94,0.08)", glow: "glow-stable", icon: ShieldCheck, gradient: "from-emerald-500 to-green-500" };
}

export function SeverityGauge({ result, isAnalyzing }: SeverityGaugeProps) {
  const severity = result?.severity;
  const patientInfo = result?.patient_info;
  const mechanism = result?.mechanism_of_injury;
  const scene = result?.scene_assessment;
  const redFlags = result?.red_flags || [];

  if (!severity && (!isAnalyzing || result)) {
    return (
      <div className="glass p-6 h-full flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-sm text-slate-500 font-medium">Severity Assessment</p>
        <p className="text-xs text-slate-600 mt-1">Awaiting transcript analysis</p>
      </div>
    );
  }

  if (isAnalyzing && !result) {
    return (
      <div className="glass p-6 h-full flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 flex items-center justify-center mb-4 relative">
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-sm text-blue-400 font-medium">Assessing severity...</p>
      </div>
    );
  }

  if (!severity) return null;

  const config = getSeverityConfig(severity.score);
  const circumference = 2 * Math.PI * 42;
  const progress = (severity.score / 10) * circumference;
  const IconComponent = config.icon;

  return (
    <div className={`glass p-5 h-full overflow-hidden flex flex-col ${config.glow}`}>
      <div className="flex gap-5">
        {/* Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative">
            <svg width="110" height="110" viewBox="0 0 100 100" className="drop-shadow-lg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={config.color}
                strokeWidth="5"
                strokeDasharray={`${progress} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="gauge-animate"
                style={{ filter: `drop-shadow(0 0 8px ${config.color})` }}
              />
              <text x="50" y="44" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" fontFamily="Space Grotesk">{severity.score}</text>
              <text x="50" y="56" textAnchor="middle" fill={config.color} fontSize="7" fontWeight="700" letterSpacing="0.1em" style={{ textTransform: "uppercase" }}>{severity.label}</text>
            </svg>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0 gap-2">
          {patientInfo && (
            <div>
              <p className="section-label mb-0.5">Patient</p>
              <p className="text-sm text-white font-semibold">{patientInfo.age} {patientInfo.sex}</p>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{patientInfo.chief_complaint}</p>
            </div>
          )}
          {mechanism && mechanism !== "N/A" && (
            <div>
              <p className="section-label mb-0.5">Mechanism</p>
              <p className="text-xs text-slate-300 leading-relaxed">{mechanism}</p>
            </div>
          )}
          {scene && (
            <div>
              <p className="section-label mb-0.5">Scene</p>
              <p className="text-xs text-slate-400 leading-relaxed">{scene}</p>
            </div>
          )}
        </div>
      </div>

      {/* Severity Rationale */}
      {severity.rationale && (
        <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: config.bg }}>
          <p className="text-[11px] leading-relaxed" style={{ color: config.color }}>{severity.rationale}</p>
        </div>
      )}

      {/* Red Flags */}
      {redFlags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex-1 min-h-0 overflow-y-auto">
          <p className="section-label mb-2 flex items-center gap-1.5">
            <IconComponent className="w-3 h-3" style={{ color: config.color }} />
            Red Flags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {redFlags.slice(0, 5).map((flag, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: config.bg }}>
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: config.color }} />
                <p className="text-[11px] leading-tight" style={{ color: config.color }}>{flag}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
