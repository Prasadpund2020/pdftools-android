"use client";

import React from "react";
import { ImageFormat, DpiLevel, ColorMode } from "./types";
import { calculateEstimates } from "./pdfRasterizerEngine";

interface PdfToJpgExportDeckProps {
  format: ImageFormat;
  onFormatChange: (fmt: ImageFormat) => void;
  dpi: DpiLevel;
  onDpiChange: (dpi: DpiLevel) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  selectedCount: number;
  onDownloadZip: () => void;
  onDownloadSingle: () => void;
  isDownloadingZip?: boolean;
  statusMessage?: string;
}

export default function PdfToJpgExportDeck({
  format,
  onFormatChange,
  dpi,
  onDpiChange,
  colorMode,
  onColorModeChange,
  selectedCount,
  onDownloadZip,
  onDownloadSingle,
  isDownloadingZip = false,
  statusMessage,
}: PdfToJpgExportDeckProps) {
  const { estZipSize, pixelDimensions, progressPct } = calculateEstimates(
    selectedCount,
    dpi,
    format,
    colorMode
  );

  const formatUpper = format.toUpperCase();

  const dpiOptions: { dpi: DpiLevel; title: string; subtitle: string }[] = [
    { dpi: 72, title: "72 DPI", subtitle: "Web Screen (1x)" },
    { dpi: 150, title: "150 DPI", subtitle: "Standard View (2x)" },
    { dpi: 300, title: "300 DPI", subtitle: "High Print Studio" },
    { dpi: 600, title: "600 DPI", subtitle: "Ultra Archive Master" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Physical Desk Panel: Parameter Modules */}
      <div className="w-full bg-stone-100/90 p-5 sm:p-7 rounded-3xl shadow-[0_12px_32px_-8px_rgba(41,37,36,0.06)] border border-stone-200/90 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-stone-200/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-stone-900">Export Settings</h3>
          </div>
          <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
            Engine 3.4
          </span>
        </div>

        {/* Section 1: Target Image Format Selector Pills */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Target Output Format
          </span>

          <div className="grid grid-cols-3 gap-1.5 bg-stone-200/70 p-1 rounded-2xl shadow-inner">
            <button
              type="button"
              onClick={() => onFormatChange("jpg")}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center cursor-pointer ${
                format === "jpg"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span className="text-xs sm:text-sm font-extrabold">JPG</span>
              <span className="text-[10px] text-stone-400 font-normal">92% Quality</span>
            </button>

            <button
              type="button"
              onClick={() => onFormatChange("png")}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center cursor-pointer ${
                format === "png"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span className="text-xs sm:text-sm font-extrabold">PNG</span>
              <span className="text-[10px] text-stone-400 font-normal">Lossless</span>
            </button>

            <button
              type="button"
              onClick={() => onFormatChange("webp")}
              className={`py-2 px-1 rounded-xl font-bold transition-all flex flex-col items-center cursor-pointer ${
                format === "webp"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span className="text-xs sm:text-sm font-extrabold">WebP</span>
              <span className="text-[10px] text-stone-400 font-normal">Ultra Compact</span>
            </button>
          </div>
        </div>

        {/* Section 2: Resolution (DPI) Toggles */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Raster Density (DPI)
            </span>
            <span className="text-xs text-blue-700 font-bold">
              {dpi} DPI • {dpi > 150 ? "Print Ready" : "Screen Fast"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {dpiOptions.map((opt) => (
              <button
                key={opt.dpi}
                type="button"
                onClick={() => onDpiChange(opt.dpi)}
                className={`p-3 rounded-2xl text-left flex flex-col gap-0.5 transition-all cursor-pointer border ${
                  dpi === opt.dpi
                    ? "bg-blue-600 text-white shadow-md border-blue-700 font-semibold"
                    : "bg-white hover:bg-stone-50 text-stone-800 border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold">{opt.title}</span>
                  {dpi === opt.dpi && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[11px] ${
                    dpi === opt.dpi ? "text-blue-100" : "text-stone-400"
                  }`}
                >
                  {opt.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Color Profile Switcher */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Color Space
          </span>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-stone-900">
                  {colorMode === "srgb" ? "sRGB Full Color" : "Grayscale Neutral"}
                </span>
                <span className="text-[11px] text-stone-400">
                  {colorMode === "srgb" ? "Standard digital gamuts" : "1-channel document mode"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onColorModeChange(colorMode === "srgb" ? "grayscale" : "srgb")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                colorMode === "srgb" ? "bg-blue-600" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                  colorMode === "srgb" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 4: Live Output Summary Deck */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Conversion Package</span>
            <span className="inline-flex items-center gap-1.5 text-blue-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Calculated
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-base sm:text-lg font-black text-stone-900">
              {selectedCount} {selectedCount === 1 ? "Image" : "Images"} Ready
            </span>
            <span className="text-sm font-extrabold text-orange-600">{estZipSize}</span>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-1.5 mt-0.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5 font-medium">
            <span>{formatUpper} Format • {dpi} DPI</span>
            <span>{pixelDimensions}</span>
          </div>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex flex-col gap-2.5 pt-1">
          {statusMessage && (
            <div className="text-xs text-center text-blue-700 font-bold py-1">
              {statusMessage}
            </div>
          )}

          {/* Clay Download ZIP Button */}
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={isDownloadingZip || selectedCount === 0}
            className="group relative w-full h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-[0_10px_24px_-4px_rgba(253,118,26,0.4)] active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 overflow-hidden cursor-pointer disabled:opacity-50"
          >
            {isDownloadingZip ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Packing {selectedCount} Pages as ZIP...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span>Download All as ZIP ({selectedCount})</span>
              </>
            )}
            {/* Subtle inner clay shine */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/40" />
          </button>

          {/* Secondary Action: Download Selected Page Only */}
          <button
            type="button"
            onClick={onDownloadSingle}
            disabled={selectedCount === 0}
            className="w-full h-11 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm transition-all shadow-xs border border-stone-200/80 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download First Selected Page Only</span>
          </button>
        </div>
      </div>

      {/* Security Desk Footnote Chip */}
      <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200/80 flex items-center gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-stone-900">
            Client-Side Memory Sandbox
          </span>
          <span className="text-[11px] text-stone-500">
            Pixels decoded entirely locally in browser canvas memory.
          </span>
        </div>
      </div>
    </div>
  );
}
