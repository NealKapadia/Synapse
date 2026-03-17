"use client";

import { AnalysisResult } from "@/lib/types";
import { Clock, AlertCircle } from "lucide-react";

interface TimelinePanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function TimelinePanel({ result, isAnalyzing }: TimelinePanelProps) {
  const timeline = result?.clinical_timeline || [];
  const symptoms = result?.symptoms || [];

  if (!timeline.length && !symptoms.length && !isAnalyzing) {
    return (
      <div className="glass p-5 flex items-center justify-center min-h-[100px]">
        <div className="text-center">
          <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Clinical timeline will appear after analysis</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing && !timeline.length) {
    return (
      <div className="glass p-5 flex items-center justify-center min-h-[100px]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-cyan-400">Building clinical timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-5">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="flex-1 min-w-0">
            <p className="section-label mb-3 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Clinical Timeline
            </p>
            <div className="relative pl-4">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gradient-to-b from-cyan-500/40 via-blue-500/20 to-transparent" />
              <div className="space-y-2.5">
                {timeline.map((event, i) => (
                  <div key={i} className={`relative flex items-start gap-3 fade-in stagger-${Math.min(i + 1, 6)}`}>
                    <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-cyan-500/60 bg-[#030712]" />
                    <p className="text-xs text-slate-300 leading-relaxed pl-2">{event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <div className="sm:w-64 shrink-0">
            <p className="section-label mb-3 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Presenting Symptoms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((s, i) => (
                <span
                  key={i}
                  className={`text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/8 text-amber-300 border border-amber-500/15 fade-in stagger-${Math.min(i + 1, 6)}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
