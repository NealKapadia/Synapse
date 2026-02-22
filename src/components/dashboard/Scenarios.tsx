"use client";

import { SCENARIOS } from "@/lib/types";

interface ScenariosProps {
    onSelectScenario: (transcript: string) => void;
}

export function Scenarios({ onSelectScenario }: ScenariosProps) {
    return (
        <div className="flex flex-col gap-3">
            {SCENARIOS.map((scenario) => (
                <button
                    key={scenario.id}
                    onClick={() => onSelectScenario(scenario.mockTranscript)}
                    className="text-left w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{scenario.name}</div>
                    <div className="text-sm text-neutral-500 line-clamp-2 mt-1">{scenario.description}</div>
                </button>
            ))}
        </div>
    );
}
