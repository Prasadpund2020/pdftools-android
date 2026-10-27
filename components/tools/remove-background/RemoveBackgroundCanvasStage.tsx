"use client";

import React, { useState, useRef } from "react";
import { BackdropConfig, BrushMode, ZoomLevel } from "./types";

interface RemoveBackgroundCanvasStageProps {
  originalUrl: string;
  cutoutUrl: string;
  backdrop: BackdropConfig;
  brushMode: BrushMode;
  brushSize: number;
  zoomLevel: ZoomLevel;
  retainShadows: boolean;
  subjectBoundsDesc: string;
  isProcessing: boolean;
  onBrushModeChange: (mode: BrushMode) => void;
  onBrushSizeChange: (size: number) => void;
  onZoomChange: (level: ZoomLevel) => void;
}

export default function RemoveBackgroundCanvasStage({
  originalUrl,
  cutoutUrl,
  backdrop,
  brushMode,
  brushSize,
  zoomLevel,
  retainShadows,
  subjectBoundsDesc,
  isProcessing,
  onBrushModeChange,
  onBrushSizeChange,
  onZoomChange,
}: RemoveBackgroundCanvasStageProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="flex flex-col gap-2.5">
      <div className="relative w-full rounded-3xl bg-[#f5ecea] p-3 shadow-md overflow-hidden select-none border border-stone-200/60">
        {/* Top Floating Micro-bar: Tool selector & Brush slider */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-stone-200/80">
          <button
            type="button"
            onClick={() => onBrushModeChange("erase")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              brushMode === "erase"
                ? "bg-[#0ea5e9] text-white shadow-xs"
                : "text-[#3e4850] hover:bg-stone-100"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Erase Brush</span>
          </button>

          <button
            type="button"
            onClick={() => onBrushModeChange("restore")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              brushMode === "restore"
                ? "bg-[#fd761a] text-white shadow-xs"
                : "text-[#3e4850] hover:bg-stone-100"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
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
            <span>Restore</span>
          </button>

          <div className="w-px h-4 bg-stone-300 mx-1" />

          {/* Brush Size Slider */}
          <div className="flex items-center gap-2 px-2 text-[#3e4850] text-xs">
            <svg
              className="w-3.5 h-3.5 text-[#006591]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
              <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="2 2" />
            </svg>
            <input
              type="range"
              min="4"
              max="80"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              className="w-16 sm:w-20 accent-[#006591] cursor-pointer h-1.5 rounded-lg bg-stone-200"
            />
            <span className="font-bold w-7 text-right text-stone-700">
              {brushSize}px
            </span>
          </div>
        </div>

        {/* Top-Right: Zoom Controls */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-lg text-xs font-semibold text-[#3e4850] border border-stone-200/80">
          <button
            type="button"
            onClick={() => onZoomChange(1)}
            className={`px-2.5 py-1 rounded-full transition-all ${
              zoomLevel === 1
                ? "bg-[#e9e1df] text-[#1e1b1a] font-bold shadow-2xs"
                : "hover:bg-stone-100"
            }`}
          >
            Fit
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1.25)}
            className={`px-2.5 py-1 rounded-full transition-all ${
              zoomLevel === 1.25
                ? "bg-[#e9e1df] text-[#1e1b1a] font-bold shadow-2xs"
                : "hover:bg-stone-100"
            }`}
          >
            100%
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1.8)}
            className={`px-2.5 py-1 rounded-full transition-all ${
              zoomLevel === 1.8
                ? "bg-[#e9e1df] text-[#1e1b1a] font-bold shadow-2xs"
                : "hover:bg-stone-100"
            }`}
          >
            200%
          </button>
        </div>

        {/* Canvas Preview Stage */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative w-full h-[460px] sm:h-[540px] rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-200 cursor-crosshair"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #e9e1df 25%, transparent 25%), linear-gradient(-45deg, #e9e1df 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e9e1df 75%), linear-gradient(-45deg, transparent 75%, #e9e1df 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        >
          {/* Custom Backdrop Layer for color preview */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              opacity: backdrop.type === "transparent" ? 0 : 1,
              backgroundColor:
                backdrop.type === "color" ? backdrop.value : "transparent",
              backgroundImage:
                backdrop.type === "image" ? `url('${backdrop.value}')` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Subject Rendered with Cutout Mask Layer */}
          <div
            className="relative max-w-full max-h-full transition-transform duration-200 ease-out flex items-center justify-center p-4"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3 bg-white/90 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-xs">
                <span className="w-8 h-8 border-3 border-[#006591] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-stone-700">
                  AI Segmenting Subject Edges…
                </span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={isComparing ? originalUrl : cutoutUrl}
                alt="Cutout Subject"
                className={`object-contain max-h-[420px] sm:max-h-[500px] pointer-events-none select-none transition-all duration-200 ${
                  retainShadows && !isComparing ? "drop-shadow-2xl" : ""
                }`}
              />
            )}

            {/* Interactive Brush Cursor Simulation */}
            {isHovering && !isProcessing && (
              <div
                className={`absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 border-2 ${
                  brushMode === "erase"
                    ? "border-[#0ea5e9] bg-[#0ea5e9]/20"
                    : "border-[#fd761a] bg-[#fd761a]/20"
                }`}
                style={{
                  width: `${brushSize}px`,
                  height: `${brushSize}px`,
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                }}
              />
            )}
          </div>

          {/* Micro Annotation Badge */}
          <div className="absolute bottom-4 left-4 bg-[#f2e580] text-[#201c00] px-3 py-1.5 rounded-lg shadow-md -rotate-1 text-xs font-semibold flex items-center gap-1.5 border border-amber-300/60 pointer-events-none">
            <svg
              className="w-3.5 h-3.5 text-amber-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>Ultra-fine hair strands &amp; wool edges isolated</span>
          </div>

          {/* Hold to Compare Original Button */}
          <button
            type="button"
            onMouseDown={() => setIsComparing(true)}
            onMouseUp={() => setIsComparing(false)}
            onMouseLeave={() => setIsComparing(false)}
            onTouchStart={() => setIsComparing(true)}
            onTouchEnd={() => setIsComparing(false)}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[#1e1b1a] text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-white transition-all border border-stone-200/80 active:scale-95"
          >
            <svg
              className="w-3.5 h-3.5 text-[#fd761a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span>{isComparing ? "Viewing Original" : "Hold to View Original"}</span>
          </button>
        </div>
      </div>

      {/* Canvas Quick Status Footer */}
      <div className="flex flex-wrap items-center justify-between px-2 text-xs text-[#3e4850] gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#006591] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#006591] animate-pulse" />
            Neural Engine Active
          </span>
          <span className="text-stone-300">•</span>
          <span>Alpha Channel: 8-bit Cleaned</span>
        </div>
        <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
          <span>Subject bounds: {subjectBoundsDesc}</span>
        </div>
      </div>
    </section>
  );
}
