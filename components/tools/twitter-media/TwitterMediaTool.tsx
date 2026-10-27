"use client";

import React, { useState } from "react";
import TwitterMediaHeaderBar from "./TwitterMediaHeaderBar";
import TwitterMediaUrlInput from "./TwitterMediaUrlInput";
import TwitterMediaPreviewCard from "./TwitterMediaPreviewCard";
import TwitterMediaFormatSelector from "./TwitterMediaFormatSelector";
import TwitterMediaTips from "./TwitterMediaTips";
import { SAMPLE_TWEETS } from "./sampleTweets";
import { TwitterMediaMetadata } from "./types";
import { resolveTwitterMedia } from "./twitterEngine";

export default function TwitterMediaTool() {
  const defaultTweet = SAMPLE_TWEETS[0];
  const [url, setUrl] = useState(defaultTweet.url);
  const [tweet, setTweet] = useState<TwitterMediaMetadata | null>(defaultTweet);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFetchTweet = async (inputUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const resolved = await resolveTwitterMedia(inputUrl);
      setTweet(resolved);
      setUrl(resolved.url);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not fetch Twitter video. Please verify the link format.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: TwitterMediaMetadata) => {
    setUrl(sample.url);
    setTweet(sample);
    setErrorMessage(null);
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          handleFetchTweet(text);
        }
      }
    } catch {
      setErrorMessage("Could not read clipboard. Please paste manually into the input box.");
    }
  };

  const handleReset = () => {
    setUrl("");
    setTweet(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <TwitterMediaHeaderBar
        hasVideo={Boolean(tweet)}
        onPasteFromClipboard={handlePasteFromClipboard}
        onReset={handleReset}
      />

      <TwitterMediaUrlInput
        url={url}
        onChangeUrl={setUrl}
        onSubmit={handleFetchTweet}
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

      {tweet && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <TwitterMediaPreviewCard tweet={tweet} />
          <TwitterMediaFormatSelector tweet={tweet} />
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full mt-2">
        <TwitterMediaTips />
      </div>
    </div>
  );
}
