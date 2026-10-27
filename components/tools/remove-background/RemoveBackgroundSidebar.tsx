"use client";

import React, { useState, useRef } from "react";
import { BackdropConfig, ExportFormat, SensitivityMode } from "./types";
import { formatBytes } from "./backgroundRemovalEngine";

interface RemoveBackgroundSidebarProps {
  backdrop: BackdropConfig;
  feather: number;
  sensitivity: SensitivityMode;
  retainShadows: boolean;
  exportFormat: ExportFormat;
  originalFileSize: number;
  cutoutFileSize: number;
  isProcessing: boolean;
  onBackdropChange: (backdrop: BackdropConfig) => void;
  onFeatherChange: (val: number) => void;
  onSensitivityChange: (mode: SensitivityMode) => void;
  onRetainShadowsToggle: () => void;
  onExportFormatChange: (fmt: ExportFormat) => void;
  onDownload: () => void;
  onCopyToClipboard: () => Promise<boolean>;
}

const PRESET_SWATCHES = [
  { type: "transparent" as const, value: "transparent", label: "Alpha" },
  { type: "color" as const, value: "#ffffff", label: "#FFF", bgClass: "bg-white text-stone-500 border border-stone-200" },
  { type: "color" as const, value: "#f4ebe1", label: "Sand", bgClass: "bg-[#f4ebe1] text-stone-700" },
  { type: "color" as const, value: "#e5e7eb", label: "Gray", bgClass: "bg-[#e5e7eb] text-stone-700" },
  { type: "color" as const, value: "#1e293b", label: "Navy", bgClass: "bg-[#1e293b] text-stone-200" },
  { type: "color" as const, value: "#ffdbca", label: "Clay", bgClass: "bg-[#ffdbca] text-[#5c2400]" },
];

export default function RemoveBackgroundSidebar({
  backdrop,
  feather,
  sensitivity,
  retainShadows,
  exportFormat,
  originalFileSize,
  cutoutFileSize,
  isProcessing,
  onBackdropChange,
  onFeatherChange,
  onSensitivityChange,
  onRetainShadowsToggle,
  onExportFormatChange,
  onDownload,
  onCopyToClipboard,
}: RemoveBackgroundSidebarProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [customColor, setCustomColor] = useState("#006591");
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomColor(val);
    onBackdropChange({ type: "color", value: val });
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onBackdropChange({
            type: "image",
            value: evt.target.result as string,
            name: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyClick = async () => {
    const success = await onCopyToClipboard();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2200);
    }
  };

  const savingsPercent =
    originalFileSize > 0
      ? Math.max(
          0,
          Math.round(((originalFileSize - cutoutFileSize) / originalFileSize) * 100)
        )
      : 80;

  return (
    <section className="flex flex-col gap-6">
      {/* 1. Backdrop Palette Block */}
      <div className="bg-[#fbf2f0] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 border border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1e1b1a] font-bold text-sm sm:text-base">
            <svg
              className="w-5 h-5 text-[#fd761a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a4 4 0 01-4-4 4.5 4.5 0 014.5-4.5c.34 0 .67.04.99.11L18.66 2.44a2 2 0 112.83 2.83L11.32 15.44c.07.32.11.65.11.99a4.5 4.5 0 01-4.5 4.5z"
              />
            </svg>
            <span>Backdrop Canvas</span>
          </div>
          <span className="text-[11px] font-bold text-[#6e7881] uppercase tracking-wider">
            Preview &amp; Save
          </span>
        </div>

        {/* Swatch Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {PRESET_SWATCHES.map((swatch) => {
            const isActive =
              backdrop.type === swatch.type && backdrop.value === swatch.value;

            if (swatch.type === "transparent") {
              return (
                <button
                  key="transparent"
                  type="button"
                  onClick={() =>
                    onBackdropChange({ type: "transparent", value: "transparent" })
                  }
                  title="Transparent Alpha Grid"
                  className={`h-11 rounded-xl flex items-center justify-center transition-all relative border ${
                    isActive
                      ? "ring-2 ring-[#006591] ring-offset-1 border-transparent shadow-xs"
                      : "border-stone-200 hover:border-stone-300"
                  } bg-[#e9e1df]`}
                >
                  <svg
                    className="w-4 h-4 text-stone-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#006591] border-2 border-white" />
                  )}
                </button>
              );
            }

            return (
              <button
                key={swatch.value}
                type="button"
                onClick={() =>
                  onBackdropChange({ type: "color", value: swatch.value })
                }
                title={swatch.label}
                className={`h-11 rounded-xl flex items-center justify-center transition-all text-xs font-semibold relative ${
                  swatch.bgClass
                } ${
                  isActive
                    ? "ring-2 ring-[#006591] ring-offset-1 shadow-xs"
                    : "hover:opacity-90"
                }`}
              >
                <span>{swatch.label}</span>
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#006591] border-2 border-white" />
                )}
              </button>
            );
          })}

          {/* Color Wheel Custom */}
          <label
            title="Custom Hex Color"
            className="h-11 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-[#e9e1df] hover:bg-stone-200 shadow-2xs relative border border-stone-200"
          >
            <svg
              className="w-4 h-4 text-[#006591]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a4 4 0 01-4-4 4.5 4.5 0 014.5-4.5c.34 0 .67.04.99.11L18.66 2.44a2 2 0 112.83 2.83L11.32 15.44c.07.32.11.65.11.99a4.5 4.5 0 01-4.5 4.5z"
              />
            </svg>
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Custom Image Background */}
          <label
            title="Upload Custom Image Backdrop"
            className={`h-11 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-[#e9e1df] hover:bg-stone-200 shadow-2xs relative border ${
              backdrop.type === "image"
                ? "ring-2 ring-[#006591] ring-offset-1 border-transparent"
                : "border-stone-200"
            }`}
          >
            <svg
              className="w-4 h-4 text-[#fd761a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              ref={bgFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBgImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {backdrop.type === "image" && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#006591] border-2 border-white" />
            )}
          </label>
        </div>
      </div>

      {/* 2. Edge & Cutout Refinement Controls */}
      <div className="bg-[#fbf2f0] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 border border-stone-200/60">
        <div className="flex items-center gap-2 text-[#1e1b1a] font-bold text-sm sm:text-base">
          <svg
            className="w-5 h-5 text-[#006591]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span>Edge &amp; Hair Refinements</span>
        </div>

        {/* Feather Edge Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-[#1e1b1a]">Feather Edge Softness</span>
            <span className="text-[#006591] font-bold">{feather}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={feather}
            onChange={(e) => onFeatherChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-[#e9e1df] accent-[#006591] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#6e7881]">
            <span>Razor Crisp (0%)</span>
            <span>Ultra Soft (100%)</span>
          </div>
        </div>

        {/* Separation Line */}
        <div className="w-full h-px bg-stone-200" />

        {/* AI Detail Sensitivity */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#1e1b1a]">
              AI Detail Sensitivity
            </span>
            <span className="text-[11px] text-[#6e7881]">
              Isolate fine hair strands &amp; lace
            </span>
          </div>
          <div className="bg-[#e9e1df] p-1 rounded-full flex items-center">
            <button
              type="button"
              onClick={() => onSensitivityChange("auto")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                sensitivity === "auto"
                  ? "bg-[#006591] text-white shadow-2xs"
                  : "text-[#3e4850] hover:text-[#1e1b1a]"
              }`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => onSensitivityChange("high")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                sensitivity === "high"
                  ? "bg-[#006591] text-white shadow-2xs"
                  : "text-[#3e4850] hover:text-[#1e1b1a]"
              }`}
            >
              High
            </button>
          </div>
        </div>

        {/* Retain Soft Contact Shadows Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#1e1b1a]">
              Retain Contact Shadows
            </span>
            <span className="text-[11px] text-[#6e7881]">
              Preserves natural desk grounding
            </span>
          </div>
          <button
            type="button"
            onClick={onRetainShadowsToggle}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
              retainShadows ? "bg-[#006591]" : "bg-stone-300"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                retainShadows ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Export Configuration & CTAs */}
      <div className="bg-[#f5ecea] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 border border-stone-200/60">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-[#1e1b1a]">Export Format</span>
          <div className="flex items-center gap-1 bg-[#e9e1df] p-1 rounded-full">
            <button
              type="button"
              onClick={() => onExportFormatChange("png")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                exportFormat === "png"
                  ? "bg-white text-[#1e1b1a] shadow-xs"
                  : "text-[#3e4850] hover:text-[#1e1b1a]"
              }`}
            >
              PNG (Alpha)
            </button>
            <button
              type="button"
              onClick={() => onExportFormatChange("webp")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                exportFormat === "webp"
                  ? "bg-white text-[#1e1b1a] shadow-xs"
                  : "text-[#3e4850] hover:text-[#1e1b1a]"
              }`}
            >
              WebP
            </button>
          </div>
        </div>

        {/* Size Comparison Readout */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-inner border border-stone-100">
          <div className="flex items-center gap-2.5">
            <svg
              className="w-5 h-5 text-[#fd761a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1e1b1a]">
                {formatBytes(cutoutFileSize)} Output
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {savingsPercent}% size savings
              </span>
            </div>
          </div>
          <span className="text-xs text-[#6e7881] font-medium">
            Original: {formatBytes(originalFileSize)}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5 pt-1">
          {/* Primary Tactile Sky / Cyan Action Button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isProcessing}
            className="w-full h-12 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-[#003751] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_20px_-4px_rgba(14,165,233,0.35),0_4px_6px_-2px_rgba(14,165,233,0.2)] active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>
              Download Cutout ({exportFormat.toUpperCase()})
            </span>
          </button>

          {/* Secondary Clipboard Button */}
          <button
            type="button"
            onClick={handleCopyClick}
            disabled={isProcessing}
            className="w-full h-11 rounded-full bg-white text-[#1e1b1a] hover:bg-stone-50 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs border border-stone-200 transition-colors active:scale-98"
          >
            {copySuccess ? (
              <>
                <svg
                  className="w-4 h-4 text-[#006591]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-[#006591] font-bold">
                  Cutout Copied to Clipboard!
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-stone-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy Cutout to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
