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

    // Keep callback ref updated
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
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
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
                if (event.error === 'not-allowed') {
                    toast.error("Microphone access denied.");
                } else if (event.error !== 'no-speech') {
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
            accumulatedTranscriptRef.current = ""; // Reset on new recording
            onTranscriptRef.current(""); // Clear parent as well
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Failed to start", e);
                setIsRecording(false);
                toast.error("Failed to start recording. Please try again.");
            }
        }
    };

    if (!isSupported) {
        return <div className="text-sm text-red-500 p-2 border border-red-200 rounded">Web Speech API not supported in this browser.</div>;
    }

    return (
        <button
            type="button"
            onClick={toggleRecording}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${isRecording
                ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
        >
            {isRecording ? (
                <>
                    <span className="relative flex h-3 w-3 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <Square className="w-4 h-4" fill="currentColor" /> Stop Recording
                </>
            ) : (
                <>
                    <Mic className="w-5 h-5" /> Start Recording
                </>
            )}
        </button>
    );
}
