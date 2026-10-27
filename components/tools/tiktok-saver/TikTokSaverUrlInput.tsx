"use client";

import React, { useState } from "react";
import { SAMPLE_TIKTOKS } from "./sampleTikToks";
import { TikTokMetadata } from "./types";

interface TikTokSaverUrlInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (url: string) => void;
  onSelectSample: (sample: TikTokMetadata) => void;
  isLoading: boolean;
}

export default function TikTokSaverUrlInput({
  url,
  onChangeUrl,
  onSubmit,
  onSelectSample,
  isLoading,
}: TikTokSaverUrlInputProps) {
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
        className="relative flex items-center w-full p-2 rounded-2xl bg-white shadow-lg border border-stone-200/90 focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:border-cyan-500 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 ml-1">
          <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="Paste TikTok link here (e.g. https://www.tiktok.com/@user/video/... or vm.tiktok.com/...)"
          className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-stone-400 focus:outline-none bg-transparent"
        />

        {url && (
          <button
            type="button"
            onClick={() => onChangeUrl("")}
            className="w-7 h-7 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 flex items-center justify-center text-xs mr-1"
          >
            ✕
          </button>
        )}

        <button
          type="button"
          onClick={handlePaste}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-100 transition-colors mr-2 hidden sm:flex items-center gap-1 shrink-0"
        >
          <span>Paste</span>
        </button>

        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="px-4 sm:px-6 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Removing Watermark…</span>
            </>
          ) : (
            <>
              <span>Save Video</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {pasteError && (
        <span className="text-xs text-rose-500 self-center">
          Could not read clipboard. Please paste manually into the input box.
        </span>
      )}

      {/* Quick Test Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
          Instant Test:
        </span>
        {SAMPLE_TIKTOKS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-cyan-50 hover:border-cyan-300 border border-stone-200 text-xs font-medium text-slate-700 transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="truncate max-w-[150px] sm:max-w-[220px]">
              @{sample.authorUsername}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
