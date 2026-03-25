"use client";

import { AnalysisResult } from "@/lib/types";
import { Radio, Copy, Check, Volume2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface RadioReportProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function RadioReport({ result, isAnalyzing }: RadioReportProps) {
  const [copied, setCopied] = useState(false);
  const script = result?.radio_handoff_script;

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Radio script copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
    if (!script || typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    toast.success("Reading radio script aloud...");
  };

  if (!script && (!isAnalyzing || result)) {
    return (
      <div className="glass p-5 flex flex-col items-center justify-center min-h-[100px]">
        <Radio className="w-6 h-6 text-slate-600 mb-2" />
        <p className="text-xs text-slate-500">Radio Report will appear after analysis</p>
      </div>
    );
  }

  if (isAnalyzing && !result) {
    return (
      <div className="glass p-5 flex items-center justify-center min-h-[100px]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-orange-400">Generating radio handoff...</p>
        </div>
      </div>
    );
  }

  if (!script) return null;

  return (
    <div className="glass p-5 overflow-hidden glow-radio">
      <div className="flex items-center justify-between mb-3">
        <p className="section-label flex items-center gap-2">
          <Radio className="w-4 h-4 text-orange-400" />
          <span>ER Radio Handoff</span>
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReadAloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-orange-500/8 text-orange-300 border border-orange-500/15 hover:bg-orange-500/15 transition-all min-h-[36px]"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Read Aloud
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06] hover:bg-white/[0.08] transition-all min-h-[36px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="relative rounded-xl bg-orange-500/[0.04] border border-orange-500/10 p-4">
        {/* Scanline effect */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(251,146,60,0.02)_2px,rgba(251,146,60,0.02)_4px)]" />
        </div>
        <p className="font-mono text-[13px] text-orange-100/90 leading-[1.8] whitespace-pre-wrap relative z-10">
          {script}
        </p>
      </div>
    </div>
  );
}
