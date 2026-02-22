"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import { DownloadCloud, Check, FileJson } from "lucide-react";

export function FHIRExport({ result }: { result: AnalysisResult | null }) {
    const [copied, setCopied] = useState(false);

    if (!result || !result.fhirBundle) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 min-h-0">
                <FileJson className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">FHIR Bundle will appear here.</p>
            </div>
        );
    }

    const jsonString = JSON.stringify(result.fhirBundle, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fhir-encounter-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-end mb-3 gap-2 shrink-0">
                <button
                    onClick={handleCopy}
                    className="text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <FileJson className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy JSON"}
                </button>
                <button
                    onClick={handleDownload}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    Export to Epic EMR
                </button>
            </div>

            <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 bg-neutral-800/80 px-4 py-1.5 text-xs text-neutral-400 font-mono flex items-center justify-between border-b border-neutral-700 backdrop-blur-md">
                    <span>bundle.json</span>
                    <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-0.5 rounded uppercase tracking-wider">Valid FHIR R4</span>
                </div>
                <div className="h-auto overflow-x-auto pt-8 p-4">
                    <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap word-break pb-4">
                        {jsonString}
                    </pre>
                </div>
            </div>
        </div>
    );
}
