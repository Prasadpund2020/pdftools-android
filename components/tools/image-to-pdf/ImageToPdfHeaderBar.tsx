"use client";

import React from "react";
import Link from "next/link";

interface ImageToPdfHeaderBarProps {
  stagedCount: number;
  totalSizeMb: string;
  onClearAll: () => void;
}

export default function ImageToPdfHeaderBar({
  stagedCount,
  totalSizeMb,
  onClearAll,
}: ImageToPdfHeaderBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6">
      {/* Left: Breadcrumb trail */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <Link
          href="/all-tools"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Tools Studio</span>
        </Link>

        <span className="text-stone-300 font-bold">•</span>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-950 font-bold text-xs sm:text-sm shadow-xs border border-orange-200/60">
          <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span>Image to PDF</span>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1 hidden sm:inline-block">
          Batch Stage 01
        </span>
      </div>

      {/* Right: Counter and Clear All */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-stone-200/80 text-stone-600 text-xs sm:text-sm font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              stagedCount > 0 ? "bg-orange-500 animate-pulse" : "bg-stone-300"
            }`}
          />
          <span className="font-semibold text-stone-800">
            {stagedCount} {stagedCount === 1 ? "File" : "Files"} Staged
          </span>
          <span className="text-stone-300">|</span>
          <span className="font-bold text-stone-900">{totalSizeMb} Total</span>
        </div>

        {stagedCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="p-2 rounded-full bg-stone-100 text-stone-500 hover:text-red-600 hover:bg-red-50 border border-stone-200/60 transition-all cursor-pointer"
            title="Clear all staged files"
            aria-label="Clear all files"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
