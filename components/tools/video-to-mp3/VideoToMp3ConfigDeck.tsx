"use client";

import React from "react";
import { AudioFormat, AudioBitrate, GainMode } from "./types";

interface VideoToMp3ConfigDeckProps {
  format: AudioFormat;
  onFormatChange: (fmt: AudioFormat) => void;
  bitrate: AudioBitrate;
  onBitrateChange: (br: AudioBitrate) => void;
  gain: GainMode;
  onGainChange: (gain: GainMode) => void;
  title: string;
  onTitleChange: (val: string) => void;
  artist: string;
  onArtistChange: (val: string) => void;
  album: string;
  onAlbumChange: (val: string) => void;
}

export default function VideoToMp3ConfigDeck({
  format,
  onFormatChange,
  bitrate,
  onBitrateChange,
  gain,
  onGainChange,
  title,
  onTitleChange,
  artist,
  onArtistChange,
  album,
  onAlbumChange,
}: VideoToMp3ConfigDeckProps) {
  const formats: { id: AudioFormat; label: string; sub: string }[] = [
    { id: "mp3", label: "MP3", sub: "MPEG-1" },
    { id: "wav", label: "WAV", sub: "Lossless" },
    { id: "aac", label: "AAC", sub: "Apple" },
    { id: "flac", label: "FLAC", sub: "Hi-Res" },
    { id: "m4a", label: "M4A", sub: "Podcast" },
  ];

  const bitrates: { id: AudioBitrate; label: string; sub: string }[] = [
    { id: "320", label: "320 kbps", sub: "Extreme Studio" },
    { id: "256", label: "256 kbps", sub: "Balanced HQ" },
    { id: "128", label: "128 kbps", sub: "Speech / Voice" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Audio Extraction Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Output Format Selector Tiles */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Output Format Container</span>
          </label>

          <div className="grid grid-cols-5 gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200/60">
            {formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFormatChange(f.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl font-bold transition-all cursor-pointer ${
                  format === f.id
                    ? "bg-[#f3e8ff] text-[#6b21a8] shadow-sm border border-[#d8b4fe]"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                }`}
              >
                <span className="text-xs sm:text-sm font-extrabold">{f.label}</span>
                <span className="text-[10px] uppercase font-semibold opacity-80">{f.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Bitrate Quality Clay Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Audio Fidelity (Bitrate)</span>
            </label>
            <span className="text-xs text-[#7e22ce] font-bold">CBR Mode</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {bitrates.map((b) => (
              <div
                key={b.id}
                onClick={() => onBitrateChange(b.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  bitrate === b.id
                    ? "bg-[#faf5ff] border-[#c084fc] shadow-xs"
                    : "bg-stone-50 border-stone-200/70 hover:bg-stone-100 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-stone-900">{b.label}</span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      bitrate === b.id ? "bg-[#9333ea] shadow-sm" : "bg-stone-300"
                    }`}
                  />
                </div>
                <span className="text-[11px] text-stone-500 mt-1 font-medium">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Volume Boost & Master Normalization Section */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-800 shadow-2xs border border-stone-200/60 shrink-0">
            <svg className="w-5 h-5 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-stone-900 block">
              Acoustic Gain &amp; Normalization
            </span>
            <span className="text-xs text-stone-500">
              Clean decibel boosting with peak limiting
            </span>
          </div>
        </div>

        {/* Gain Pill Switcher */}
        <div className="flex items-center bg-stone-200/70 p-1 rounded-full shadow-inner">
          {(["0dB", "+3dB", "EBU_R128"] as GainMode[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGainChange(g)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                gain === g
                  ? "bg-white text-[#7e22ce] shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {g === "EBU_R128" ? "EBU R128" : g}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ID3 Metadata Editor Form */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>ID3 Tag Embedder</span>
          </span>
          <span className="text-xs text-stone-400 font-semibold">Optional track tags</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Track / Song Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Keynote Address"
              className="px-3.5 py-2 rounded-xl bg-stone-50 text-stone-900 text-xs sm:text-sm font-medium border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c084fc] shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Artist / Speaker
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => onArtistChange(e.target.value)}
              placeholder="e.g. Dr. Elena Rostova"
              className="px-3.5 py-2 rounded-xl bg-stone-50 text-stone-900 text-xs sm:text-sm font-medium border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c084fc] shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Album / Summit
            </label>
            <input
              type="text"
              value={album}
              onChange={(e) => onAlbumChange(e.target.value)}
              placeholder="e.g. Global Tech Summit 2025"
              className="px-3.5 py-2 rounded-xl bg-stone-50 text-stone-900 text-xs sm:text-sm font-medium border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c084fc] shadow-inner"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
