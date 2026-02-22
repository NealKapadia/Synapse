"use client";

import { useState } from "react";
import { FileUpload } from "@/components/audio/FileUpload";
import { LiveMic } from "@/components/audio/LiveMic";
import { Scenarios } from "@/components/dashboard/Scenarios";
import { TranscriptPanel } from "@/components/dashboard/TranscriptPanel";
import { StructuredData } from "@/components/dashboard/StructuredData";
import { FHIRExport } from "@/components/dashboard/FHIRExport";
import { AnalysisResult } from "@/lib/types";
import { Activity } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze transcript");
      }

      const data = await response.json();
      setAnalysisResult(data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze transcript. Check your API key and connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aegis Diagnostic Assistant</h1>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Column: Input Methods */}
        <section className="col-span-1 lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Select Scenario</h2>
            <Scenarios onSelectScenario={handleTranscript} />
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Audio Input</h2>
            <div className="space-y-4">
              <LiveMic onTranscript={handleTranscript} />
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs">OR</span>
                <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
              </div>
              <FileUpload onTranscript={handleTranscript} />
            </div>
          </div>
        </section>

        {/* Middle Column: Raw Transcript & Analysis */}
        <section className="col-span-1 lg:col-span-4 space-y-6 flex flex-col">
          <TranscriptPanel
            transcript={transcript}
            onChange={setTranscript}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </section>

        {/* Right Column: Extracted Data & FHIR */}
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">Structured Medical Data</h2>
            <StructuredData result={analysisResult} />
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-2">FHIR JSON Export Preview</h2>
            <FHIRExport result={analysisResult} />
          </div>
        </section>
      </main>
    </div>
  );
}
