"use client";

import { useState } from "react";
import { FileUpload } from "@/components/audio/FileUpload";
import { LiveMic } from "@/components/audio/LiveMic";
import { Scenarios } from "@/components/dashboard/Scenarios";
import { TranscriptPanel } from "@/components/dashboard/TranscriptPanel";
import { VitalsPanel } from "@/components/dashboard/VitalsPanel";
import { DiagnosesPanel } from "@/components/dashboard/DiagnosesPanel";
import { FollowUpsPanel } from "@/components/dashboard/FollowUpsPanel";
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
    <div className="h-screen flex flex-col bg-synapse overflow-hidden">
      {/* ── Header ── */}
      <header className="shrink-0 h-14 px-6 flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <AppLogo />
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm font-semibold text-white tracking-tight">Synapse</h1>
            <span className="text-[10px] text-slate-500 font-medium">AI Second Responder</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-medium">System Online</span>
          </div>
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <main className="flex-1 min-h-0 p-3 grid grid-cols-12 grid-rows-[1fr_1fr_auto] gap-3">
        {/* ── Zone A: Left Column (Audio + Scenarios + Transcript) ── */}
        <section className="col-span-4 row-span-2 flex flex-col gap-3 min-h-0">
          {/* Audio Controls */}
          <div className="glass-card p-4 shrink-0">
            <div className="section-label mb-3">Audio Input</div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <LiveMic onTranscript={handleTranscript} />
              </div>
            </div>
            <FileUpload onTranscript={handleTranscript} />

            {/* Waveform visualization */}
            <div className="mt-3 flex items-end justify-center gap-[3px] h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-blue-400/30 rounded-full waveform-bar"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    height: "20%",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scenarios */}
          <div className="glass-card p-4 shrink-0">
            <div className="section-label mb-2">Demo Scenarios</div>
            <Scenarios onSelectScenario={handleTranscript} />
          </div>

          {/* Transcript */}
          <div className="flex-1 min-h-0">
            <TranscriptPanel
              transcript={transcript}
              onChange={setTranscript}
              onAnalyze={() => handleAnalyze("English")}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </section>

        {/* ── Zone B: Vitals (Top Right) ── */}
        <section className="col-span-4 row-span-1 min-h-0">
          <VitalsPanel result={analysisResult} isAnalyzing={isAnalyzing} />
        </section>

        {/* ── Zone C: Diagnoses (Middle Right) ── */}
        <section className="col-span-4 row-span-2 min-h-0">
          <DiagnosesPanel result={analysisResult} isAnalyzing={isAnalyzing} />
        </section>

        {/* ── Zone D: Follow-ups (Bottom of middle) ── */}
        <section className="col-span-4 row-span-1 min-h-0">
          <FollowUpsPanel result={analysisResult} isAnalyzing={isAnalyzing} />
        </section>

        {/* ── Zone E: PCR Export (Bottom Span) ── */}
        <section className="col-span-12 row-span-1 shrink-0">
          <PCRExport result={analysisResult} />
        </section>
      </main>
    </div>
  );
}
