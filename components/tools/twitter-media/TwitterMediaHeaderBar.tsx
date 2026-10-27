"use client";

import React from "react";

interface TwitterMediaHeaderBarProps {
  hasVideo: boolean;
  onPasteFromClipboard: () => void;
  onReset: () => void;
}

export default function TwitterMediaHeaderBar({
  hasVideo,
  onPasteFromClipboard,
  onReset,
}: TwitterMediaHeaderBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl shadow-xs border border-stone-200/80 backdrop-blur-xs">
      <div className="flex items-center gap-3.5 flex-wrap min-w-0">
        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X / Twitter MP4
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Twitter / X Video Downloader
        </h1>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/60 px-3 py-1.5 rounded-full text-blue-900 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Full 1080p MP4 &amp; GIF Loop</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPasteFromClipboard}
          className="cursor-pointer px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 border border-blue-200 active:scale-95"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
