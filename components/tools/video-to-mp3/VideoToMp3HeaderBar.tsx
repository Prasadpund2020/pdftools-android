"use client";

import React from "react";

interface VideoToMp3HeaderBarProps {
  onReset: () => void;
}

export default function VideoToMp3HeaderBar({ onReset }: VideoToMp3HeaderBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Tactile 3D Clay Purple Tool Tile */}
        <div
          onClick={onReset}
          className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-[#c084fc] via-[#a855f7] to-[#7e22ce] flex items-center justify-center shadow-[0_16px_32px_-6px_rgba(168,85,247,0.45),inset_0_3px_5px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(88,28,135,0.4)] transform hover:-translate-y-1 transition-all duration-300 cursor-pointer shrink-0"
          title="Reset to default media"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          {/* Tactile micro light reflex dot */}
          <span className="absolute top-2 left-2.5 w-2 h-1.5 rounded-full bg-white/70 blur-[0.5px]" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-widest text-[#9333ea] bg-[#f3e8ff] px-2.5 py-0.5 rounded-full font-bold">
              Client-Side WASM Core
            </span>
            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              0% Server Upload
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">
            Video to MP3 &amp; Audio Lab
          </h1>
        </div>
      </div>

      {/* Quick Action Desk Badges */}
      <div className="flex items-center gap-2.5 self-start lg:self-center">
        <div className="px-3.5 py-1.5 rounded-full bg-white text-stone-800 text-xs sm:text-sm font-semibold shadow-xs border border-stone-200/80 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Queue (1 active)</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold shadow-xs border border-stone-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset Media</span>
        </button>
      </div>
    </div>
  );
}
