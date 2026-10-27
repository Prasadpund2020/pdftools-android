"use client";

import React from "react";

interface TikTokSaverHeaderBarProps {
  hasVideo: boolean;
  onPasteFromClipboard: () => void;
  onReset: () => void;
}

export default function TikTokSaverHeaderBar({
  hasVideo,
  onPasteFromClipboard,
  onReset,
}: TikTokSaverHeaderBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl shadow-xs border border-stone-200/80 backdrop-blur-xs">
      <div className="flex items-center gap-3.5 flex-wrap min-w-0">
        <span className="px-3 py-1 rounded-full bg-cyan-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          No Watermark
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          TikTok Saver
        </h1>

        <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200/60 px-3 py-1.5 rounded-full text-cyan-900 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span>Full HD • Zero Platform Logo</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPasteFromClipboard}
          className="cursor-pointer px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan-50 text-cyan-800 hover:bg-cyan-100 transition-all text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 border border-cyan-200 active:scale-95"
        >
          <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
