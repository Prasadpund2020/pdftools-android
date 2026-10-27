"use client";

import React from "react";
import { TwitterMediaMetadata } from "./types";

interface TwitterMediaPreviewCardProps {
  tweet: TwitterMediaMetadata;
}

export default function TwitterMediaPreviewCard({ tweet }: TwitterMediaPreviewCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-white/95 border border-stone-200/80 shadow-xs">
      {/* 16:9 Landscape Video Thumbnail */}
      <div className="relative w-full sm:w-72 sm:min-w-[280px] h-44 rounded-2xl overflow-hidden bg-stone-900 shrink-0 group mx-auto sm:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tweet.thumbnail}
          alt={tweet.tweetText}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-xs font-bold backdrop-blur-xs">
          {tweet.duration}
        </span>

        <a
          href={tweet.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </a>
      </div>

      {/* Meta Details */}
      <div className="flex flex-col justify-between py-1 min-w-0 flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tweet.authorAvatar}
              alt={tweet.authorUsername}
              className="w-10 h-10 rounded-full object-cover border border-stone-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">
                  {tweet.authorDisplayName}
                </span>
                {tweet.isVerified && (
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-stone-500">@{tweet.authorUsername}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3">
            {tweet.tweetText}
          </p>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {tweet.likesCount}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {tweet.retweetsCount}
            </span>
            <span>• {tweet.date}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-3">
          <a
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
          >
            <span>View on X (Twitter)</span>
            <span>↗</span>
          </a>

          <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Original MP4
          </span>
        </div>
      </div>
    </div>
  );
}
