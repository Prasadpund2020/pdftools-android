import React from "react";

export default function TwitterMediaTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">1080p MP4 &amp; 60 FPS</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Parses progressive multi-bitrate streams to guarantee highest visual fidelity without blocky pixelation.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">Animated GIF Conversion</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Converts short Twitter video loops into genuine `.gif` image files ready for Slack and Discord reactions.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/90 shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-800">Zero Logins or API Keys</span>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Download public media without linking your Twitter account or exposing your session cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
