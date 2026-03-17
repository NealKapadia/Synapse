"use client";

import { RefreshCw, Sparkles } from "lucide-react";

interface TranscriptPanelProps {
  transcript: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function TranscriptPanel({ transcript, onChange, onAnalyze, isAnalyzing }: TranscriptPanelProps) {
  return (
    <div className="glass flex flex-col min-h-[350px]">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between shrink-0">
        <span className="section-label flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Live Clinical Transcript
          {transcript.trim() && (
            <span className="text-[9px] text-slate-600 font-mono ml-1">
              {transcript.trim().split(/\s+/).length}w
            </span>
          )}
        </span>
        <button
          onClick={() => onChange("")}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors"
          title="Clear Transcript"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transcript area */}
      <div className="flex-1 relative">
        <textarea
          value={transcript}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start recording, upload an audio file, or type/paste a clinical transcript here..."
          className="w-full h-full min-h-[280px] bg-transparent border-0 resize-none outline-none text-sm text-slate-200 leading-relaxed p-5 pb-16 placeholder:text-slate-700"
        />

        {/* Analyze button */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          {transcript.trim() && !isAnalyzing && (
            <span className="text-[10px] text-slate-600 font-mono hidden sm:block">
              Ctrl+Enter
            </span>
          )}
          <div className="ml-auto">
            <button
              onClick={onAnalyze}
              disabled={!transcript.trim() || isAnalyzing}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-semibold transition-all min-h-[48px] ${
                !transcript.trim()
                  ? "bg-white/[0.03] text-slate-700 cursor-not-allowed"
                  : isAnalyzing
                    ? "bg-blue-500/15 text-blue-300 cursor-wait glow-blue"
                    : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 hover:from-blue-500/30 hover:to-cyan-500/30 glow-blue"
              }`}
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-blue-300 rounded-full border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isAnalyzing ? "Analyzing..." : "Extract Insights"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
