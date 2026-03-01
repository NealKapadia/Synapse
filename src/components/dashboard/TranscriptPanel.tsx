"use client";

import { RefreshCw, Play } from "lucide-react";

interface TranscriptPanelProps {
    transcript: string;
    onChange: (val: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export function TranscriptPanel({ transcript, onChange, onAnalyze, isAnalyzing }: TranscriptPanelProps) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 rounded-t-xl">
                <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    Clinical Transcript
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => onChange("")}
                        className="p-2 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        title="Clear Transcript"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 relative flex flex-col">
                <textarea
                    value={transcript}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Start recording, upload an audio file, or type/paste a clinical transcript here..."
                    className="w-full flex-1 bg-transparent border-0 focus:ring-0 resize-none outline-none text-neutral-800 dark:text-neutral-200 leading-relaxed text-lg pb-16 h-full"
                />

                {/* Analyze Button overlays at the bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-end">
                    <button
                        onClick={onAnalyze}
                        disabled={!transcript.trim() || isAnalyzing}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all ${!transcript.trim()
                            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-500"
                            : isAnalyzing
                                ? "bg-blue-400 text-white cursor-wait"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
                            }`}
                    >
                        {isAnalyzing ? (
                            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        ) : (
                            <Play className="w-5 h-5 fill-current" />
                        )}
                        {isAnalyzing ? "Analyzing..." : "Extract Insights"}
                    </button>
                </div>
            </div>
        </div>
    );
}
