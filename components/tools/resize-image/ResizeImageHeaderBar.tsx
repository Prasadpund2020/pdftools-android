"use client";

import React from "react";
import Link from "next/link";

interface ResizeImageHeaderBarProps {
  onReset: () => void;
  onLoadSample: () => void;
  isProcessing?: boolean;
}

export default function ResizeImageHeaderBar({
  onReset,
  onLoadSample,
  isProcessing = false,
}: ResizeImageHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Claymorphic Tool Tile (Blue/Cyan Theme) */}
        <div
          className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_24px_-6px_rgba(2,132,199,0.18),0_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center relative group cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow:
              "0 14px 28px -6px rgba(2,132,199,0.18), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 5px rgba(0,0,0,0.08)",
          }}
        >
          <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center text-sky-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.1)]">
            <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>

          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-600 text-[9px] font-bold text-white items-center justify-center">
              ✓
            </span>
          </span>
        </div>

        {/* Title & Eyebrow */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Link href="/all-tools" className="hover:text-sky-700 transition-colors">
              Tools
            </Link>
            <span>/</span>
            <Link href="/all-tools/image" className="hover:text-sky-700 transition-colors">
              Image Tools
            </Link>
            <span>/</span>
            <span className="text-sky-700 font-bold">Image Resizer Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
              In-Memory Engine
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-0.5">
            Resize Image Dimensions &amp; Scale Aspect Ratio
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Scale pixel dimensions, crop to social presets, or reduce resolution with zero server uploads.
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onLoadSample}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Try Sample Demo
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Client-Side Sandbox Active
        </span>
      </div>
    </div>
  );
}
