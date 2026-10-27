"use client";

import React, { useState } from "react";
import YouTubeDownloaderHeaderBar from "./YouTubeDownloaderHeaderBar";
import YouTubeDownloaderUrlInput from "./YouTubeDownloaderUrlInput";
import YouTubeDownloaderPreviewCard from "./YouTubeDownloaderPreviewCard";
import YouTubeDownloaderFormatSelector from "./YouTubeDownloaderFormatSelector";
import YouTubeDownloaderTips from "./YouTubeDownloaderTips";
import { SAMPLE_VIDEOS } from "./sampleVideos";
import { YouTubeVideoMetadata } from "./types";
import { resolveYouTubeVideo } from "./youtubeEngine";

export default function YouTubeDownloaderTool() {
  const defaultVideo = SAMPLE_VIDEOS[0];
  const [url, setUrl] = useState(defaultVideo.url);
  const [video, setVideo] = useState<YouTubeVideoMetadata | null>(defaultVideo);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFetchVideo = async (inputUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const resolved = await resolveYouTubeVideo(inputUrl);
      setVideo(resolved);
      setUrl(resolved.url);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not fetch video. Please check the URL format and try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: YouTubeVideoMetadata) => {
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
      setErrorMessage("Could not access system clipboard. Please paste manually into the input box.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setVideo(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Workspace Top Header Bar */}
      <YouTubeDownloaderHeaderBar
        hasVideo={Boolean(video)}
        onPasteFromClipboard={handlePasteFromClipboard}
        onReset={handleReset}
      />

      {/* URL Input Bar & Instant Chips */}
      <YouTubeDownloaderUrlInput
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

      {/* Preview Card & Format Selectors */}
      {video && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <YouTubeDownloaderPreviewCard video={video} />
          <YouTubeDownloaderFormatSelector video={video} />
        </div>
      )}

      {/* Feature & Security Tips */}
      <div className="max-w-4xl mx-auto w-full mt-2">
        <YouTubeDownloaderTips />
      </div>
    </div>
  );
}
