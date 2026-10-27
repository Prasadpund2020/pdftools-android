"use client";

import React from "react";
import { TikTokMetadata } from "./types";

interface TikTokSaverPreviewCardProps {
  video: TikTokMetadata;
}

export default function TikTokSaverPreviewCard({ video }: TikTokSaverPreviewCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-white/95 border border-stone-200/80 shadow-xs">
      {/* 9:16 Vertical Video Thumbnail */}
      <div className="relative w-full sm:w-52 sm:min-w-[208px] h-72 rounded-2xl overflow-hidden bg-stone-900 shrink-0 group mx-auto sm:mx-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-xs font-bold backdrop-blur-xs">
          {video.duration}
        </span>

        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg">
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
              src={video.authorAvatar}
              alt={video.authorUsername}
              className="w-10 h-10 rounded-full object-cover border border-cyan-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">
                  @{video.authorUsername}
                </span>
                {video.isVerified && (
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-stone-500">{video.authorNickname}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3">
            {video.caption}
          </p>

          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full text-xs text-stone-700 font-medium truncate max-w-md">
            <svg className="w-3.5 h-3.5 text-cyan-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="truncate">{video.musicTitle} • {video.musicAuthor}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              {video.playCount}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {video.likesCount}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {video.sharesCount}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-3">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1.5 transition-colors"
          >
            <span>View on TikTok</span>
            <span>↗</span>
          </a>

          <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
            Watermark Removed
          </span>
        </div>
      </div>
    </div>
  );
}
