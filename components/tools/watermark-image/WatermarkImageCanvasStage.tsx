"use client";

import React from "react";
import type { WatermarkSourceMeta, WatermarkOptions, WatermarkResult } from "./types";
import { formatBytes } from "./watermarkImageEngine";

interface WatermarkImageCanvasStageProps {
  source: WatermarkSourceMeta;
  options: WatermarkOptions;
  result: WatermarkResult | null;
  isProcessing: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
}

export default function WatermarkImageCanvasStage({
  source,
  options,
  result,
  isProcessing,
  zoom,
  onZoomChange,
  onResetZoom,
}: WatermarkImageCanvasStageProps) {
  const displayUrl = result?.dataUrl || source.dataUrl;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[460px] md:min-h-[560px] p-4 md:p-8 bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden select-none">
      {/* Subtle Grid backdrop */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating Viewport Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl">
        <button
          type="button"
          onClick={() => onZoomChange(Math.max(0.2, zoom - 0.1))}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span className="text-xs font-mono font-medium text-slate-300 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
        <div className="w-px h-3.5 bg-slate-700 mx-1" />
        <button
          type="button"
          onClick={onResetZoom}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset zoom"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Mode Tag */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 shadow-xl">
        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>
          {options.type === "text"
            ? `Text: "${options.text.slice(0, 18)}${options.text.length > 18 ? "…" : ""}"`
            : "Brand Logo"}
        </span>
        {isProcessing && (
          <span className="flex h-2 w-2 relative ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
        )}
      </div>

      {/* Image Preview with Zoom */}
      <div
        className="relative z-10 max-w-full max-h-[500px] flex items-center justify-center transition-transform duration-100 ease-out shadow-2xl rounded-xl overflow-hidden border border-slate-700/50 bg-black/40"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayUrl}
          alt={source.name}
          className="max-w-full max-h-[460px] object-contain rounded-lg"
        />
      </div>

      {/* Footer metadata info */}
      <div className="absolute bottom-3 left-4 z-20 text-[11px] font-mono text-slate-400 flex items-center gap-3">
        <span>{source.name}</span>
        <span>•</span>
        <span>
          {source.originalWidth} × {source.originalHeight} px
        </span>
        <span>•</span>
        <span>{formatBytes(result?.sizeBytes || source.originalSizeBytes)}</span>
      </div>
    </div>
  );
}
