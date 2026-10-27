import React from "react";

export default function TikTokSaverTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">100% No Watermark</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Completely strips both the stationary and moving TikTok corner watermarks for a pure video stream.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">Save Trending Audio</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Grab original sounds, remix tracks, and dialogue snippets in 320 kbps high-definition MP3.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">Mobile &amp; PC Ready</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Saves directly to your iPhone camera roll, Android Gallery, or computer Downloads folder.
          </p>
        </div>
      </div>
    </div>
  );
}
