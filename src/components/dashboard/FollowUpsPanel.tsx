"use client";

import { AnalysisResult } from "@/lib/types";
import { Bot, MessageCircleQuestion } from "lucide-react";

interface FollowUpsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function FollowUpsPanel({ result, isAnalyzing }: FollowUpsPanelProps) {
  const followUps = result?.agentic_follow_ups || [];
  const hasFollowUps = followUps.length > 0;

  if (!hasFollowUps && !isAnalyzing) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="section-label mb-3 flex items-center gap-2">
          <Bot className="w-3 h-3" />
          Agentic Follow-ups
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-slate-500">Awaiting analysis...</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing && !hasFollowUps) {
    return (
      <div className="glass-card p-4 h-full flex flex-col">
        <div className="section-label mb-3 flex items-center gap-2">
          <Bot className="w-3 h-3" />
          Agentic Follow-ups
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-violet-400">Generating questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 h-full flex flex-col overflow-hidden">
      <div className="section-label mb-3 flex items-center gap-2">
        <Bot className="w-3 h-3" />
        Agentic Follow-ups
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {followUps.map((q, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-violet-500/[0.06] border border-violet-500/10 hover:bg-violet-500/10 transition-colors"
          >
            <MessageCircleQuestion className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-200 leading-relaxed">{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
