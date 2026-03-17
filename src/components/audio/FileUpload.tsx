"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

let pipelinePromise: any = null;
const getPipeline = async () => {
  if (!pipelinePromise) {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowLocalModels = false;
    pipelinePromise = pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en");
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
    if (!file.type.includes("audio")) {
      toast.error("Please upload an audio file (.mp3, .wav)");
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);

    try {
      const transcriber = await getPipeline();
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

      setProgress(50);
      const output = await transcriber(audioData);
      onTranscript(`[Transcribed from ${file.name}]\n\n` + output.text);
      toast.success("Audio transcribed successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to transcribe audio file.");
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
      className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center ${
        isDragging
          ? "border-blue-400/40 bg-blue-500/5"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="audio/*"
        onChange={handleChange}
      />

      {isProcessing ? (
        <div className="flex flex-col items-center py-1">
          <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mb-2" />
          <p className="text-[10px] font-medium text-blue-300">
            {progress > 0 && progress < 50 ? "Decoding..." : "Transcribing..."}
          </p>
        </div>
      ) : fileName ? (
        <div className="flex flex-col items-center py-1 text-emerald-400">
          <CheckCircle2 className="w-5 h-5 mb-1" />
          <p className="text-[10px] font-medium truncate max-w-full">{fileName}</p>
          <p className="text-[9px] text-slate-500 mt-0.5">Click to upload another</p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-1">
          <UploadCloud className="w-5 h-5 text-slate-500 mb-1.5" />
          <p className="text-[10px] font-medium text-slate-300">Upload Audio</p>
          <p className="text-[9px] text-slate-600">.mp3 or .wav</p>
        </div>
      )}
    </div>
  );
}
