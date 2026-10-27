"use client";

import React from "react";
import { CropAspectRatio, CropTransformOptions, OutputFormat, CroppedResult } from "./types";

interface CropImageControlsProps {
  currentRatio: CropAspectRatio;
  options: CropTransformOptions;
  result: CroppedResult | null;
  isProcessing: boolean;
  onRatioSelect: (ratio: CropAspectRatio) => void;
  onOptionsChange: (newOptions: CropTransformOptions) => void;
  onDownload: () => void;
}

export default function CropImageControls({
  currentRatio,
  options,
  result,
  isProcessing,
  onRatioSelect,
  onOptionsChange,
  onDownload,
}: CropImageControlsProps) {
  const RATIO_PRESETS: { id: CropAspectRatio; label: string; desc: string }[] = [
    { id: "free", label: "Freeform", desc: "Custom bounds" },
    { id: "1:1", label: "1:1 Square", desc: "Instagram & Avatar" },
    { id: "16:9", label: "16:9 Landscape", desc: "YouTube & Monitor" },
    { id: "9:16", label: "9:16 Story", desc: "Reels & TikTok" },
    { id: "4:5", label: "4:5 Portrait", desc: "Instagram Feed" },
    { id: "4:3", label: "4:3 Standard", desc: "Tablet & Classic" },
    { id: "3:2", label: "3:2 Classic", desc: "DSLR Print" },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex flex-col gap-6">
      {/* Aspect Ratio Preset Grid */}
      <div>
        <label className="text-xs font-bold text-stone-700 block mb-2.5">
          Aspect Ratio Framing
        </label>
        <div className="grid grid-cols-2 gap-2">
          {RATIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onRatioSelect(preset.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                currentRatio === preset.id
                  ? "border-pink-500 bg-pink-50/80 shadow-xs"
                  : "border-stone-200 bg-stone-50/70 hover:bg-stone-100"
              }`}
            >
              <div className="text-xs font-bold text-stone-900">{preset.label}</div>
              <div className="text-[10px] text-stone-500">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rotation & Orientation Tools */}
      <div className="pt-4 border-t border-stone-100">
        <label className="text-xs font-bold text-stone-700 block mb-2.5">
          Orientation &amp; Transformations
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onOptionsChange({
                ...options,
                rotation: (options.rotation + 90) % 360,
              })
            }
            className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rotate (+90°)
          </button>

          <button
            type="button"
            onClick={() =>
              onOptionsChange({
                ...options,
                flipHorizontal: !options.flipHorizontal,
              })
            }
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              options.flipHorizontal
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Flip H
          </button>
        </div>
      </div>

      {/* Export Format Selector */}
      <div className="pt-4 border-t border-stone-100 space-y-4">
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            Target File Format
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["webp", "jpeg", "png", "original"] as OutputFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => onOptionsChange({ ...options, outputFormat: fmt })}
                className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                  options.outputFormat === fmt
                    ? "bg-pink-600 text-white border-pink-600 shadow-xs"
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
              <label className="text-xs font-bold text-stone-700">Quality</label>
              <span className="text-xs font-bold text-pink-600">{options.quality}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={options.quality}
              onChange={(e) => onOptionsChange({ ...options, quality: Number(e.target.value) })}
              className="w-full accent-pink-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Crop Output Telemetry */}
      {result && (
        <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-pink-800">
              Crop Resolution &amp; Weight
            </div>
            <div className="text-xs font-black text-stone-900 mt-0.5">
              {result.width} × {result.height} px • {formatFileSize(result.sizeBytes)}
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-pink-100 text-pink-800">
            {options.outputFormat.toUpperCase()}
          </span>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={onDownload}
        className="w-full py-3.5 px-4 rounded-2xl bg-pink-600 hover:bg-pink-500 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-pink-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Extracting Frame…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Cropped Image
          </>
        )}
      </button>
    </div>
  );
}
