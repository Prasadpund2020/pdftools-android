"use client";

import React from "react";
import Link from "next/link";

interface JpgToPngHeaderBarProps {
  onReset: () => void;
  onLoadSample: () => void;
  fileCount: number;
}

export default function JpgToPngHeaderBar({
  onReset,
  onLoadSample,
  fileCount,
}: JpgToPngHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Claymorphic Tool Tile (Emerald Green PNG Theme) */}
        <div
          className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_24px_-6px_rgba(16,185,129,0.18),0_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center relative group cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow:
              "0 14px 28px -6px rgba(16,185,129,0.18), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 5px rgba(0,0,0,0.08)",
          }}
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.1)]">
            <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 text-[9px] font-bold text-white items-center justify-center">
              ✓
            </span>
          </span>
        </div>

        {/* Title & Eyebrow */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Link href="/all-tools" className="hover:text-emerald-700 transition-colors">
              Tools
            </Link>
            <span>/</span>
            <Link href="/all-tools/image" className="hover:text-emerald-700 transition-colors">
              Image Tools
            </Link>
            <span>/</span>
            <span className="text-emerald-700 font-bold">JPG to PNG Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Lossless Engine
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-0.5">
            Convert JPG to Lossless PNG Format
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Transform compressed JPEG photographs into uncompressed, truecolor PNG graphics with zero server uploads.
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
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800">
            {fileCount} {fileCount === 1 ? "File" : "Files"}
          </span>
        )}
      </div>
    </div>
  );
}
