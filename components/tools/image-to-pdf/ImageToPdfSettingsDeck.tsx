"use client";

import React, { useMemo } from "react";
import { ImageToPdfSettings, PageOrientation, PageFormat, PageMargin } from "./types";

interface ImageToPdfSettingsDeckProps {
  settings: ImageToPdfSettings;
  onSettingsChange: (newSettings: ImageToPdfSettings) => void;
  stagedCount: number;
  totalSizeBytes: number;
  onConvert: () => void;
  isConverting?: boolean;
  statusMessage?: string;
}

export default function ImageToPdfSettingsDeck({
  settings,
  onSettingsChange,
  stagedCount,
  totalSizeBytes,
  onConvert,
  isConverting = false,
  statusMessage,
}: ImageToPdfSettingsDeckProps) {
  // Calculate quality descriptor
  const qualityDescriptor = useMemo(() => {
    const val = settings.quality;
    if (val < 60) return "Draft";
    if (val < 80) return "Standard";
    if (val > 90) return "Maximum";
    return "Crisp";
  }, [settings.quality]);

  // Calculate realistic output size estimate based on slider and source bytes
  const estimatedSizeMb = useMemo(() => {
    if (totalSizeBytes === 0) return "0.0 MB";
    // Base compression factor: at 85% quality, JPEG output is typically ~45% of uncompressed raw image size
    const factor = (settings.quality / 100) * 0.55;
    const estimatedBytes = totalSizeBytes * factor;
    const mb = estimatedBytes / (1024 * 1024);
    return `~ ${Math.max(0.1, mb).toFixed(1)} MB`;
  }, [settings.quality, totalSizeBytes]);

  const updateField = <K extends keyof ImageToPdfSettings>(
    field: K,
    value: ImageToPdfSettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-[0_14px_30px_-8px_rgba(41,37,36,0.06)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            PDF Layout &amp; Quality Deck
          </h2>
        </div>

        <div className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
          Engine Preset: Standard Print
        </div>
      </div>

      {/* 3-Column Layout Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Page Orientation */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Orientation
          </label>
          <div className="grid grid-cols-3 gap-1 bg-stone-200/70 p-1 rounded-xl mt-1">
            {(["auto", "portrait", "landscape"] as PageOrientation[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateField("orientation", mode)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  settings.orientation === mode
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {mode === "auto" ? "Auto" : mode === "portrait" ? "Portrait" : "Land."}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Page Format Selection */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Page Format
          </label>
          <div className="mt-1">
            <select
              value={settings.pageSize}
              onChange={(e) => updateField("pageSize", e.target.value as PageFormat)}
              className="w-full bg-white text-stone-800 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs cursor-pointer"
            >
              <option value="a4">A4 Standard (210 x 297mm)</option>
              <option value="letter">US Letter (8.5 x 11 in)</option>
              <option value="fit">Fit to Image Dimensions</option>
            </select>
          </div>
        </div>

        {/* 3. Margins */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Margins
          </label>
          <div className="grid grid-cols-3 gap-1 bg-stone-200/70 p-1 rounded-xl mt-1">
            {(["none", "small", "wide"] as PageMargin[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => updateField("margin", m)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  settings.margin === m
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider: Compression & DPI Balance */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Compression &amp; DPI Balance
            </span>
            <span className="text-xs font-bold text-orange-600">
              {settings.quality}% Quality ({qualityDescriptor})
            </span>
          </div>

          <input
            type="range"
            min={40}
            max={100}
            value={settings.quality}
            onChange={(e) => updateField("quality", parseInt(e.target.value, 10))}
            className="w-full accent-orange-600 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
          />
        </div>

        <div className="flex items-center gap-3 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-stone-200 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Output PDF
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900">
              {estimatedSizeMb}
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Convert CTA Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-stone-500 font-medium text-center sm:text-left">
          {statusMessage ? (
            <span className="text-orange-600 font-bold">{statusMessage}</span>
          ) : (
            "🔒 100% Client-side conversion. Files never touch any server."
          )}
        </div>

        <button
          type="button"
          onClick={onConvert}
          disabled={isConverting || stagedCount === 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-[0_12px_24px_-4px_rgba(253,118,26,0.38),inset_0_2px_2px_rgba(255,255,255,0.45),inset_0_-3px_5px_rgba(92,36,0,0.35)] hover:shadow-[0_16px_28px_-4px_rgba(253,118,26,0.48)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isConverting ? (
            <>
              <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Assembling Document...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>Merge into PDF ({stagedCount} {stagedCount === 1 ? "File" : "Files"})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
