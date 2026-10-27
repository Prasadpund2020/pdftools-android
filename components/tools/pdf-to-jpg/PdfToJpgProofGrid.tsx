"use client";

import React from "react";
import { ProofPage } from "./types";

interface PdfToJpgProofGridProps {
  pages: ProofPage[];
  onTogglePage: (pageNumber: number) => void;
  onInspectPage: (page: ProofPage) => void;
}

export default function PdfToJpgProofGrid({
  pages,
  onTogglePage,
  onInspectPage,
}: PdfToJpgProofGridProps) {
  return (
    <div className="flex flex-col gap-5 bg-stone-100/90 p-5 sm:p-7 rounded-3xl shadow-[0_12px_32px_-8px_rgba(41,37,36,0.06)] border border-stone-200/90 relative">
      {/* Visual Clay Hanging Clip Metaphor */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-gradient-to-b from-stone-300 via-stone-200 to-stone-400 shadow-md flex items-center justify-center z-10 border border-white/60">
        <div className="w-12 h-1 bg-white/70 rounded-full shadow-inner" />
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Proof Stage Pages
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Click thumbnails to toggle inclusion
        </span>
      </div>

      {/* 8-Card Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 select-none">
        {pages.map((p) => (
          <div
            key={p.pageNumber}
            onClick={() => onTogglePage(p.pageNumber)}
            className={`group relative bg-white rounded-2xl p-2 flex flex-col gap-2 shadow-sm transition-all duration-200 cursor-pointer border ${
              p.isSelected
                ? "ring-2 ring-blue-600 bg-blue-50/40 border-blue-200 shadow-md scale-[1.01]"
                : "opacity-40 border-stone-200 hover:opacity-75"
            }`}
          >
            {/* Thumbnail Canvas / Image */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.previewUrl}
                alt={p.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
              />

              {/* Checkbox Top-Left */}
              <div
                className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center shadow-md transition-all ${
                  p.isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-white/80 text-stone-400 border border-stone-300"
                }`}
              >
                {p.isSelected && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Zoom Preview Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectPage(p);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-xs cursor-pointer"
                title={`Inspect ${p.label}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </button>

              {/* Tag bottom-right */}
              {p.badgeLabel && (
                <div className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-[10px] text-white font-bold">
                  {p.badgeLabel}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between px-1.5 py-0.5">
              <span className="text-xs sm:text-sm font-bold text-stone-900">{p.label}</span>
              <span className="text-[11px] font-semibold text-stone-400">{p.sizeFormatted}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Note Tip Overlay */}
      <div className="mt-2 p-4 rounded-2xl bg-[#fef08a] text-[#713f12] shadow-sm rotate-[-0.6deg] max-w-lg self-start flex items-start gap-3 border border-yellow-300/80">
        <svg className="w-5 h-5 text-yellow-800 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-900">
            Pro-tip for print designers
          </span>
          <p className="text-xs text-yellow-950 mt-0.5 leading-relaxed">
            Select individual pages to isolate cover spreads or export high-resolution (300 DPI) spreads for client sign-offs.
          </p>
        </div>
      </div>
    </div>
  );
}
