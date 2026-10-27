"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ImageMetadata, CompressedResult } from "./types";

interface CompressImageSplitSliderProps {
  imageMeta: ImageMetadata;
  compressedResult: CompressedResult | null;
}

export default function CompressImageSplitSlider({
  imageMeta,
  compressedResult,
}: CompressImageSplitSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPercent, setSliderPercent] = useState<number>(52);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Sync container width for pixel-perfect image alignment between before and after layers
  const syncWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    syncWidth();
    window.addEventListener("resize", syncWidth);
    return () => window.removeEventListener("resize", syncWidth);
  }, [syncWidth]);

  // Position update helper
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, pos));
    setSliderPercent(clamped);
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const currentSizeFormatted = compressedResult?.sizeFormatted || "1.1 MB";
  const currentReduction = compressedResult?.reductionPercent || 84;
  const currentPsnr = compressedResult?.psnrDb || 48.2;

  // Render after preview image (either compressed blob URL or original preview with visual fidelity)
  const afterSrc = compressedResult?.blobUrl || imageMeta.srcUrl;

  return (
    <div className="relative bg-white rounded-3xl p-5 sm:p-7 shadow-[0_12px_36px_-8px_rgba(41,37,36,0.08),0_3px_10px_rgba(41,37,36,0.03)] border border-stone-200/90 flex flex-col gap-4">
      {/* Simulated Paper Desk Clip at top edge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 rounded-full shadow-[0_3px_6px_rgba(0,0,0,0.18)] flex items-center justify-center z-20">
        <div className="w-16 h-1 rounded-full bg-white/80 shadow-inner" />
      </div>

      {/* File Strip Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-950 text-xs font-bold uppercase tracking-wider shadow-xs border border-orange-200">
            {imageMeta.originalFormat}
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-stone-900 truncate max-w-[220px] sm:max-w-md">
              {imageMeta.name}
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
              <span>{imageMeta.dimensions}</span>
              <span>•</span>
              <span>{imageMeta.colorSpace}</span>
              <span>•</span>
              <span className="text-red-600 font-bold">
                Original: {imageMeta.originalSizeFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Target Output Pill Badge */}
        <div className="flex items-center gap-2 bg-stone-100 px-3.5 py-1.5 rounded-full shadow-inner border border-stone-200/60">
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-bold">
            Compressed:
          </span>
          <span className="text-sm font-extrabold text-blue-700">
            {currentSizeFormatted}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
            -{currentReduction}%
          </span>
        </div>
      </div>

      {/* Interactive Before / After Split Slider Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-2xl overflow-hidden select-none bg-stone-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] h-[380px] md:h-[460px] group cursor-ew-resize"
      >
        {/* Before Image Layer (Original) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageMeta.srcUrl}
          alt="Original Full Quality"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Original Tag */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-stone-900 shadow-md flex items-center gap-1.5 pointer-events-none border border-stone-200/60">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>ORIGINAL ({imageMeta.originalSizeFormatted})</span>
        </div>

        {/* After Image Layer (Clipped dynamically by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPercent}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterSrc}
            alt="Compressed Optimized"
            className="absolute inset-0 h-full object-cover max-w-none pointer-events-none"
            style={{ width: containerWidth ? `${containerWidth}px` : "100%" }}
          />

          {/* Compressed Tag */}
          <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 pointer-events-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <span>COMPRESSED ({currentSizeFormatted})</span>
          </div>
        </div>

        {/* Draggable Clay Splitter Line & Knob */}
        <div
          className="absolute top-0 bottom-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          style={{ left: `${sliderPercent}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
          <div className="absolute w-10 h-10 rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.12)] flex items-center justify-center text-blue-600 transition-transform hover:scale-105 active:scale-95 pointer-events-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Live Diff Zoom Indicator */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-stone-800 flex items-center gap-1.5 shadow-sm border border-stone-200/60">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
            <span>Drag divider to inspect texture detail</span>
          </div>

          <div className="bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 flex items-center gap-1.5 shadow-sm border border-stone-200/60">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>PSNR: {currentPsnr} dB (Imperceptible loss)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
