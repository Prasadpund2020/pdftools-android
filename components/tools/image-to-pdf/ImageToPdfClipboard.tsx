"use client";

import React from "react";
import Link from "next/link";
import { RecentPdf } from "./types";

interface ImageToPdfClipboardProps {
  recentHistory: RecentPdf[];
  onDownloadRecent: (item: RecentPdf) => void;
}

export default function ImageToPdfClipboard({
  recentHistory,
  onDownloadRecent,
}: ImageToPdfClipboardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Physical Clipboard Container with Metal Binder Clip */}
      <div className="relative pt-6">
        {/* Metaphor: Metallic Silver Binder Clip at Top Center */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-16 h-8 rounded-t-md bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 shadow-[0_4px_8px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <div className="w-10 h-1 rounded-full bg-stone-500 shadow-inner" />
          <div className="absolute -bottom-1 w-12 h-2 rounded bg-stone-700 shadow-xs" />
        </div>

        {/* Clipboard Paper Sheet Surface */}
        <div className="relative p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-[0_14px_32px_-6px_rgba(41,37,36,0.1),0_4px_12px_-2px_rgba(41,37,36,0.05)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-900">Recent Output</h3>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Desk History
            </span>
          </div>

          {/* List of Previous PDF conversions */}
          <div className="flex flex-col gap-2.5">
            {recentHistory.length === 0 ? (
              <div className="py-6 px-4 rounded-2xl bg-stone-50/80 border border-dashed border-stone-200 text-center">
                <svg
                  className="w-8 h-8 text-stone-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-xs text-stone-500 font-medium">
                  Converted PDFs will appear here for fast re-download.
                </p>
              </div>
            ) : (
              recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/90 border border-stone-200/60 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        item.themeColor || "bg-orange-100 text-orange-700"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div
                        className="text-xs sm:text-sm font-semibold text-stone-900 truncate"
                        title={item.fileName}
                      >
                        {item.fileName}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.fileCount} {item.fileCount === 1 ? "image" : "images"} • {item.fileSize} •{" "}
                        {item.timestamp}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDownloadRecent(item)}
                    className="p-2 rounded-full hover:bg-white text-orange-600 hover:text-orange-700 hover:shadow-xs transition-all shrink-0 cursor-pointer"
                    title="Download this PDF"
                    aria-label="Download PDF"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Companion Tools */}
          <div className="mt-5 pt-4 border-t border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2.5">
              Companion Tools
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/all-tools/pdf/compress-pdf"
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold text-stone-800 truncate">Compress PDF</span>
              </Link>

              <Link
                href="/all-tools/pdf/pdf-to-word"
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold text-stone-800 truncate">PDF to Word</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Local Hardware Gauge Card */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
            WebAssembly PDF Engine
          </div>
          <div className="text-xs text-stone-500 truncate">
            Hardware GPU acceleration active
          </div>
        </div>

        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(253,118,26,0.6)] shrink-0 animate-pulse" />
      </div>
    </div>
  );
}
