"use client";

import React, { useState } from "react";
import { SAMPLE_VIDEOS } from "./sampleVideos";
import { YouTubeVideoMetadata } from "./types";

interface YouTubeDownloaderUrlInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (url: string) => void;
  onSelectSample: (sample: YouTubeVideoMetadata) => void;
  isLoading: boolean;
}

export default function YouTubeDownloaderUrlInput({
  url,
  onChangeUrl,
  onSubmit,
  onSelectSample,
  isLoading,
}: YouTubeDownloaderUrlInputProps) {
  const [pasteError, setPasteError] = useState(false);

  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChangeUrl(text);
          onSubmit(text);
        }
      }
    } catch {
      setPasteError(true);
      setTimeout(() => setPasteError(false), 2000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleFormSubmit}
        className="relative flex items-center w-full p-2 rounded-2xl bg-white shadow-lg border border-stone-200/90 focus-within:ring-2 focus-within:ring-amber-500/40 focus-within:border-amber-500 transition-all"
      >
        {/* YouTube Icon */}
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 ml-1">
          <svg
            className="w-5 h-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="Paste YouTube link here (e.g. https://www.youtube.com/watch?v=... or youtu.be/...)"
          className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
        />

        {/* Clear Button */}
        {url && (
          <button
            type="button"
            onClick={() => onChangeUrl("")}
            className="w-7 h-7 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 flex items-center justify-center text-xs mr-1"
          >
            ✕
          </button>
        )}

        {/* Paste Icon Button */}
        <button
          type="button"
          onClick={handlePaste}
          title="Paste from clipboard"
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-100 transition-colors mr-2 hidden sm:flex items-center gap-1 shrink-0"
        >
          <svg
            className="w-3.5 h-3.5 text-stone-600"
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
          <span>Paste</span>
        </button>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="px-4 sm:px-6 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <span>Fetch Video</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {pasteError && (
        <span className="text-xs text-rose-500 self-center">
          Could not read clipboard. Please paste manually into the field.
        </span>
      )}

      {/* Quick Test Sample Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
          Instant Test:
        </span>
        {SAMPLE_VIDEOS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200 text-xs font-medium text-slate-700 transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {sample.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
