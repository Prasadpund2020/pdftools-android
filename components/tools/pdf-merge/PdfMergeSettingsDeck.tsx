"use client";

import React from "react";
import { MergeOptions } from "./types";

interface PdfMergeSettingsDeckProps {
  options: MergeOptions;
  onChangeOptions: (opts: Partial<MergeOptions>) => void;
  fileCount: number;
  totalPageCount: number;
  isMerging: boolean;
  onMerge: () => void;
}

export default function PdfMergeSettingsDeck({
  options,
  onChangeOptions,
  fileCount,
  totalPageCount,
  isMerging,
  onMerge,
}: PdfMergeSettingsDeckProps) {
  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-3xl bg-white/95 border border-stone-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800">
          Output &amp; Page Formatting
        </span>
        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          PDF-Lib WASM Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Output File Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Output File Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={options.outputFileName}
              onChange={(e) => onChangeOptions({ outputFileName: e.target.value })}
              placeholder="Merged_Document.pdf"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Page Normalization */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Standardize Page Dimensions
          </label>
          <select
            value={options.normalizePageSizes}
            onChange={(e) =>
              onChangeOptions({
                normalizePageSizes: e.target.value as "original" | "a4" | "letter",
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          >
            <option value="original">Keep Original Page Dimensions</option>
            <option value="a4">Standardize to A4 (595 × 842 pt)</option>
            <option value="letter">Standardize to US Letter (612 × 792 pt)</option>
          </select>
        </div>
      </div>

      {/* Page Numbers Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              onChangeOptions({ addPageNumbers: !options.addPageNumbers })
            }
            className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
              options.addPageNumbers ? "bg-blue-600" : "bg-stone-300"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                options.addPageNumbers ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-800">
              Add Consecutive Page Numbers
            </span>
            <span className="text-[11px] text-slate-500">
              Prints &ldquo;Page X of Y&rdquo; on every merged sheet
            </span>
          </div>
        </div>

        {options.addPageNumbers && (
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => onChangeOptions({ pageNumberPosition: "bottom-center" })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                options.pageNumberPosition === "bottom-center"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bottom Center
            </button>
            <button
              type="button"
              onClick={() => onChangeOptions({ pageNumberPosition: "bottom-right" })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                options.pageNumberPosition === "bottom-right"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bottom Right
            </button>
          </div>
        )}
      </div>

      {/* Big Tactile Blue Merge Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onMerge}
          disabled={isMerging || fileCount === 0}
          className="w-full h-13 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_12px_24px_-6px_rgba(37,99,235,0.35)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {isMerging ? (
            <>
              <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>Merging {fileCount} PDF Documents…</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <span>
                Merge {fileCount} {fileCount === 1 ? "PDF" : "PDFs"} ({totalPageCount} Pages) →
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
