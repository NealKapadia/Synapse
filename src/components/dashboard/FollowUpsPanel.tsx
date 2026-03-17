"use client";

import { AnalysisResult } from "@/lib/types";
import { Bot, MessageCircleQuestion, Sparkles } from "lucide-react";

interface FollowUpsPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function FollowUpsPanel({ result, isAnalyzing }: FollowUpsPanelProps) {
  const followUps = result?.agentic_follow_ups || [];

  if (!followUps.length && !isAnalyzing) {
    return (
      <div className="glass p-5 h-full flex flex-col items-center justify-center min-h-[200px]">
        <Bot className="w-10 h-10 text-slate-700 mb-3" />
        <p className="text-sm text-slate-500 font-medium">Agentic Follow-ups</p>
        <p className="text-xs text-slate-600 mt-1">AI-generated interview questions</p>
      </div>
    );
  }

  if (isAnalyzing && !followUps.length) {
    return (
      <div className="glass p-5 h-full flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-violet-400/30" />
          <div className="absolute inset-0 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
          <Bot className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
        </div>
        <p className="text-sm text-violet-400 font-medium">Generating questions...</p>
      </div>
    );
  }

  return (
    <div className="glass p-5 h-full">
      <p className="section-label mb-2 flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        Agentic Follow-ups
      </p>
      <p className="text-[10px] text-slate-500 mb-4">Critical questions to close diagnostic gaps</p>

      <div className="space-y-2.5">
        {followUps.map((q, idx) => (
          <div
            key={idx}
            className={`group flex items-start gap-3 p-3.5 rounded-xl bg-violet-500/[0.04] border border-violet-500/10 hover:bg-violet-500/[0.08] hover:border-violet-500/20 transition-all cursor-default fade-in stagger-${Math.min(idx + 1, 6)}`}
          >
            <div className="w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <MessageCircleQuestion className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] text-violet-400/60 font-semibold uppercase tracking-wider mb-0.5">Question {idx + 1}</p>
              <p className="text-sm text-slate-200 leading-relaxed">{q}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
