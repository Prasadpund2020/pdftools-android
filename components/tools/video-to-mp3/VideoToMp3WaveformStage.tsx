"use client";

import React, { useRef, useState, useMemo } from "react";
import { VideoMetadata } from "./types";
import {
  generateWaveformBars,
  formatTimeSeconds,
  parseTimeString,
} from "./sampleMedia";

interface VideoToMp3WaveformStageProps {
  videoMeta: VideoMetadata;
  startTimeSec: number;
  endTimeSec: number;
  onTimeRangeChange: (start: number, end: number) => void;
  onResetRange: () => void;
  onChangeMedia: (file: File) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTimeSec: number;
  onSeek: (seconds: number) => void;
}

export default function VideoToMp3WaveformStage({
  videoMeta,
  startTimeSec,
  endTimeSec,
  onTimeRangeChange,
  onResetRange,
  onChangeMedia,
  isPlaying,
  onTogglePlay,
  currentTimeSec,
  onSeek,
}: VideoToMp3WaveformStageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const [startInputVal, setStartInputVal] = useState(formatTimeSeconds(startTimeSec));
  const [endInputVal, setEndInputVal] = useState(formatTimeSeconds(endTimeSec));

  const waveformBars = useMemo(() => generateWaveformBars(), []);

  const totalDuration = videoMeta.durationSeconds || 1455;
  const startPercent = Math.max(0, Math.min(100, (startTimeSec / totalDuration) * 100));
  const endPercent = Math.max(0, Math.min(100, (endTimeSec / totalDuration) * 100));
  const playheadPercent = Math.max(0, Math.min(100, (currentTimeSec / totalDuration) * 100));

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = ratio * totalDuration;
    onSeek(targetSec);
  };

  const handleStartBlur = () => {
    const sec = parseTimeString(startInputVal);
    const clamped = Math.max(0, Math.min(sec, endTimeSec - 1));
    onTimeRangeChange(clamped, endTimeSec);
    setStartInputVal(formatTimeSeconds(clamped));
  };

  const handleEndBlur = () => {
    const sec = parseTimeString(endInputVal);
    const clamped = Math.max(startTimeSec + 1, Math.min(sec, totalDuration));
    onTimeRangeChange(startTimeSec, clamped);
    setEndInputVal(formatTimeSeconds(clamped));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChangeMedia(file);
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_12px_36px_-8px_rgba(41,37,36,0.08),0_4px_12px_-2px_rgba(41,37,36,0.04)] relative overflow-hidden border border-stone-200/90">
      {/* Subtle Top Specular Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c084fc]/50 to-transparent" />

      {/* Video / Audio Meta Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-4 min-w-0">
          {/* Squishy Video Stamp */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(168,85,247,0.15)]">
            <svg className="w-7 h-7 text-[#7e22ce]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-stone-900 truncate max-w-[200px] sm:max-w-md">
                {videoMeta.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#faf5ff] text-[#7e22ce] border border-[#e9d5ff]">
                {videoMeta.resolution} {videoMeta.fps}fps
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs text-stone-500 font-medium mt-0.5 flex-wrap">
              <span>{videoMeta.formattedSize}</span>
              <span className="text-stone-300">•</span>
              <span>Duration: {videoMeta.formattedDuration}</span>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Ready for demux
              </span>
            </div>
          </div>
        </div>

        {/* Change file button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="self-start sm:self-center px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-stone-200/60"
        >
          <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span>Change Media</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*,.mp4,.mkv,.mov,.webm"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Video Scrub Preview & Waveform Stage Deck */}
      <div className="mt-5 bg-stone-50 rounded-2xl p-4 sm:p-5 shadow-[inset_0_2px_6px_rgba(41,37,36,0.06)] border border-stone-200/60 flex flex-col gap-4">
        {/* Track Spectrum Label & Time Readout */}
        <div className="flex justify-between items-center text-xs font-bold text-stone-600">
          <span className="flex items-center gap-1.5 text-stone-700">
            <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
              />
            </svg>
            <span>Audio Track Spectrum</span>
          </span>
          <span className="font-mono text-stone-900 font-bold bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
            {formatTimeSeconds(currentTimeSec)} / {videoMeta.formattedDuration}
          </span>
        </div>

        {/* Waveform Visualizer SVG Graphic */}
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          className="relative w-full h-24 bg-stone-200/70 rounded-xl overflow-hidden flex items-center px-2 cursor-pointer group select-none shadow-inner"
        >
          {/* Time Range Trimmer Selection Bracket Visual */}
          <div
            className="absolute inset-y-1 bg-[#a855f7]/15 rounded-lg pointer-events-none border border-[#9333ea]/30 transition-all"
            style={{
              left: `${startPercent}%`,
              width: `${Math.max(2, endPercent - startPercent)}%`,
            }}
          >
            {/* Left Bracket Handle */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#9333ea] rounded-l-md shadow-[0_0_8px_rgba(147,51,234,0.5)] flex items-center justify-center">
              <span className="w-0.5 h-4 bg-white/90 rounded-full" />
            </div>
            {/* Right Bracket Handle */}
            <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#9333ea] rounded-r-md shadow-[0_0_8px_rgba(147,51,234,0.5)] flex items-center justify-center">
              <span className="w-0.5 h-4 bg-white/90 rounded-full" />
            </div>
          </div>

          {/* Playhead Indicator Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-orange-500 shadow-[0_0_6px_rgba(253,118,26,0.8)] z-10 flex flex-col items-center pointer-events-none transition-all duration-75"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="w-3.5 h-3.5 bg-orange-500 rounded-full -mt-0.5 shadow-sm" />
          </div>

          {/* Waveform Bars */}
          <div className="w-full h-16 flex items-center justify-between gap-0.5 pointer-events-none px-1">
            {waveformBars.map((heightFactor, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-[#a855f7]/80 group-hover:bg-[#9333ea] transition-all"
                style={{
                  height: `${heightFactor * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Trimming Range Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Audition Player */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTogglePlay}
              className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center text-stone-800 transition-all shadow-xs border border-stone-200 cursor-pointer"
              title={isPlaying ? "Pause snippet" : "Play snippet audition"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-[#9333ea]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#9333ea]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <span className="text-xs font-semibold text-stone-600">
              {isPlaying ? "Auditioning track snippet..." : "Audition snippet"}
            </span>
          </div>

          {/* Start / End Range Inputs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl shadow-inner border border-stone-200/80 text-xs">
              <span className="text-stone-400 font-bold uppercase text-[10px]">Start:</span>
              <input
                type="text"
                value={startInputVal}
                onChange={(e) => setStartInputVal(e.target.value)}
                onBlur={handleStartBlur}
                className="w-16 bg-transparent text-stone-900 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl shadow-inner border border-stone-200/80 text-xs">
              <span className="text-stone-400 font-bold uppercase text-[10px]">End:</span>
              <input
                type="text"
                value={endInputVal}
                onChange={(e) => setEndInputVal(e.target.value)}
                onBlur={handleEndBlur}
                className="w-16 bg-transparent text-stone-900 font-mono font-bold focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={onResetRange}
              className="text-xs font-bold text-[#9333ea] hover:text-[#7e22ce] hover:underline cursor-pointer"
            >
              Reset Full Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
