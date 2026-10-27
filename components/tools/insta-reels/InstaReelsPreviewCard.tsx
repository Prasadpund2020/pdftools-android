"use client";

import React from "react";
import { InstagramReelMetadata } from "./types";

interface InstaReelsPreviewCardProps {
  reel: InstagramReelMetadata;
}

export default function InstaReelsPreviewCard({ reel }: InstaReelsPreviewCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-white/95 border border-stone-200/80 shadow-xs">
      {/* 9:16 Vertical Reel Thumbnail */}
      <div className="relative w-full sm:w-52 sm:min-w-[208px] h-72 rounded-2xl overflow-hidden bg-stone-900 shrink-0 group mx-auto sm:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reel.thumbnail}
          alt={reel.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-xs font-bold backdrop-blur-xs">
          {reel.duration}
        </span>

        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </a>
      </div>

      {/* Reel Meta Details */}
      <div className="flex flex-col justify-between py-1 min-w-0 flex-1">
        <div className="flex flex-col gap-3">
          {/* Creator Profile */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={reel.authorAvatar}
              alt={reel.authorUsername}
              className="w-10 h-10 rounded-full object-cover border border-pink-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">
                  @{reel.authorUsername}
                </span>
                {reel.isVerified && (
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-stone-500">{reel.authorDisplayName}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3">
            {reel.caption}
          </p>

          {/* Audio Track Chip */}
          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full text-xs text-stone-700 font-medium truncate max-w-md">
            <svg className="w-3.5 h-3.5 text-pink-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="truncate">{reel.audioTrackName}</span>
          </div>

          {/* Social Stats */}
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {reel.likesCount}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {reel.commentsCount}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-3">
          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors"
          >
            <span>View on Instagram</span>
            <span>↗</span>
          </a>

          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Zero Watermark
          </span>
        </div>
      </div>
    </div>
  );
}
