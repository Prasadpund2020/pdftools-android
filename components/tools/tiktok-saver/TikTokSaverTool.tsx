"use client";

import React, { useState } from "react";
import TikTokSaverHeaderBar from "./TikTokSaverHeaderBar";
import TikTokSaverUrlInput from "./TikTokSaverUrlInput";
import TikTokSaverPreviewCard from "./TikTokSaverPreviewCard";
import TikTokSaverFormatSelector from "./TikTokSaverFormatSelector";
import TikTokSaverTips from "./TikTokSaverTips";
import { SAMPLE_TIKTOKS } from "./sampleTikToks";
import { TikTokMetadata } from "./types";
import { resolveTikTokVideo } from "./tiktokEngine";

export default function TikTokSaverTool() {
  const defaultVideo = SAMPLE_TIKTOKS[0];
  const [url, setUrl] = useState(defaultVideo.url);
  const [video, setVideo] = useState<TikTokMetadata | null>(defaultVideo);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFetchVideo = async (inputUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const resolved = await resolveTikTokVideo(inputUrl);
      setVideo(resolved);
      setUrl(resolved.url);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not fetch TikTok video. Please verify the link format.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: TikTokMetadata) => {
    setUrl(sample.url);
    setVideo(sample);
    setErrorMessage(null);
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          handleFetchVideo(text);
        }
      }
    } catch {
      setErrorMessage("Could not read clipboard. Please paste manually into the input box.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setVideo(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <TikTokSaverHeaderBar
        hasVideo={Boolean(video)}
        onPasteFromClipboard={handlePasteFromClipboard}
        onReset={handleReset}
      />

      <TikTokSaverUrlInput
        url={url}
        onChangeUrl={setUrl}
        onSubmit={handleFetchVideo}
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

      {video && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <TikTokSaverPreviewCard video={video} />
          <TikTokSaverFormatSelector video={video} />
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full mt-2">
        <TikTokSaverTips />
      </div>
    </div>
  );
}
