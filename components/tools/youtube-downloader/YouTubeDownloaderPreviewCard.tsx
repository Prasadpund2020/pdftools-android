"use client";

import React from "react";
import { YouTubeVideoMetadata } from "./types";

interface YouTubeDownloaderPreviewCardProps {
  video: YouTubeVideoMetadata;
}

export default function YouTubeDownloaderPreviewCard({
  video,
}: YouTubeDownloaderPreviewCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-white/95 border border-stone-200/80 shadow-xs">
      {/* Thumbnail with duration overlay */}
      <div className="relative w-full sm:w-72 sm:min-w-[280px] h-44 rounded-2xl overflow-hidden bg-stone-900 shrink-0 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration badge */}
        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-xs font-bold backdrop-blur-xs">
          {video.duration}
        </span>

        {/* Play button overlay */}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </a>
      </div>

      {/* Video Details */}
      <div className="flex flex-col justify-between py-0.5 min-w-0">
        <div className="flex flex-col gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-snug line-clamp-2">
            {video.title}
          </h2>

          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600">
            <span className="font-semibold text-slate-900 flex items-center gap-1">
              {video.channelTitle}
              <svg
                className="w-3.5 h-3.5 text-blue-500 inline"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
            {video.channelSubscribers && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500">{video.channelSubscribers}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{video.viewCount}</span>
            <span className="text-stone-300">•</span>
            <span>Uploaded {video.uploadDate}</span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Watch Link */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Watch Original on YouTube</span>
          </a>

          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            No Watermark
          </span>
        </div>
      </div>
    </div>
  );
}
