"use client";

import React, { useState } from "react";
import InstaReelsHeaderBar from "./InstaReelsHeaderBar";
import InstaReelsUrlInput from "./InstaReelsUrlInput";
import InstaReelsPreviewCard from "./InstaReelsPreviewCard";
import InstaReelsFormatSelector from "./InstaReelsFormatSelector";
import InstaReelsTips from "./InstaReelsTips";
import { SAMPLE_REELS } from "./sampleReels";
import { InstagramReelMetadata } from "./types";
import { resolveInstagramReel } from "./instaReelsEngine";

export default function InstaReelsTool() {
  const defaultReel = SAMPLE_REELS[0];
  const [url, setUrl] = useState(defaultReel.url);
  const [reel, setReel] = useState<InstagramReelMetadata | null>(defaultReel);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFetchReel = async (inputUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const resolved = await resolveInstagramReel(inputUrl);
      setReel(resolved);
      setUrl(resolved.url);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not fetch Reel. Please check the URL format and try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: InstagramReelMetadata) => {
    setUrl(sample.url);
    setReel(sample);
    setErrorMessage(null);
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          handleFetchReel(text);
        }
      }
    } catch {
      setErrorMessage("Could not access system clipboard. Please paste manually into the input box.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setReel(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <InstaReelsHeaderBar
        hasVideo={Boolean(reel)}
        onPasteFromClipboard={handlePasteFromClipboard}
        onReset={handleReset}
      />

      <InstaReelsUrlInput
        url={url}
        onChangeUrl={setUrl}
        onSubmit={handleFetchReel}
        onSelectSample={handleSelectSample}
        isLoading={isLoading}
      />

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center justify-between max-w-4xl mx-auto w-full">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800"
          >
            ✕
          </button>
        </div>
      )}

      {reel && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <InstaReelsPreviewCard reel={reel} />
          <InstaReelsFormatSelector reel={reel} />
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full mt-2">
        <InstaReelsTips />
      </div>
    </div>
  );
}
