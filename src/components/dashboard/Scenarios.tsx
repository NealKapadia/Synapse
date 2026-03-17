"use client";

import { SCENARIOS } from "@/lib/types";

interface ScenariosProps {
  onSelectScenario: (transcript: string) => void;
}

export function Scenarios({ onSelectScenario }: ScenariosProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {SCENARIOS.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelectScenario(scenario.mockTranscript)}
          className="text-left w-full px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-blue-500/30 transition-all group"
        >
          <div className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">{scenario.name}</div>
          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{scenario.description}</div>
        </button>
      ))}
    </div>
  );
}
