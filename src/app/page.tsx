"use client";

import { useState } from "react";
import { FileUpload } from "@/components/audio/FileUpload";
import { LiveMic } from "@/components/audio/LiveMic";
import { Scenarios } from "@/components/dashboard/Scenarios";
import { TranscriptPanel } from "@/components/dashboard/TranscriptPanel";
import { SeverityGauge } from "@/components/dashboard/SeverityGauge";
import { VitalsPanel } from "@/components/dashboard/VitalsPanel";
import { DiagnosesPanel } from "@/components/dashboard/DiagnosesPanel";
import { FollowUpsPanel } from "@/components/dashboard/FollowUpsPanel";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import { PCRExport } from "@/components/dashboard/PCRExport";
import { AppLogo } from "@/components/dashboard/AppLogo";
import { AnalysisResult } from "@/lib/types";
import toast from "react-hot-toast";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleAnalyze = async (language: string = "English") => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, language }),
      });

      if (!response.ok) throw new Error("Failed to analyze transcript");

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
    <div className="min-h-screen bg-synapse relative">
      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 h-16 px-6 flex items-center justify-between border-b border-white/[0.04] bg-[#030712]/80 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <AppLogo />
            <div>
              <h1 className="text-lg font-bold text-gradient tracking-tight leading-none">Synapse</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">AI Second Responder</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-medium">System Online</span>
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-5">

            {/* ── Left Column: Input ── */}
            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 space-y-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
              {/* Audio Input */}
              <div className="glass p-5">
                <p className="section-label mb-3">Audio Input</p>
                <LiveMic onTranscript={handleTranscript} />
                <div className="my-3 flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] text-slate-600 font-medium">OR</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <FileUpload onTranscript={handleTranscript} />
              </div>

              {/* Demo Scenarios */}
              <div className="glass p-5">
                <p className="section-label mb-3">Demo Scenarios</p>
                <Scenarios onSelectScenario={handleTranscript} />
              </div>

              {/* Transcript */}
              <TranscriptPanel
                transcript={transcript}
                onChange={setTranscript}
                onAnalyze={() => handleAnalyze("English")}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* ── Right Column: Results ── */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Row 1: Severity + Vitals */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="perspective-container">
                  <SeverityGauge result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
                <div className="perspective-container">
                  <VitalsPanel result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
              </div>

              {/* Row 2: Diagnoses + Follow-ups */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="perspective-container">
                  <DiagnosesPanel result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
                <div className="perspective-container">
                  <FollowUpsPanel result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
              </div>

              {/* Row 3: Timeline */}
              <div className="perspective-container">
                <TimelinePanel result={analysisResult} isAnalyzing={isAnalyzing} />
              </div>

              {/* Row 4: PCR Export */}
              <PCRExport result={analysisResult} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
