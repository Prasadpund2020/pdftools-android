"use client";

import React from "react";
import Link from "next/link";

interface ConvertWebpHeaderBarProps {
  onReset: () => void;
  onLoadSample: () => void;
  fileCount: number;
}

export default function ConvertWebpHeaderBar({
  onReset,
  onLoadSample,
  fileCount,
}: ConvertWebpHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Claymorphic Tool Tile (Cyan WebP Theme) */}
        <div
          className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_24px_-6px_rgba(6,182,212,0.18),0_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center relative group cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow:
              "0 14px 28px -6px rgba(6,182,212,0.18), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 5px rgba(0,0,0,0.08)",
          }}
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.1)]">
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-600 text-[9px] font-bold text-white items-center justify-center">
              ✓
            </span>
          </span>
        </div>

        {/* Title & Eyebrow */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Link href="/all-tools" className="hover:text-cyan-700 transition-colors">
              Tools
            </Link>
            <span>/</span>
            <Link href="/all-tools/image" className="hover:text-cyan-700 transition-colors">
              Image Tools
            </Link>
            <span>/</span>
            <span className="text-cyan-700 font-bold">Convert to WebP Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold">
              Batch Fast Engine
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-0.5">
            Convert JPG &amp; PNG to Modern WebP Format
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Cut website image sizes by up to 85% with high-speed in-browser WebP encoding and ZIP bundling.
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onLoadSample}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          Load 3 Demos
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          Clear
        </button>

        {fileCount > 0 && (
          <span className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200/80 text-[11px] font-bold text-cyan-800">
            {fileCount} {fileCount === 1 ? "Image" : "Images"} Loaded
          </span>
        )}
      </div>
    </div>
  );
}
