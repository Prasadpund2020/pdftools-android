"use client";

import React from "react";
import Link from "next/link";

interface CompressImageHeaderBarProps {
  onReset: () => void;
  onToggleLog?: () => void;
  isLogOpen?: boolean;
}

export default function CompressImageHeaderBar({
  onReset,
  onToggleLog,
  isLogOpen = false,
}: CompressImageHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Claymorphic Tool Tile (Emerald Green Image Compressor) */}
        <div
          className="w-16 h-16 rounded-2xl bg-white shadow-[0_12px_24px_-6px_rgba(16,185,129,0.18),0_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center relative group cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow:
              "0 14px 28px -6px rgba(5,150,105,0.18), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 5px rgba(0,0,0,0.08)",
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
            <span className="text-emerald-700 font-bold">Image Optimizer Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              In-Memory Engine
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 mt-0.5">
            Compress &amp; Convert Image
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
              v2.4 WebAssembly
            </span>
          </h1>
        </div>
      </div>

      {/* Quick Desk Navigation & Presets */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          title="Reset to default image"
        >
          <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset File</span>
        </button>

        {onToggleLog && (
          <button
            type="button"
            onClick={onToggleLog}
            className={`px-3.5 py-1.5 rounded-full bg-white text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-semibold shadow-xs border border-stone-200/80 flex items-center gap-1.5 transition-all cursor-pointer ${
              isLogOpen ? "border-emerald-500 text-emerald-700" : ""
            }`}
          >
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Session Log</span>
          </button>
        )}
      </div>
    </div>
  );
}
