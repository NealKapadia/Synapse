"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import { FileText, X, Check, Copy, Download, Shield } from "lucide-react";
import toast from "react-hot-toast";

interface PCRExportProps {
  result: AnalysisResult | null;
}

export function PCRExport({ result }: PCRExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const reportText = result?.patientCareReport || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast.success("PCR copied to clipboard");
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
    toast.success("PCR exported successfully");
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => result?.patientCareReport && setIsOpen(true)}
        disabled={!result?.patientCareReport}
        className={`w-full glass flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${
          result?.patientCareReport
            ? "glow-teal text-teal-300 hover:bg-white/[0.04] cursor-pointer"
            : "text-slate-600 cursor-not-allowed"
        }`}
      >
        <FileText className="w-5 h-5" />
        <span>Export Patient Care Report</span>
        {result?.patientCareReport && (
          <span className="ml-2 w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ animation: 'fade-in-up 0.3s ease-out forwards' }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-4xl max-h-[90vh] mx-3 sm:mx-6 mb-3 sm:mb-0 flex flex-col slide-up">
            <div className="glass overflow-hidden flex flex-col" style={{ background: 'rgba(8, 12, 28, 0.97)', backdropFilter: 'blur(40px)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/12 flex items-center justify-center">
                    <FileText className="w-4.5 h-4.5 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Patient Care Report</h2>
                    <p className="text-[10px] text-slate-500">AI-generated PCR narrative</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06] transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={handleDownload} disabled={!isVerified} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${isVerified ? "bg-teal-500/12 text-teal-300 border-teal-500/20 hover:bg-teal-500/20" : "bg-white/[0.02] text-slate-600 border-white/[0.04] cursor-not-allowed"}`}>
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors ml-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Verification */}
              <div className="px-6 py-3 border-b border-white/[0.03] bg-white/[0.01]">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input type="checkbox" className="peer appearance-none w-4.5 h-4.5 border border-white/15 rounded-md bg-white/5 checked:bg-teal-500 checked:border-teal-500 transition-all cursor-pointer" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
                    <Check className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                  </div>
                  <Shield className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                    I, the attending first responder, have reviewed this AI-generated PCR narrative and verify its clinical accuracy.
                  </span>
                </label>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
                <div className="font-mono text-[13px] text-slate-300 whitespace-pre-wrap leading-[1.8]">
                  {reportText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
