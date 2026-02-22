"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

const MESSAGES = [
    "Transcribing clinical audio...",
    "Cross-referencing Axxess protocols...",
    "Mapping ICD-10 codes...",
    "Generating multilingual patient plan..."
];

export function LoadingOverlay() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-500/20 relative z-10 flex items-center justify-center">
                    <Activity className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
            </div>

            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
                Aegis AI is Processing
            </h3>

            <div className="h-8 flex items-center justify-center overflow-hidden w-full max-w-sm relative">
                <p
                    key={messageIndex}
                    className="text-neutral-500 dark:text-neutral-400 font-medium animate-in slide-in-from-bottom-4 fade-in duration-500 absolute"
                >
                    {MESSAGES[messageIndex]}
                </p>
            </div>
        </div>
    );
}
