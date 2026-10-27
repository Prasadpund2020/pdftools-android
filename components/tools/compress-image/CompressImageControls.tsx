"use client";

import React, { useRef } from "react";
import { CompressionProfile, OutputFormat, CompressedResult } from "./types";

interface CompressImageControlsProps {
  currentProfile: CompressionProfile;
  onSelectProfile: (profile: CompressionProfile, quality: number) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  outputFormat: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  compressedResult: CompressedResult | null;
  onDownload: () => void;
  onUploadNewImage: (file: File) => void;
  isDownloading?: boolean;
}

export default function CompressImageControls({
  currentProfile,
  onSelectProfile,
  quality,
  onQualityChange,
  outputFormat,
  onFormatChange,
  compressedResult,
  onDownload,
  onUploadNewImage,
  isDownloading = false,
}: CompressImageControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadNewImage(file);
      e.target.value = "";
    }
  };

  const formattedTargetSize = compressedResult?.sizeFormatted || "1.1 MB";
  const processingTime = compressedResult?.processingTimeMs || 28;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_12px_32px_-8px_rgba(41,37,36,0.06)] border border-stone-200/90 flex flex-col gap-6">
      {/* 1. Mode Selector Pill Cards */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Compression Profile
          </span>
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Select Intensity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Lossless Profile */}
          <button
            type="button"
            onClick={() => onSelectProfile("lossless", 95)}
            className={`text-left p-4 rounded-2xl transition-all flex flex-col justify-between gap-3 relative cursor-pointer border ${
              currentProfile === "lossless"
                ? "bg-blue-50 text-blue-950 border-blue-400 shadow-[0_8px_20px_rgba(14,165,233,0.2)]"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/70"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentProfile === "lossless"
                    ? "bg-blue-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-800 font-extrabold">
                -35%
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Lossless</h3>
              <p className="text-xs text-stone-500">Photographic master archival</p>
            </div>
          </button>

          {/* Balanced Profile */}
          <button
            type="button"
            onClick={() => onSelectProfile("balanced", 82)}
            className={`text-left p-4 rounded-2xl transition-all flex flex-col justify-between gap-3 relative cursor-pointer border ${
              currentProfile === "balanced"
                ? "bg-blue-600 text-white border-blue-700 shadow-[0_10px_24px_rgba(14,165,233,0.32)]"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/70"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentProfile === "balanced"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                  currentProfile === "balanced"
                    ? "bg-white/20 text-white"
                    : "bg-stone-200/80 text-stone-800"
                }`}
              >
                -84%
              </span>
            </div>
            <div>
              <h3
                className={`text-base font-bold ${
                  currentProfile === "balanced" ? "text-white" : "text-stone-900"
                }`}
              >
                Balanced
              </h3>
              <p
                className={`text-xs ${
                  currentProfile === "balanced" ? "text-blue-100" : "text-stone-500"
                }`}
              >
                Zero visible visual degradation
              </p>
            </div>
          </button>

          {/* Ultra Profile */}
          <button
            type="button"
            onClick={() => onSelectProfile("ultra", 62)}
            className={`text-left p-4 rounded-2xl transition-all flex flex-col justify-between gap-3 relative cursor-pointer border ${
              currentProfile === "ultra"
                ? "bg-blue-50 text-blue-950 border-blue-400 shadow-[0_8px_20px_rgba(14,165,233,0.2)]"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/70"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentProfile === "ultra"
                    ? "bg-blue-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-800 font-extrabold">
                -92%
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Ultra Web</h3>
              <p className="text-xs text-stone-500">Maximum CDN payload reduction</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Custom Fine-Tune Slider & Format Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center">
        {/* Quality Value Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="qualityRange" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Target Quality Threshold
            </label>
            <span className="text-sm font-black text-blue-700">{quality}%</span>
          </div>

          <div className="relative flex items-center w-full py-1">
            <input
              id="qualityRange"
              type="range"
              min={30}
              max={100}
              value={quality}
              onChange={(e) => onQualityChange(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-between text-[11px] text-stone-400 font-semibold">
            <span>Smaller Size (30%)</span>
            <span>Original Master (100%)</span>
          </div>
        </div>

        {/* Modern Format Converter Radios */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Modern Format Transcode
            </span>
            <span className="text-[11px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
              +30% extra space
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => onFormatChange("original")}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                outputFormat === "original"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Keep PNG/JPG
            </button>

            <button
              type="button"
              onClick={() => onFormatChange("webp")}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                outputFormat === "webp"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              WebP
            </button>

            <button
              type="button"
              onClick={() => onFormatChange("avif")}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                outputFormat === "avif"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              AVIF NextGen
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Action Buttons: Tactile Clay Pill CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Processed locally in {processingTime}ms via SIMD WebAssembly</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none px-5 h-12 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm transition-all shadow-xs border border-stone-200/60 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Batch More</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.heic"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Main Tactile Clay CTA */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="flex-1 sm:flex-none px-7 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_24px_-4px_rgba(14,165,233,0.4),inset_0_2px_3px_rgba(255,255,255,0.5),inset_0_-3px_4px_rgba(0,30,47,0.45)] disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Packing Image...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Image ({formattedTargetSize})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
