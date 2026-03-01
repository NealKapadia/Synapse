"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import { DownloadCloud, Check, FileText } from "lucide-react";
import toast from "react-hot-toast";

export function PCRExport({ result }: { result: AnalysisResult | null }) {
    const [copied, setCopied] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    if (!result || !result.patientCareReport) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 min-h-0">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Patient Care Report (PCR) will appear here.</p>
            </div>
        );
    }

    const reportText = result.patientCareReport;

    const handleCopy = () => {
        navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([reportText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pcr-export-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Successfully exported PCR.");
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700/50">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="peer appearance-none w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                            checked={isVerified}
                            onChange={(e) => setIsVerified(e.target.checked)}
                        />
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors select-none">
                        I, the attending first responder, have reviewed this AI-generated PCR narrative and verify its clinical accuracy in accordance with HIPAA standards.
                    </span>
                </label>

                <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <button
                        onClick={handleCopy}
                        className="text-xs w-full justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <FileText className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy PCR"}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!isVerified}
                        className="text-xs w-full justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-md flex items-center gap-1.5 transition-all shadow-sm"
                    >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        Export PCR Document
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 bg-neutral-800/80 px-4 py-1.5 text-xs text-neutral-400 font-mono flex items-center justify-between border-b border-neutral-700 backdrop-blur-md">
                    <span>pcr_narrative.txt</span>
                    <span className="text-[10px] text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-wider">PCR Narrative</span>
                </div>
                <div className="h-auto overflow-y-auto pt-10 pb-4 px-4 max-h-[500px]">
                    <p className="text-sm font-sans text-neutral-100 whitespace-pre-wrap leading-relaxed">
                        {reportText}
                    </p>
                </div>
            </div>
        </div>
    );
}
