"use client";

import React, { useState } from "react";
import { ResizeMode, OutputFormat, ResizeOptions, ImageSourceMeta, ResizedResult } from "./types";
import { SOCIAL_PRESETS } from "./resizeImageEngine";

interface ResizeImageControlsProps {
  meta: ImageSourceMeta;
  options: ResizeOptions;
  result: ResizedResult | null;
  onOptionsChange: (newOptions: ResizeOptions) => void;
  onDownload: () => void;
  isProcessing: boolean;
}

export default function ResizeImageControls({
  meta,
  options,
  result,
  onOptionsChange,
  onDownload,
  isProcessing,
}: ResizeImageControlsProps) {
  const [activeMode, setActiveMode] = useState<ResizeMode>("dimensions");
  const [percentage, setPercentage] = useState<number>(100);

  const handleWidthChange = (val: number) => {
    const w = Math.max(1, Math.round(val));
    if (options.maintainAspectRatio && meta.aspectRatio > 0) {
      const h = Math.max(1, Math.round(w / meta.aspectRatio));
      onOptionsChange({ ...options, width: w, height: h });
    } else {
      onOptionsChange({ ...options, width: w });
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(1, Math.round(val));
    if (options.maintainAspectRatio && meta.aspectRatio > 0) {
      const w = Math.max(1, Math.round(h * meta.aspectRatio));
      onOptionsChange({ ...options, width: w, height: h });
    } else {
      onOptionsChange({ ...options, height: h });
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    const scale = pct / 100;
    const w = Math.max(1, Math.round(meta.originalWidth * scale));
    const h = Math.max(1, Math.round(meta.originalHeight * scale));
    onOptionsChange({ ...options, width: w, height: h });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex flex-col gap-6">
      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-stone-100 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveMode("dimensions")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeMode === "dimensions"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          By Dimensions (px)
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("percentage")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeMode === "percentage"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          By Percentage (%)
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("preset")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeMode === "preset"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Social Presets
        </button>
      </div>

      {/* Mode 1: Exact Pixels */}
      {activeMode === "dimensions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Width (pixels)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={12000}
                  value={options.width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">px</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Height (pixels)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={12000}
                  value={options.height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">px</span>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Lock Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${options.maintainAspectRatio ? "text-sky-600" : "text-stone-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={options.maintainAspectRatio ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" : "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"} />
              </svg>
              <span className="text-xs font-bold text-stone-700">Lock Aspect Ratio</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.maintainAspectRatio}
                onChange={(e) => onOptionsChange({ ...options, maintainAspectRatio: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600" />
            </label>
          </div>
        </div>
      )}

      {/* Mode 2: Percentage Scaling */}
      {activeMode === "percentage" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700">Scale Scale Percentage</label>
            <span className="text-sm font-black text-sky-600 px-2 py-0.5 rounded-lg bg-sky-50">
              {percentage}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={300}
            step={5}
            value={percentage}
            onChange={(e) => handlePercentageChange(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[25, 50, 75, 150, 200].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageChange(pct)}
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  percentage === pct
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Social & Display Presets */}
      {activeMode === "preset" && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {SOCIAL_PRESETS.map((preset) => {
            const isSelected =
              options.width === preset.width && options.height === preset.height;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onOptionsChange({
                    ...options,
                    width: preset.width,
                    height: preset.height,
                    maintainAspectRatio: false,
                    fitMode: "cover",
                  });
                }}
                className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-sky-500 bg-sky-50/80 shadow-xs"
                    : "border-stone-200 bg-stone-50/60 hover:bg-stone-100/80"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">{preset.name}</div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    {preset.category} • {preset.width} × {preset.height} px
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">
                  {preset.aspectRatio}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Export Format & Compression Quality */}
      <div className="pt-4 border-t border-stone-100 space-y-4">
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            Target Output Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["webp", "jpeg", "png", "original"] as OutputFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => onOptionsChange({ ...options, outputFormat: fmt })}
                className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all ${
                  options.outputFormat === fmt
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {options.outputFormat !== "png" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">Encoding Quality</label>
              <span className="text-xs font-bold text-sky-600">{options.quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={options.quality}
              onChange={(e) => onOptionsChange({ ...options, quality: Number(e.target.value) })}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* File Size Telemetry Summary */}
      {result && (
        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
              Output Resolution &amp; Weight
            </div>
            <div className="text-xs font-black text-stone-900 mt-0.5">
              {result.width} × {result.height} px • {formatFileSize(result.sizeBytes)}
            </div>
          </div>

          {result.reductionPercentage !== 0 && (
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                result.reductionPercentage > 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {result.reductionPercentage > 0 ? `-${result.reductionPercentage}%` : `+${Math.abs(result.reductionPercentage)}%`}
            </span>
          )}
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={onDownload}
        className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Scaling Pixels…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Resized Image
          </>
        )}
      </button>
    </div>
  );
}
