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
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
        <span className="section-label flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Live Clinical Transcript
        </span>
        <button
          onClick={() => onChange("")}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          title="Clear Transcript"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transcript area */}
      <div className="flex-1 relative min-h-0">
        <textarea
          value={transcript}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start recording, upload an audio file, or type/paste a clinical transcript here..."
          className="w-full h-full bg-transparent border-0 resize-none outline-none text-sm text-slate-200 leading-relaxed p-4 pb-16 placeholder:text-slate-600"
        />

        {/* Analyze button */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-end">
          <button
            onClick={onAnalyze}
            disabled={!transcript.trim() || isAnalyzing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              !transcript.trim()
                ? "bg-white/5 text-slate-600 cursor-not-allowed"
                : isAnalyzing
                  ? "bg-blue-500/20 text-blue-300 cursor-wait glow-blue"
                  : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 glow-blue hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
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
  );
}
