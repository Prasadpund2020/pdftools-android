"use client";

import React from "react";
import { ConversionMode } from "./types";

interface PdfToJpgModeBarProps {
  mode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onInvertSelection: () => void;
}

export default function PdfToJpgModeBar({
  mode,
  onModeChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
}: PdfToJpgModeBarProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-stone-100 p-2 sm:p-2.5 rounded-2xl border border-stone-200/80 shadow-2xs">
      {/* Segmented Mode Switcher */}
      <div className="flex items-center p-1 bg-stone-200/70 rounded-full w-full md:w-auto shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange("entire-pages")}
          className={`flex-1 md:flex-initial px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === "entire-pages"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>Convert Entire Pages</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("extract-images")}
          className={`flex-1 md:flex-initial px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === "extract-images"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Extract Embedded Images Only</span>
        </button>
      </div>

      {/* Quick Selector Controls & Counter */}
      <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-stone-600 text-xs font-semibold shadow-2xs border border-stone-200">
          <span className="font-extrabold text-blue-700">{selectedCount}</span>
          <span>of {totalCount} Selected</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-2xs border border-stone-200 transition-colors cursor-pointer"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 text-stone-600 font-bold text-xs shadow-2xs border border-stone-200 transition-colors cursor-pointer"
          >
            Deselect
          </button>
          <button
            type="button"
            onClick={onInvertSelection}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 text-stone-600 font-bold text-xs shadow-2xs border border-stone-200 transition-colors cursor-pointer hidden sm:block"
          >
            Invert
          </button>
        </div>
      </div>
    </div>
  );
}
