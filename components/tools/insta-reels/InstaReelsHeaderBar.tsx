"use client";

import React from "react";

interface InstaReelsHeaderBarProps {
  hasVideo: boolean;
  onPasteFromClipboard: () => void;
  onReset: () => void;
}

export default function InstaReelsHeaderBar({
  hasVideo,
  onPasteFromClipboard,
  onReset,
}: InstaReelsHeaderBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl shadow-xs border border-stone-200/80 backdrop-blur-xs">
      <div className="flex items-center gap-3.5 flex-wrap min-w-0">
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Reels HD
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Instagram Reels Downloader
        </h1>

        <div className="flex items-center gap-2 bg-pink-50 border border-pink-200/60 px-3 py-1.5 rounded-full text-pink-900 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>Full 1080p • Direct MP4 &amp; Audio</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPasteFromClipboard}
          className="cursor-pointer px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 transition-all text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 border border-pink-200 active:scale-95"
        >
          <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Paste Link</span>
        </button>

        {hasVideo && (
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 sm:py-2 rounded-full bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all text-xs font-semibold shadow-xs border border-stone-200 active:scale-95"
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
