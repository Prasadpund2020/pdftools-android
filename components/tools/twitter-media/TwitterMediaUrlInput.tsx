"use client";

import React, { useState } from "react";
import { SAMPLE_TWEETS } from "./sampleTweets";
import { TwitterMediaMetadata } from "./types";

interface TwitterMediaUrlInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (url: string) => void;
  onSelectSample: (sample: TwitterMediaMetadata) => void;
  isLoading: boolean;
}

export default function TwitterMediaUrlInput({
  url,
  onChangeUrl,
  onSubmit,
  onSelectSample,
  isLoading,
}: TwitterMediaUrlInputProps) {
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
        className="relative flex items-center w-full p-2 rounded-2xl bg-white shadow-lg border border-stone-200/90 focus-within:ring-2 focus-within:ring-slate-900/40 focus-within:border-slate-900 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 ml-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="Paste Twitter / X video link here (e.g. https://x.com/.../status/...)"
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
          className="px-4 sm:px-6 h-10 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          Could not read clipboard. Please paste manually into the input box.
        </span>
      )}

      {/* Quick Test Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
          Instant Test:
        </span>
        {SAMPLE_TWEETS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 hover:border-slate-400 border border-stone-200 text-xs font-medium text-slate-700 transition-all shadow-2xs flex items-center gap-1.5 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <span className="truncate max-w-[150px] sm:max-w-[220px]">
              @{sample.authorUsername}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
