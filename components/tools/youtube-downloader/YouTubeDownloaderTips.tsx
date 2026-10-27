import React from "react";

export default function YouTubeDownloaderTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            Full 1080p &amp; 60 FPS
          </span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Retains original broadcast frames and bitrate without lossy downscaling or compression artifacts.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
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
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            320 kbps Studio Audio
          </span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Extract crystalline stereo audio tracks for podcast offline listening, workouts, and music production.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            Zero Watermark &amp; Safe
          </span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Clean files with no added logos or third-party banners. Clean direct stream downloads.
          </p>
        </div>
      </div>
    </div>
  );
}
