"use client";

import { useState, useRef, useEffect } from "react";
import { AnalysisResult } from "@/lib/types";
import { Stethoscope, Activity, Pill, AlertCircle, HeartPulse, UserCircle, Volume2, VolumeX, Smartphone, Check, Bot } from "lucide-react";
import toast from "react-hot-toast";

interface StructuredDataProps {
    result: AnalysisResult | null;
    onLanguageChange?: (language: string) => void;
    isAnalyzing?: boolean;
}

export function StructuredData({ result, onLanguageChange, isAnalyzing }: StructuredDataProps) {
    const [isSmsSending, setIsSmsSending] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Pre-load voices for some browsers
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const playAudio = () => {
        if (!window.speechSynthesis) {
            toast.error("Text-to-speech is not supported in this browser.");
            return;
        }

        // Toggle playback: if currently playing, cancel it
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        if (!result?.patientSummary) return;

        // Ensure clean state
        window.speechSynthesis.cancel();

        const voiceMap: Record<string, string> = {
            "English": "en-US",
            "Spanish": "es-ES",
            "Mandarin": "zh-CN",
            "Vietnamese": "vi-VN"
        };

        const targetLang = voiceMap[selectedLanguage] || "en-US";
        const utterance = new SpeechSynthesisUtterance(result.patientSummary);
        utterance.lang = targetLang;

        // Attempt to find a specific voice to improve reliability
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(targetLang) || v.lang.startsWith(targetLang.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (e: any) => {
            if (e?.error !== "interrupted" && e?.error !== "canceled") {
                console.error("TTS Error:", e);
                toast.error("Audio playback failed.");
            }
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/\D/g, '').substring(0, 10);
        let formatted = cleaned;
        if (cleaned.length > 6) {
            formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        } else if (cleaned.length > 3) {
            formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}`;
        } else if (cleaned.length > 0) {
            formatted = `(${cleaned}`;
        }
        setPhoneNumber(formatted);
    };

    const handleSms = async () => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        if (cleanedNumber.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        setIsSmsSending(true);
        try {
            const response = await fetch("/api/sms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber: `+1${cleanedNumber}`,
                    messageBody: result?.patientSummary
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send SMS");
            }

            toast.success("Recovery plan successfully sent to patient's mobile device.");
            setPhoneNumber(""); // clear input after success
        } catch (error: any) {
            console.error("SMS Error:", error);
            toast.error(error.message || "Failed to send SMS.");
        } finally {
            setIsSmsSending(false);
        }
    };

    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 min-h-0">
                <Activity className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Awaiting transcript analysis...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 pr-2 space-y-6">

            {/* Vitals & Symptoms Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Vitals */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400 font-semibold">
                        <HeartPulse className="w-4 h-4" /> Vitals
                    </div>
                    <div className="space-y-2 text-sm">
                        {Object.keys(result.vitals || {}).length > 0 ? (
                            Object.entries(result.vitals || {}).map(([k, v]) => {
                                const isAbnormal = v.is_abnormal;
                                return (
                                    <div key={k} className="flex flex-col items-center justify-center border-b border-blue-200/50 dark:border-blue-800/30 pb-2 pt-1 px-1 w-full overflow-hidden text-center">
                                        <span className="text-neutral-500 dark:text-neutral-400 capitalize text-xs mb-0.5 break-words max-w-full">
                                            {k.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className={`font-semibold flex items-center justify-center gap-1 text-sm break-words max-w-full ${isAbnormal ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-200'}`}>
                                            {isAbnormal && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                            {v.measurement}
                                        </span>
                                    </div>
                                );
                            })
                        ) : <span className="text-neutral-500 italic">None mentioned</span>}
                    </div>
                </div>

                {/* Symptoms */}
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-2 mb-3 text-orange-700 dark:text-orange-400 font-semibold">
                        <AlertCircle className="w-4 h-4" /> Symptoms
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-neutral-800 dark:text-neutral-200">
                        {(result.symptoms || []).length > 0 ? (
                            (result.symptoms || []).map((s, i) => <li key={i}>{s}</li>)
                        ) : <span className="text-neutral-500 italic">None listed</span>}
                    </ul>
                </div>
            </div>

            {/* Diagnoses with ICD-10 */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-neutral-800 dark:text-neutral-200 font-semibold">
                    <Stethoscope className="w-5 h-5 text-indigo-500" /> Diagnoses & ICD-10
                </div>
                <div className="space-y-4">
                    {(result.diagnoses || []).map((d, i) => (
                        <div key={i} className="flex flex-col bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="font-semibold text-base block">{d.condition_name}</span>
                                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2.5 py-0.5 rounded-md font-mono border border-indigo-200 dark:border-indigo-800 inline-block mt-1">
                                        {d.icd_10_code}
                                    </span>
                                </div>
                                {d.confidence_score !== undefined && (
                                    <div className="flex flex-col items-end">
                                        <div className="text-xs font-medium text-neutral-500 mb-1">Confidence</div>
                                        <div className="w-24 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${d.confidence_score > 85 ? 'bg-green-500' : d.confidence_score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${d.confidence_score}%` }}
                                            />
                                        </div>
                                        <div className="text-xs font-bold mt-1 text-neutral-700 dark:text-neutral-300">{d.confidence_score}%</div>
                                    </div>
                                )}
                            </div>
                            {d.differential_diagnoses && d.differential_diagnoses.length > 0 && (
                                <div className="mt-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Differentials Considered</span>
                                    <div className="flex flex-wrap gap-2">
                                        {d.differential_diagnoses.map((diff, idx) => (
                                            <span key={idx} className="text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                                                {diff}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {(result.diagnoses || []).length === 0 && <p className="text-sm text-neutral-500 italic">No specific diagnoses identified.</p>}
                </div>
            </div>

            {/* Treatments */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-neutral-800 dark:text-neutral-200 font-semibold">
                    <Pill className="w-5 h-5 text-emerald-500" /> Recommended Treatments
                </div>
                <div className="flex flex-wrap gap-2">
                    {(result.treatments || []).map((t, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm px-3 py-1.5 rounded-full">
                            {t}
                        </span>
                    ))}
                    {(result.treatments || []).length === 0 && <p className="text-sm text-neutral-500 italic">No treatments mentioned.</p>}
                </div>
            </div>

            {/* Agentic Insights */}
            {result.agentic_follow_ups && result.agentic_follow_ups.length > 0 && (
                <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-xl p-5 border border-fuchsia-200 dark:border-fuchsia-800 shadow-sm relative overflow-hidden mt-4">
                    <div className="flex items-center gap-2 mb-3 text-fuchsia-800 dark:text-fuchsia-300 font-semibold text-lg border-b border-fuchsia-200/50 dark:border-fuchsia-800/30 pb-3">
                        <Bot className="w-6 h-6" /> Agentic Insights: Recommended Follow-ups
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-fuchsia-900 dark:text-fuchsia-100/90 leading-relaxed">
                        {result.agentic_follow_ups.map((q, idx) => (
                            <li key={idx} className="font-medium">{q}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 rounded-xl p-5 mt-4 relative">
                {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10 transition-all">
                        <Activity className="w-6 h-6 text-violet-600 animate-spin" />
                    </div>
                )}
                <div className="flex items-center justify-between mb-3 border-b border-violet-200/50 dark:border-violet-800/30 pb-3">
                    <div className="flex items-center gap-2 text-violet-800 dark:text-violet-300 font-semibold text-lg">
                        <UserCircle className="w-6 h-6" /> Patient-Friendly Recovery Plan
                    </div>
                    <div className="flex items-center gap-2">
                        {onLanguageChange && (
                            <select
                                value={selectedLanguage}
                                className="bg-white dark:bg-neutral-800 border border-violet-200 dark:border-violet-800 rounded-md text-sm px-2 py-1 text-neutral-800 dark:text-neutral-200 disabled:opacity-50 cursor-pointer shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
                                onChange={(e) => {
                                    setSelectedLanguage(e.target.value);
                                    onLanguageChange(e.target.value);
                                }}
                                disabled={isAnalyzing}
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Mandarin">Mandarin</option>
                                <option value="Vietnamese">Vietnamese</option>
                            </select>
                        )}
                        <button
                            onClick={playAudio}
                            disabled={isAnalyzing}
                            className="p-1.5 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-md hover:bg-violet-200 dark:hover:bg-violet-800/80 transition-colors disabled:opacity-50"
                            title={isPlaying ? "Stop audio" : "Play read aloud"}
                        >
                            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm whitespace-pre-wrap mb-4">
                    {result.patientSummary}
                </p>
                <div className="flex flex-col items-end gap-2 border-t border-violet-200/50 dark:border-violet-800/30 pt-3">
                    <button
                        onClick={handleSms}
                        disabled={isSmsSending || isAnalyzing || !phoneNumber.trim()}
                        className="text-xs bg-violet-600 hover:bg-violet-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-medium px-4 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-sm w-40"
                    >
                        {isSmsSending ? (
                            <Activity className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Smartphone className="w-3.5 h-3.5" />
                        )}
                        {isSmsSending ? "Sending..." : "SMS Plan"}
                    </button>
                    <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        disabled={isAnalyzing || isSmsSending}
                        className="bg-white dark:bg-neutral-800 border border-violet-200 dark:border-violet-800 rounded-md text-xs px-2 py-1.5 text-neutral-800 dark:text-neutral-200 disabled:opacity-50 outline-none focus:ring-2 focus:ring-violet-500 w-40 shadow-sm text-center placeholder:text-neutral-400"
                    />
                </div>
            </div>

        </div>
    );
}
