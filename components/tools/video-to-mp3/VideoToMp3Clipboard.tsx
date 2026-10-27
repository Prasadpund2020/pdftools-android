"use client";

import React from "react";
import Link from "next/link";

export default function VideoToMp3Clipboard() {
  const quickTools = [
    {
      id: "video-to-mp3",
      title: "Video to MP3",
      subtitle: "Active Extraction Workspace",
      href: "/all-tools/video-audio/video-to-mp3",
      isActive: true,
      iconSvg: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
      iconBg: "bg-gradient-to-br from-[#c084fc] to-[#9333ea]",
    },
    {
      id: "youtube-downloader",
      title: "Video Downloader",
      subtitle: "Fetch from direct link",
      href: "/all-tools/downloaders/youtube-downloader",
      isActive: false,
      iconSvg: (
        <svg className="w-5 h-5 text-[#854d0e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
      iconBg: "bg-[#fef08a]",
    },
    {
      id: "audio-cutter",
      title: "Audio Trimmer",
      subtitle: "Split ringtones & stems",
      href: "/all-tools/video-audio/audio-cutter",
      isActive: false,
      iconSvg: (
        <svg className="w-5 h-5 text-[#9a3412]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.242 3 3 0 004.243 4.242z"
          />
        </svg>
      ),
      iconBg: "bg-[#fed7aa]",
    },
    {
      id: "compress-video",
      title: "Compress Video",
      subtitle: "Reduce size up to 80%",
      href: "/all-tools/video-audio/compress-video",
      isActive: false,
      iconSvg: (
        <svg className="w-5 h-5 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      ),
      iconBg: "bg-[#bbf7d0]",
    },
    {
      id: "speech-to-text",
      title: "Audio Transcriber",
      subtitle: "Auto subtitle .SRT file",
      href: "/all-tools/video-audio/speech-to-text",
      isActive: false,
      iconSvg: (
        <svg className="w-5 h-5 text-[#0369a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      iconBg: "bg-[#e0f2fe]",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Physical Clipboard Container */}
      <div className="relative pt-6">
        {/* Tactile Metal Clip Accent At Top Center */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 rounded-t-lg rounded-b-xs bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b] shadow-[0_4px_8px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center z-10 border-t border-white">
          <div className="w-14 h-1.5 rounded-full bg-[#334155] shadow-inner" />
        </div>

        {/* Paper Surface */}
        <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_-10px_rgba(41,37,36,0.12),0_4px_16px_-2px_rgba(41,37,36,0.06)] border border-stone-200/90 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-[#9333ea] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                Audio &amp; Video Station
              </h2>
            </div>
            <span className="text-[10px] uppercase font-bold text-stone-500 px-2 py-0.5 rounded-full bg-stone-100">
              Quick Tray
            </span>
          </div>

          {/* Quick Tools Interactive List */}
          <div className="flex flex-col gap-2">
            {quickTools.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className={`p-2.5 rounded-2xl flex items-center justify-between transition-all group ${
                  t.isActive
                    ? "bg-[#faf5ff] text-[#581c87] shadow-[0_2px_8px_rgba(168,85,247,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-[#e9d5ff]"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl ${t.iconBg} flex items-center justify-center shadow-xs shrink-0`}
                  >
                    {t.iconSvg}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold truncate">{t.title}</span>
                    <span className="text-[11px] text-stone-500 truncate">{t.subtitle}</span>
                  </div>
                </div>

                <svg
                  className="w-4 h-4 text-stone-400 group-hover:text-[#9333ea] group-hover:translate-x-0.5 transition-all shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Bottom Micro Status Strip */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Audio engine: FFmpeg 6.1 WASM</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Miniature Client-Side Security Tile */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
            Memory Isolation
          </div>
          <div className="text-xs text-stone-500 truncate">
            Temporary audio vectors purged on exit
          </div>
        </div>
      </div>
    </div>
  );
}
