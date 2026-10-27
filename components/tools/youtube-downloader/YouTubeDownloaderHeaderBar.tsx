"use client";

import React from "react";

interface YouTubeDownloaderHeaderBarProps {
  hasVideo: boolean;
  onPasteFromClipboard: () => void;
  onReset: () => void;
}

export default function YouTubeDownloaderHeaderBar({
  hasVideo,
  onPasteFromClipboard,
  onReset,
}: YouTubeDownloaderHeaderBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl shadow-xs border border-stone-200/80 backdrop-blur-xs">
      <div className="flex items-center gap-3.5 flex-wrap min-w-0">
        {/* Tool Badge */}
        <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-slate-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          1080p &amp; MP3
        </span>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          YouTube Downloader
        </h1>

        {/* Engine status chip */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full text-amber-900 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Direct High-Speed Stream Dispatch</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPasteFromClipboard}
          className="cursor-pointer px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 border border-amber-200 active:scale-95"
        >
          <svg
            className="w-4 h-4 text-amber-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>Paste Link</span>
        </button>

        {hasVideo && (
          <button
            type="button"
            onClick={onReset}
            title="Search another video"
            className="px-3 py-1.5 sm:py-2 rounded-full bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all text-xs font-semibold shadow-xs border border-stone-200 active:scale-95"
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
