"use client";

import React, { useState } from "react";
import { TwitterDownloadTab, TwitterMediaMetadata } from "./types";
import { downloadTwitterStream } from "./twitterEngine";

interface TwitterMediaFormatSelectorProps {
  tweet: TwitterMediaMetadata;
}

export default function TwitterMediaFormatSelector({ tweet }: TwitterMediaFormatSelectorProps) {
  const [activeTab, setActiveTab] = useState<TwitterDownloadTab>("video");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (quality: string, extension: string, id: string) => {
    setDownloadingId(id);
    try {
      await downloadTwitterStream(tweet.authorUsername, tweet.statusId, quality, extension);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-3xl bg-white/95 border border-stone-200/80 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "video" ? "bg-white text-slate-900 shadow-xs" : "text-stone-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Video (MP4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gif")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "gif" ? "bg-white text-slate-900 shadow-xs" : "text-stone-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Animated GIF</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "audio" ? "bg-white text-slate-900 shadow-xs" : "text-stone-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span>Audio (MP3)</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
          Progressive Bitrate Parsing
        </span>
      </div>

      {activeTab === "video" && (
        <div className="flex flex-col gap-2.5">
          {tweet.videoFormats.map((fmt, idx) => {
            const isDownloading = downloadingId === `video-${idx}`;
            return (
              <div
                key={fmt.quality}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                    MP4
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{fmt.quality}</span>
                      {fmt.isRecommended && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                          Best Clarity
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span>{fmt.resolution}</span>
                      <span className="text-stone-300">•</span>
                      <span>{fmt.fps} FPS</span>
                      <span className="text-stone-300">•</span>
                      <span>{fmt.bitrate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">
                    ~{fmt.fileSize}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(fmt.quality, fmt.extension, `video-${idx}`)}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download MP4</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "gif" && (
        <div className="flex flex-col gap-2.5">
          {tweet.gifFormats.map((fmt, idx) => {
            const isDownloading = downloadingId === `gif-${idx}`;
            return (
              <div
                key={fmt.quality}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                    GIF
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{fmt.quality}</span>
                    <span className="text-xs text-stone-500 mt-0.5">{fmt.resolution} • Endless Loop</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">
                    ~{fmt.fileSize}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(fmt.quality, fmt.extension, `gif-${idx}`)}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Converting…</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download GIF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "audio" && (
        <div className="flex flex-col gap-2.5">
          {tweet.audioFormats.map((fmt, idx) => {
            const isDownloading = downloadingId === `audio-${idx}`;
            return (
              <div
                key={fmt.quality}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-purple-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                    MP3
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{fmt.quality}</span>
                    <span className="text-xs text-stone-500 mt-0.5">{fmt.bitrate} • Stereo Track</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">
                    ~{fmt.fileSize}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(fmt.quality, fmt.extension, `audio-${idx}`)}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download MP3</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
