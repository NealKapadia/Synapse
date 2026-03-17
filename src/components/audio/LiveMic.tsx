"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square } from "lucide-react";
import toast from "react-hot-toast";

interface LiveMicProps {
  onTranscript: (text: string) => void;
}

export function LiveMic({ onTranscript }: LiveMicProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
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
          toast.error("Microphone access denied.");
        } else if (event.error !== "no-speech") {
          toast.error(`Microphone error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setIsRecording(false);
    } else {
      accumulatedTranscriptRef.current = "";
      onTranscriptRef.current("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start", e);
        setIsRecording(false);
        toast.error("Failed to start recording.");
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-[10px] text-red-400/70 px-3 py-2 rounded-lg border border-red-500/10 bg-red-500/5">
        Web Speech API not supported in this browser.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
        isRecording
          ? "bg-red-500/15 text-red-300 border border-red-500/20 glow-red"
          : "bg-blue-500/15 text-blue-300 border border-blue-500/20 hover:bg-blue-500/25 glow-blue"
      }`}
    >
      {isRecording ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
          </span>
          <Square className="w-3 h-3" fill="currentColor" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5" />
          Start Recording
        </>
      )}
    </button>
  );
}
