"use client";

import React from "react";
import { AudioFormat, AudioBitrate } from "./types";

interface VideoToMp3ActionCtaProps {
  format: AudioFormat;
  bitrate: AudioBitrate;
  estimatedSize: string;
  onExtract: () => void;
  isExtracting?: boolean;
  statusMessage?: string;
}

export default function VideoToMp3ActionCta({
  format,
  bitrate,
  estimatedSize,
  onExtract,
  isExtracting = false,
  statusMessage,
}: VideoToMp3ActionCtaProps) {
  const formatUpper = format.toUpperCase();

  return (
    <div className="flex flex-col gap-6 pt-4 border-t border-stone-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Estimated size info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium">
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {statusMessage ? (
              <span className="text-[#9333ea] font-bold">{statusMessage}</span>
            ) : (
              `Estimated file size: ${estimatedSize}`
            )}
          </span>
        </div>

        {/* Master Action Button */}
        <button
          type="button"
          onClick={onExtract}
          disabled={isExtracting}
          className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#7e22ce] hover:brightness-105 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_12px_28px_-6px_rgba(168,85,247,0.5),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-3px_5px_rgba(76,29,149,0.4)] active:translate-y-0.5 active:shadow-[0_4px_10px_rgba(168,85,247,0.3)] transition-all cursor-pointer disabled:opacity-50"
        >
          {isExtracting ? (
            <>
              <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Demuxing &amp; Assembling Audio...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>
                Extract &amp; Download {formatUpper} ({bitrate} kbps)
              </span>
            </>
          )}
        </button>
      </div>

      {/* Secondary Information Card: Audio Engine Benchmarks & Formats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200/60 shadow-2xs flex items-center justify-center gap-2 text-xs font-bold text-stone-600">
          <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Lossless Demux</span>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200/60 shadow-2xs flex items-center justify-center gap-2 text-xs font-bold text-stone-600">
          <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <span>Multi-Threaded WASM</span>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200/60 shadow-2xs flex items-center justify-center gap-2 text-xs font-bold text-stone-600">
          <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>100% Client-Side</span>
        </div>
      </div>
    </div>
  );
}
