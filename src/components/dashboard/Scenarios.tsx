"use client";

import { SCENARIOS } from "@/lib/types";

interface ScenariosProps {
  onSelectScenario: (transcript: string) => void;
}

export function Scenarios({ onSelectScenario }: ScenariosProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelectScenario(scenario.mockTranscript)}
          className="text-left w-full px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/20 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">{scenario.emoji}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{scenario.name}</div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{scenario.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
