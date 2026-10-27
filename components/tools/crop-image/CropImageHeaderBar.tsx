"use client";

import React from "react";
import Link from "next/link";

interface CropImageHeaderBarProps {
  onReset: () => void;
  onLoadSample: () => void;
  onRotateClockwise: () => void;
  onFlipHorizontal: () => void;
}

export default function CropImageHeaderBar({
  onReset,
  onLoadSample,
  onRotateClockwise,
  onFlipHorizontal,
}: CropImageHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Claymorphic Tool Tile (Rose / Pink Crop Theme) */}
        <div
          className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_24px_-6px_rgba(244,63,94,0.18),0_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center relative group cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow:
              "0 14px 28px -6px rgba(244,63,94,0.18), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 5px rgba(0,0,0,0.08)",
          }}
        >
          <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center text-pink-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.1)]">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>

          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-600 text-[9px] font-bold text-white items-center justify-center">
              ✓
            </span>
          </span>
        </div>

        {/* Title & Eyebrow */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Link href="/all-tools" className="hover:text-pink-700 transition-colors">
              Tools
            </Link>
            <span>/</span>
            <Link href="/all-tools/image" className="hover:text-pink-700 transition-colors">
              Image Tools
            </Link>
            <span>/</span>
            <span className="text-pink-700 font-bold">Image Crop Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold">
              Precision Frame
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-0.5">
            Crop Image &amp; Refocus Visual Aspect Ratio
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Drag to trim unwanted borders, crop to exact 1:1, 16:9, or 4:5 ratios, and rotate directly in your browser.
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRotateClockwise}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          title="Rotate 90 degrees clockwise"
        >
          <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rotate 90°
        </button>

        <button
          type="button"
          onClick={onFlipHorizontal}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          title="Flip horizontally"
        >
          <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Flip H
        </button>

        <button
          type="button"
          onClick={onLoadSample}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          Sample
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
