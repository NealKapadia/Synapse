"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

// Lazy load the pipeline so it doesn't break SSR
let pipelinePromise: any = null;
const getPipeline = async () => {
    if (!pipelinePromise) {
        // Modern HF Transformers handles SSR undefined variables correctly 
        const { pipeline, env } = await import('@huggingface/transformers');
        // Disable local models to fetch from HF hub
        env.allowLocalModels = false;
        pipelinePromise = pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    }
    return pipelinePromise;
};

interface FileUploadProps {
    onTranscript: (text: string) => void;
}

export function FileUpload({ onTranscript }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFile = async (file: File) => {
        if (!file.type.includes('audio')) {
            toast.error("Please upload an audio file (.mp3, .wav)");
            return;
        }

        setFileName(file.name);
        setIsProcessing(true);
        setProgress(0);

        try {
            // Get the transcription model
            const transcriber = await getPipeline();

            // Decode audio file into Float32Array at 16kHz
            const arrayBuffer = await file.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            let audioData: Float32Array;
            if (audioBuffer.sampleRate !== 16000) {
                const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
                const source = offlineContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(offlineContext.destination);
                source.start();
                const resampled = await offlineContext.startRendering();
                audioData = resampled.getChannelData(0);
            } else {
                audioData = audioBuffer.getChannelData(0);
            }

            setProgress(50); // Audio decoded, now inference...
            const output = await transcriber(audioData);

            onTranscript(`[Transcribed from ${file.name}]\n\n` + output.text);
            toast.success("Audio transcribed successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to transcribe audio file. It might be too large or unsupported.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center
        ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
        >
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="audio/*"
                onChange={handleChange}
            />

            {isProcessing ? (
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3"></div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {progress > 0 && progress < 50 ? "Decoding audio..." : "Transcribing with AI..."}
                    </p>
                </div>
            ) : fileName ? (
                <div className="flex flex-col items-center text-green-600 dark:text-green-500">
                    <CheckCircle2 className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">Processed {fileName}</p>
                    <p className="text-xs text-neutral-500 mt-1">Click or drag to upload another</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Upload Audio File</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[200px]">
                        Drag & drop or click to select .mp3 or .wav
                    </p>
                </div>
            )}
        </div>
    );
}
