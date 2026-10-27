import React from "react";

export default function RemoveBackgroundTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Precision Erase */}
      <div className="p-4 rounded-2xl bg-[#fbf2f0] shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-[#006591] shrink-0 mt-0.5">
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
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-[#1e1b1a]">
            Precision Erase
          </span>
          <p className="text-xs text-[#3e4850] leading-relaxed mt-0.5">
            Hold <kbd className="px-1.5 py-0.5 rounded bg-[#e9e1df] text-[10px] font-mono font-bold text-stone-700">Alt</kbd> while clicking on canvas to quickly switch between Erase and Restore brushes.
          </p>
        </div>
      </div>

      {/* Local AI Pipeline */}
      <div className="p-4 rounded-2xl bg-[#fbf2f0] shadow-xs flex items-start gap-3 border border-stone-200/60">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-[#fd761a] shrink-0 mt-0.5">
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
              d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m16-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-[#1e1b1a]">
            Local AI Pipeline
          </span>
          <p className="text-xs text-[#3e4850] leading-relaxed mt-0.5">
            High-fidelity edge detection executes strictly on your device using WebGL/Canvas acceleration.
          </p>
        </div>
      </div>

      {/* Alpha Transparent Ready */}
      <div className="p-4 rounded-2xl bg-[#fbf2f0] shadow-xs flex items-start gap-3 border border-stone-200/60">
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
              d="M7 21a4 4 0 01-4-4 4.5 4.5 0 014.5-4.5c.34 0 .67.04.99.11L18.66 2.44a2 2 0 112.83 2.83L11.32 15.44c.07.32.11.65.11.99a4.5 4.5 0 01-4.5 4.5z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-[#1e1b1a]">
            Alpha Transparent Ready
          </span>
          <p className="text-xs text-[#3e4850] leading-relaxed mt-0.5">
            Exports contain zero background residue, ready for instant drag-and-drop into Figma, Photoshop, or Premiere.
          </p>
        </div>
      </div>
    </div>
  );
}
