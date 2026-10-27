"use client";

import React, { useRef } from "react";

interface RemoveBackgroundHeaderBarProps {
  fileName: string;
  width: number;
  height: number;
  onReplaceFile: (file: File) => void;
  onReset: () => void;
  isProcessing: boolean;
}

export default function RemoveBackgroundHeaderBar({
  fileName,
  width,
  height,
  onReplaceFile,
  onReset,
  isProcessing,
}: RemoveBackgroundHeaderBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onReplaceFile(e.target.files[0]);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-[#fbf2f0] p-4 rounded-2xl shadow-xs border border-stone-200/60">
      <div className="flex items-center gap-3.5 flex-wrap min-w-0">
        {/* Category Pill */}
        <span className="px-3 py-1 rounded-full bg-[#fd761a] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          AI Cutout
        </span>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#1e1b1a] tracking-tight">
          Remove Background Studio
        </h1>

        {/* Image Spec Chip */}
        <div className="flex items-center gap-2 bg-[#e9e1df] px-3 py-1.5 rounded-full text-[#3e4850] text-xs font-semibold">
          <svg
            className="w-3.5 h-3.5 text-[#006591]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate max-w-[180px] sm:max-w-[240px]">
            {fileName}
          </span>
          <span className="text-[#6e7881] text-xs">•</span>
          <span className="text-xs">
            {width > 0 && height > 0 ? `${width}×${height}` : "HD Photo"}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="cursor-pointer px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-[#1e1b1a] hover:bg-stone-100 transition-all text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 border border-stone-200/80 active:scale-95"
        >
          <svg
            className="w-4 h-4 text-[#006591]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span>Replace Photo</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Revert Changes"
          disabled={isProcessing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#3e4850] hover:text-[#1e1b1a] hover:bg-stone-100 transition-all flex items-center justify-center shadow-xs border border-stone-200/80 active:scale-95"
        >
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
