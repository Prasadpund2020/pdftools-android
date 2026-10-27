"use client";

import React from "react";

interface DocumentToolbarProps {
  currentPage: number;
  pageCount: number;
  zoomLevel: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddSignature: () => void;
  onDrawSignature: () => void;
  onInsertDate: () => void;
}

export default function DocumentToolbar({
  currentPage,
  pageCount,
  zoomLevel,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onAddSignature,
  onDrawSignature,
  onInsertDate,
}: DocumentToolbarProps) {
  return (
    <div className="w-full max-w-[700px] bg-white/95 backdrop-blur-md rounded-full px-4 py-2 border border-stone-200/90 shadow-md flex items-center justify-between gap-3 flex-wrap">
      {/* Page Navigation */}
      <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-full">
        <button
          type="button"
          onClick={onPrevPage}
          className="w-6 h-6 rounded-full bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage <= 1}
        >
          ‹
        </button>
        <span className="px-2 text-xs font-bold text-stone-800">
          Page {currentPage} of {pageCount}
        </span>
        <button
          type="button"
          onClick={onNextPage}
          className="w-6 h-6 rounded-full bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage >= pageCount}
        >
          ›
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onZoomOut}
          className="w-7 h-7 rounded-full hover:bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>
        <span className="text-xs font-mono font-bold text-stone-700 px-1">
          {zoomLevel}%
        </span>
        <button
          type="button"
          onClick={onZoomIn}
          className="w-7 h-7 rounded-full hover:bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
      </div>

      <div className="w-px h-5 bg-stone-200 hidden sm:block" />

      {/* Tool Insertion Palette */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onAddSignature}
          className="h-7 px-3 rounded-full bg-[#043d2c] text-white hover:bg-[#032e21] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          title="Add Signature Stamp"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Signature</span>
        </button>

        <button
          type="button"
          onClick={onDrawSignature}
          className="h-7 px-3 rounded-full hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          title="Draw by Hand"
        >
          <span>Draw</span>
        </button>

        <button
          type="button"
          onClick={onInsertDate}
          className="h-7 px-2.5 rounded-full hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          title="Today's Date"
        >
          <span>Date</span>
        </button>
      </div>
    </div>
  );
}
