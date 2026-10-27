import React from "react";

export default function InstaReelsTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">1080×1920 Full HD</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Preserves crisp 9:16 vertical resolution and 60 FPS fluidity for crystal clear social sharing.
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
          <span className="text-xs sm:text-sm font-bold text-slate-800">Original Audio Track</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Extract trending background songs, viral sound bites, and voiceovers straight into MP3.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">No Watermark &amp; Safe</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Clean video stream without third-party overlay stamps or platform account requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
