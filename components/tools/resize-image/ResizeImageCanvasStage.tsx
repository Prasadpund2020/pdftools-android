"use client";

import React, { useState } from "react";
import { ImageSourceMeta, ResizedResult, ResizeOptions } from "./types";

interface ResizeImageCanvasStageProps {
  meta: ImageSourceMeta;
  options: ResizeOptions;
  result: ResizedResult | null;
  isProcessing: boolean;
}

export default function ResizeImageCanvasStage({
  meta,
  options,
  result,
  isProcessing,
}: ResizeImageCanvasStageProps) {
  const [zoom, setZoom] = useState<number>(1);

  return (
    <div className="relative w-full rounded-3xl bg-stone-900 border border-stone-800 shadow-xl overflow-hidden flex flex-col min-h-[460px] sm:min-h-[560px]">
      {/* Stage Toolbar */}
      <div className="px-4 py-3 bg-stone-950/80 border-b border-stone-800/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-xs font-bold text-stone-300">Live Viewport</span>
          <span className="text-[10px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
            {options.width} × {options.height} px
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-stone-900/90 rounded-xl p-1 border border-stone-800">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.2))}
            className="w-7 h-7 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <span className="text-[11px] font-mono text-stone-300 px-1.5 min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
            className="w-7 h-7 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="px-2 py-1 rounded-lg text-[10px] font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Checkerboard Background */}
      <div
        className="relative flex-1 flex items-center justify-center p-6 overflow-hidden select-none"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)",
          backgroundSize: "20px 20px",
          backgroundColor: "#09090b",
        }}
      >
        <div
          className="relative transition-transform duration-150 ease-out flex items-center justify-center shadow-2xl"
          style={{ transform: `scale(${zoom})` }}
        >
          {result?.dataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={result.dataUrl}
              alt="Resized Preview"
              className="max-h-[380px] sm:max-h-[460px] w-auto object-contain rounded-xl border border-stone-700/50"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={meta.dataUrl}
              alt="Original Preview"
              className="max-h-[380px] sm:max-h-[460px] w-auto object-contain rounded-xl border border-stone-700/50 opacity-80"
            />
          )}

          {/* Processing Spinner Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center gap-2">
              <span className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-sky-200">Re-interpolating pixels…</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="px-4 py-2.5 bg-stone-950 border-t border-stone-800/80 flex flex-wrap items-center justify-between text-stone-400 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">Source:</span>
          <span className="text-stone-300 font-bold font-mono">
            {meta.originalWidth} × {meta.originalHeight} px
          </span>
          <span className="text-stone-600">→</span>
          <span className="text-sky-400 font-bold font-mono">
            {options.width} × {options.height} px
          </span>
        </div>

        <div className="text-[11px] text-stone-500 font-mono">
          FileLab In-Browser Bilinear Filter
        </div>
      </div>
    </div>
  );
}
