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
      {/* Trigger Button */}
      <button
        onClick={() => result && setIsOpen(true)}
        disabled={!result?.patientCareReport}
        className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
          result?.patientCareReport
            ? "glass-card glow-teal text-teal-300 hover:bg-white/[0.06] cursor-pointer"
            : "glass-card text-slate-600 cursor-not-allowed"
        }`}
      >
        <FileText className="w-4 h-4" />
        Export Patient Care Report
        {result?.patientCareReport && (
          <span className="ml-auto w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        )}
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-4xl max-h-[85vh] mx-4 mb-4 flex flex-col slide-up">
            <div className="glass-card overflow-hidden flex flex-col" style={{ background: 'rgba(10, 14, 30, 0.95)', backdropFilter: 'blur(40px)' }}>
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Patient Care Report</h2>
                    <p className="text-[10px] text-slate-400">AI-generated PCR narrative</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-300 hover:bg-white/10 border border-white/[0.06] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!isVerified}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isVerified
                        ? "bg-teal-500/15 text-teal-300 border-teal-500/20 hover:bg-teal-500/25"
                        : "bg-white/[0.02] text-slate-600 border-white/5 cursor-not-allowed"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Verification Bar */}
              <div className="px-6 py-3 border-b border-white/[0.04] bg-white/[0.02]">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 checked:bg-teal-500 checked:border-teal-500 transition-all cursor-pointer"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                    />
                    <Check className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                  </div>
                  <Shield className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400 transition-colors" />
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                    I, the attending first responder, have reviewed this AI-generated PCR narrative and verify its clinical accuracy.
                  </span>
                </label>
              </div>

              {/* PCR Content */}
              <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
                <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
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
