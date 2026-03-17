"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Square } from "lucide-react";
import toast from "react-hot-toast";

interface LiveMicProps {
  onTranscript: (text: string) => void;
  onRecordingChange?: (isRecording: boolean) => void;
}

export function LiveMic({ onTranscript, onRecordingChange }: LiveMicProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);
  const shouldRestartRef = useRef(false);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Notify parent when recording state changes
  useEffect(() => {
    onRecordingChange?.(isRecording);
  }, [isRecording, onRecordingChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t + " ";
        } else {
          interimTranscript += t;
        }
      }

      if (finalTranscript || interimTranscript) {
        const text = accumulatedTranscriptRef.current + finalTranscript + interimTranscript;
        onTranscriptRef.current(text);
        if (finalTranscript) {
          accumulatedTranscriptRef.current += finalTranscript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
        shouldRestartRef.current = false;
      } else if (event.error === "network") {
        setIsRecording(false);
      } else if (event.error === "no-speech") {
        // Silence detected - auto-restart if still recording
      } else if (event.error === "aborted") {
        // Intentional stop
      } else {
        toast.error(`Microphone error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // Auto-restart if user hasn't explicitly stopped
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
          shouldRestartRef.current = false;
        }
      } else {
        setIsRecording(false);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not available in this browser.");
      return;
    }

    if (isRecording) {
      shouldRestartRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setIsRecording(false);
    } else {
      accumulatedTranscriptRef.current = "";
      onTranscriptRef.current("");
      shouldRestartRef.current = true;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Recording started. Speak clearly.");
      } catch (e) {
        console.error("Failed to start", e);
        setIsRecording(false);
        shouldRestartRef.current = false;
        toast.error("Failed to start recording. Please try again.");
      }
    }
  }, [isRecording]);

  if (!isSupported) {
    return (
      <div className="text-xs text-red-400/70 px-4 py-3 rounded-xl border border-red-500/10 bg-red-500/5 text-center">
        Web Speech API not supported. Please use Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all min-h-[48px] ${isRecording
        ? "bg-red-500/12 text-red-300 border border-red-500/20 glow-red"
        : "bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-300 border border-blue-500/15 hover:from-blue-500/25 hover:to-cyan-500/25 glow-blue"
        }`}
    >
      {isRecording ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
          </span>
          <Square className="w-3.5 h-3.5" fill="currentColor" />
          Stop Recording
          {/* Live waveform */}
          <div className="flex items-end gap-[2px] h-4 ml-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[2px] bg-red-400/60 rounded-full waveform-bar"
                style={{ animationDelay: `${i * 0.1}s`, height: "30%" }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          Start Recording
        </>
      )}
    </button>
  );
}
