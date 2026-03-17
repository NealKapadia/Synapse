"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUpload } from "@/components/audio/FileUpload";
import { LiveMic } from "@/components/audio/LiveMic";
import { Scenarios } from "@/components/dashboard/Scenarios";
import { TranscriptPanel } from "@/components/dashboard/TranscriptPanel";
import { SeverityGauge } from "@/components/dashboard/SeverityGauge";
import { VitalsPanel } from "@/components/dashboard/VitalsPanel";
import { DiagnosesPanel } from "@/components/dashboard/DiagnosesPanel";
import { FollowUpsPanel } from "@/components/dashboard/FollowUpsPanel";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import { RadioReport } from "@/components/dashboard/RadioReport";
import { PCRExport } from "@/components/dashboard/PCRExport";
import { AppLogo } from "@/components/dashboard/AppLogo";
import { AnalysisResult } from "@/lib/types";
import toast from "react-hot-toast";

const POLL_INTERVAL = 10_000;

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const transcriptRef = useRef(transcript);
  const isAnalyzingRef = useRef(false);

  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { isAnalyzingRef.current = isAnalyzing; }, [isAnalyzing]);

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleAnalyze = useCallback(async () => {
    const text = transcriptRef.current;
    if (!text.trim() || isAnalyzingRef.current) return;
    setIsAnalyzing(true);
    setAnalysisResult(null); // Clear previous results

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "English" }),
      });

      if (!response.ok) throw new Error("Failed to analyze transcript");

      const data = await response.json();
      setAnalysisResult(data);
      setLastAnalyzed(new Date());
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze transcript. Check your API key and connection.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // 10-second polling when recording is active
  useEffect(() => {
    if (!isRecording) return;

    const intervalId = setInterval(() => {
      if (transcriptRef.current.trim()) {
        handleAnalyze();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isRecording, handleAnalyze]);

  const handleRecordingChange = useCallback((recording: boolean) => {
    setIsRecording(recording);
  }, []);

  // Keyboard shortcut: Ctrl+Enter to analyze
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleAnalyze]);

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
          <div className="flex items-center gap-3">
            {lastAnalyzed && (
              <span className="hidden md:block text-[10px] text-slate-600 font-mono">
                Last analyzed {lastAnalyzed.toLocaleTimeString()}
              </span>
            )}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                  </span>
                  <span className="text-[11px] text-red-300 font-semibold">AI Active</span>
                  <span className="text-[9px] text-red-400/60 font-mono">10s poll</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-inner">
              <span className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-400" : "bg-emerald-400"} animate-pulse`} />
              <span className="text-[11px] text-slate-400 font-medium">{isRecording ? "Recording" : "System Online"}</span>
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
                <LiveMic onTranscript={handleTranscript} onRecordingChange={handleRecordingChange} />
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
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* ── Right Column: Results ── */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Row 1: Severity + Vitals */}
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 xl:grid-cols-2 gap-5"
              >
                <div className="perspective-container">
                  <SeverityGauge result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
                <div className="perspective-container">
                  <VitalsPanel result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
              </motion.div>

              {/* Row 2: Diagnoses + Follow-ups */}
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-5"
              >
                <div className="perspective-container">
                  <DiagnosesPanel result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
                <div className="perspective-container">
                  <FollowUpsPanel result={analysisResult} isAnalyzing={isAnalyzing} />
                </div>
              </motion.div>

              {/* Row 3: MIST Radio Report */}
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="perspective-container"
              >
                <RadioReport result={analysisResult} isAnalyzing={isAnalyzing} />
              </motion.div>

              {/* Row 4: Timeline */}
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="perspective-container"
              >
                <TimelinePanel result={analysisResult} isAnalyzing={isAnalyzing} />
              </motion.div>

              {/* Row 5: PCR Export */}
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <PCRExport result={analysisResult} />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
