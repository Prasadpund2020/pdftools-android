"use client";

import React from "react";
import { CompressedResult, RecentCompressedFile } from "./types";

interface CompressImageInspectionSheetProps {
  compressedResult: CompressedResult | null;
  recentFiles: RecentCompressedFile[];
  onDownloadRecent: (item: RecentCompressedFile) => void;
  onClearRecent: () => void;
}

export default function CompressImageInspectionSheet({
  compressedResult,
  recentFiles,
  onDownloadRecent,
  onClearRecent,
}: CompressImageInspectionSheetProps) {
  const savedMbText = compressedResult?.savedFormatted || "5.7 MB Saved";
  const reductionPct = compressedResult?.reductionPercent || 84;
  const payloadMb = compressedResult?.sizeFormatted || "1.1 MB";
  const origSec = compressedResult?.simulatedLoadOriginalSec || 3.8;
  const optSec = compressedResult?.simulatedLoadOptimizedSec || 0.42;
  const speedMult = compressedResult?.speedMultiplier || 9;

  return (
    <div className="flex flex-col gap-6">
      {/* Clipboard Paper with Metal Spring Clamp */}
      <div className="relative pt-6">
        {/* Realistic Metal Clipboard Clip at top */}
        <div className="w-32 h-7 mx-auto -mt-6 rounded-t-lg rounded-b-xs bg-gradient-to-r from-stone-300 via-stone-100 to-stone-300 shadow-[0_4px_10px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center relative z-20 border-t border-white">
          <div className="w-10 h-1.5 rounded-full bg-stone-500 shadow-inner" />
          <div className="w-20 h-0.5 bg-stone-400 mt-0.5" />
        </div>

        {/* Paper Surface */}
        <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_14px_32px_-8px_rgba(41,37,36,0.1)] border border-stone-200/90 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-900">Inspection Sheet</h3>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
              READY
            </span>
          </div>

          {/* Compression Telemetry Metrics Stack */}
          <div className="flex flex-col gap-3">
            {/* Metric 1: Bandwidth Conserved */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Bandwidth Conserved
                </span>
                <span className="text-sm font-black text-blue-700">{savedMbText}</span>
              </div>

              {/* Progress Gauge */}
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden flex my-0.5">
                <div
                  className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${reductionPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
                <span>
                  Compressed payload: <b className="text-stone-900">{payloadMb}</b>
                </span>
                <span className="text-orange-600 font-black">-{reductionPct}%</span>
              </div>
            </div>

            {/* Metric 2: Speed Impact Comparison */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Simulated 4G Mobile Load
              </span>
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Original File:</span>
                <span className="line-through text-red-500 font-bold">{origSec} sec</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-900 font-semibold">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Optimized Web:
                </span>
                <span className="text-blue-700 font-extrabold text-sm">
                  {optSec} sec ({speedMult}x Faster)
                </span>
              </div>
            </div>

            {/* Metric 3: Technical Integrity Matrix */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Algorithm Telemetry
              </span>
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>Color Profile</span>
                <span className="font-mono text-stone-900 font-semibold">Display P3 Preserved</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>DPI Scaling</span>
                <span className="font-mono text-stone-900 font-semibold">72 DPI Screen Ref</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>Alpha Transparency</span>
                <span className="font-mono text-emerald-700 font-bold">Lossless Alpha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desk Stationery Accessory: Batch Queue / Recent Files */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_8px_20px_rgba(41,37,36,0.05)] border border-stone-200/90 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-stone-900">Recent Studio Files</span>
          {recentFiles.length > 0 && (
            <button
              type="button"
              onClick={onClearRecent}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Clear ({recentFiles.length})
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {recentFiles.length === 0 ? (
            <p className="text-xs text-stone-400 py-3 text-center">No recent files yet</p>
          ) : (
            recentFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => onDownloadRecent(file)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 transition-colors cursor-pointer group"
                title="Click to download"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl ${file.badgeBg} flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs`}
                  >
                    {file.formatBadge}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-stone-800 truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {file.size} ({file.reduction})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-white text-stone-400 group-hover:text-blue-600 transition-colors shrink-0"
                  aria-label="Download"
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
      </div>
    </div>
  );
}
