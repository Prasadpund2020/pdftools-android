"use client";

import React, { useRef, useState } from "react";
import { CutoutSample } from "./types";
import { SAMPLE_CUTOUTS } from "./sampleImages";

interface RemoveBackgroundDropzoneProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (sample: CutoutSample) => void;
  isProcessing: boolean;
}

export default function RemoveBackgroundDropzone({
  onFileSelect,
  onSelectSample,
  isProcessing,
}: RemoveBackgroundDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8">
      {/* Interactive Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 bg-[#fff8f6] shadow-sm ${
          isDragOver
            ? "border-[#006591] bg-sky-50 scale-[1.01]"
            : "border-stone-300 hover:border-[#006591] hover:bg-stone-50/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Big tactile icon badge */}
        <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#006591] mb-5 border border-stone-200/60 group-hover:scale-105 transition-transform">
          <svg
            className="w-10 h-10 text-[#006591]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#1e1b1a] mb-2 tracking-tight">
          Drop your photo here, or{" "}
          <span className="text-[#006591] underline decoration-[#006591]/40 underline-offset-4">
            browse files
          </span>
        </h3>
        <p className="text-sm text-[#3e4850] max-w-md leading-relaxed mb-6">
          Client-side AI removes background automatically with hair-strand precision. Zero server uploads.
        </p>

        {/* Accepted Formats */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {["PNG", "JPG", "JPEG", "WEBP"].map((fmt) => (
            <span
              key={fmt}
              className="px-2.5 py-1 rounded-lg bg-[#e9e1df] text-[#3e4850] text-[11px] font-bold font-mono tracking-wide"
            >
              .{fmt.toLowerCase()}
            </span>
          ))}
          <span className="text-xs text-stone-400 ml-1">Up to 50MB</span>
        </div>
      </div>

      {/* Preset Samples Strip */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1e1b1a] uppercase tracking-wider">
            Or try with sample studio photos:
          </span>
          <span className="text-[11px] text-stone-500">1-click instant test</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_CUTOUTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              disabled={isProcessing}
              className="group p-2.5 rounded-2xl bg-white border border-stone-200 hover:border-[#006591] hover:shadow-md transition-all text-left flex flex-col gap-2"
            >
              <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.cutoutUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                  {sample.category}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-stone-800 truncate group-hover:text-[#006591]">
                  {sample.title}
                </span>
                <span className="text-[11px] text-stone-500">
                  {sample.width}×{sample.height}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
