"use client";

import React from "react";
import { MergePdfItem } from "./types";
import { formatBytes } from "./pdfMergeEngine";

interface PdfMergeFileGridProps {
  items: MergePdfItem[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  isMerging: boolean;
}

export default function PdfMergeFileGrid({
  items,
  onMoveUp,
  onMoveDown,
  onRotate,
  onRemove,
  isMerging,
}: PdfMergeFileGridProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Merge Order &amp; Page Setup ({items.length} Files)
        </span>
        <span className="text-[11px] text-slate-500">
          Reorder with buttons or rotate individual files
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-stone-200/80 shadow-xs hover:border-blue-300 transition-all group"
          >
            {/* Left: Sequence badge & file info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                #{idx + 1}
              </span>

              {/* PDF Document Mini Icon */}
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[320px] md:max-w-[420px]">
                  {item.name}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-blue-600">
                    {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span>{formatBytes(item.size)}</span>
                  {item.rotation !== 0 && (
                    <>
                      <span className="text-stone-300">•</span>
                      <span className="text-amber-600 font-medium">
                        Rotated {item.rotation}°
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order & Tool controls */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              {/* Move Up */}
              <button
                type="button"
                onClick={() => onMoveUp(idx)}
                disabled={idx === 0 || isMerging}
                title="Move earlier in merge order"
                className="w-8 h-8 rounded-lg bg-stone-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              {/* Move Down */}
              <button
                type="button"
                onClick={() => onMoveDown(idx)}
                disabled={idx === items.length - 1 || isMerging}
                title="Move later in merge order"
                className="w-8 h-8 rounded-lg bg-stone-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Rotate 90 deg */}
              <button
                type="button"
                onClick={() => onRotate(item.id)}
                disabled={isMerging}
                title="Rotate pages by 90°"
                className="w-8 h-8 rounded-lg bg-stone-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Remove file */}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isMerging}
                title="Remove from merge list"
                className="w-8 h-8 rounded-lg bg-stone-100 text-stone-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
