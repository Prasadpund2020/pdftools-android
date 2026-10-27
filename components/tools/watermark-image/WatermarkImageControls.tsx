"use client";

import React, { useRef } from "react";
import { WatermarkOptions, WatermarkPosition, OutputFormat, WatermarkResult } from "./types";

interface WatermarkImageControlsProps {
  options: WatermarkOptions;
  result: WatermarkResult | null;
  isProcessing: boolean;
  onOptionsChange: (newOptions: WatermarkOptions) => void;
  onDownload: () => void;
}

export default function WatermarkImageControls({
  options,
  result,
  isProcessing,
  onOptionsChange,
  onDownload,
}: WatermarkImageControlsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const POSITIONS: { id: WatermarkPosition; label: string }[] = [
    { id: "top-left", label: "TL" },
    { id: "top-center", label: "TC" },
    { id: "top-right", label: "TR" },
    { id: "center-left", label: "CL" },
    { id: "center", label: "C" },
    { id: "center-right", label: "CR" },
    { id: "bottom-left", label: "BL" },
    { id: "bottom-center", label: "BC" },
    { id: "bottom-right", label: "BR" },
  ];

  const COLOR_PALETTE = ["#ffffff", "#000000", "#fde047", "#f43f5e", "#0284c7", "#10b981"];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex flex-col gap-6">
      {/* Type Switcher */}
      <div className="flex p-1 bg-stone-100 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => onOptionsChange({ ...options, type: "text" })}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            options.type === "text"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Text Watermark
        </button>
        <button
          type="button"
          onClick={() => onOptionsChange({ ...options, type: "logo" })}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            options.type === "logo"
              ? "bg-white text-stone-900 shadow-xs"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Logo Stamp
        </button>
      </div>

      {/* Mode A: Text Options */}
      {options.type === "text" ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Watermark Text
            </label>
            <input
              type="text"
              value={options.text}
              onChange={(e) => onOptionsChange({ ...options, text: e.target.value })}
              placeholder="e.g. © 2026 Studio Brand"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Font Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onOptionsChange({ ...options, color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-xl border-2 transition-all cursor-pointer shadow-xs ${
                    options.color.toLowerCase() === c.toLowerCase()
                      ? "border-orange-500 scale-110"
                      : "border-stone-300 hover:scale-105"
                  }`}
                />
              ))}
              <input
                type="color"
                value={options.color}
                onChange={(e) => onOptionsChange({ ...options, color: e.target.value })}
                className="w-7 h-7 rounded-xl border border-stone-300 p-0 cursor-pointer overflow-hidden"
                title="Custom color"
              />
            </div>
          </div>

          {/* Font Size Relative Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">Text Size</label>
              <span className="text-xs font-bold text-orange-600">
                {Math.round(options.fontSizeRatio * 100)}% of height
              </span>
            </div>
            <input
              type="range"
              min={0.02}
              max={0.15}
              step={0.01}
              value={options.fontSizeRatio}
              onChange={(e) =>
                onOptionsChange({ ...options, fontSizeRatio: Number(e.target.value) })
              }
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        /* Mode B: Logo Stamp */
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Logo Graphic (.PNG or .SVG recommended)
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/svg+xml,image/webp,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = (ev) => {
                  onOptionsChange({
                    ...options,
                    logoDataUrl: ev.target?.result as string,
                  });
                };
                r.readAsDataURL(f);
              }}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {options.logoDataUrl ? "Change Uploaded Logo" : "Upload Brand Logo Stamp"}
            </button>
          </div>

          {options.logoDataUrl && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">Logo Scale</label>
                <span className="text-xs font-bold text-orange-600">
                  {Math.round(options.logoScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.08}
                max={0.5}
                step={0.02}
                value={options.logoScale}
                onChange={(e) =>
                  onOptionsChange({ ...options, logoScale: Number(e.target.value) })
                }
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Positioning Grid */}
      <div className="pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-stone-700">Anchor Placement</label>
          <button
            type="button"
            onClick={() => onOptionsChange({ ...options, position: "tile" })}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              options.position === "tile"
                ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            Diagonal Tile (Full Cover)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 max-w-[180px]">
          {POSITIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOptionsChange({ ...options, position: p.id })}
              className={`py-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                options.position === p.id
                  ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity & Rotation Sliders */}
      <div className="space-y-4 pt-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-stone-700">Transparency</label>
            <span className="text-xs font-bold text-orange-600">
              {Math.round(options.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={options.opacity}
            onChange={(e) => onOptionsChange({ ...options, opacity: Number(e.target.value) })}
            className="w-full accent-orange-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-stone-700">Angle Rotation</label>
            <span className="text-xs font-bold text-orange-600">{options.rotation}°</span>
          </div>
          <input
            type="range"
            min={-90}
            max={90}
            step={5}
            value={options.rotation}
            onChange={(e) => onOptionsChange({ ...options, rotation: Number(e.target.value) })}
            className="w-full accent-orange-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Output Format */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <label className="text-xs font-bold text-stone-700 block">Export Format</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["webp", "jpeg", "png", "original"] as OutputFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onOptionsChange({ ...options, outputFormat: fmt })}
              className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                options.outputFormat === fmt
                  ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry Info */}
      {result && (
        <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-800">
              Watermarked Output
            </div>
            <div className="text-xs font-black text-stone-900 mt-0.5">
              {result.width} × {result.height} px • {formatFileSize(result.sizeBytes)}
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 uppercase">
            {options.outputFormat}
          </span>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={onDownload}
        className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Applying Stamp…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Watermarked Image
          </>
        )}
      </button>
    </div>
  );
}
