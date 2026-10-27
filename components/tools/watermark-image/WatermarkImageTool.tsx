"use client";

import React, { useState, useEffect, useRef } from "react";
import type { WatermarkSourceMeta, WatermarkOptions, WatermarkResult } from "./types";
import {
  DEFAULT_WATERMARK_OPTIONS,
  generateWatermarkSampleImage,
  applyWatermark,
  downloadWatermarkedFile,
  formatBytes,
} from "./watermarkImageEngine";
import WatermarkImageHeaderBar from "./WatermarkImageHeaderBar";
import WatermarkImageDropzone from "./WatermarkImageDropzone";
import WatermarkImageCanvasStage from "./WatermarkImageCanvasStage";
import WatermarkImageControls from "./WatermarkImageControls";

export function WatermarkImageTool() {
  const [source, setSource] = useState<WatermarkSourceMeta | null>(null);
  const [options, setOptions] = useState<WatermarkOptions>(DEFAULT_WATERMARK_OPTIONS);
  const [zoom, setZoom] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debounce ref for live updates
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Re-render watermark when options or source change
  useEffect(() => {
    if (!source) {
      setResult(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsProcessing(true);
        const res = await applyWatermark(source, options);
        setResult(res);
        setErrorMessage(null);
      } catch (err) {
        console.error("Watermark processing failed:", err);
        setErrorMessage(err instanceof Error ? err.message : "Failed to apply watermark.");
      } finally {
        setIsProcessing(false);
      }
    }, 120);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [source, options]);

  // Handle uploaded file
  const handleImageSelected = (meta: WatermarkSourceMeta) => {
    setErrorMessage(null);
    setDownloadSuccess(false);
    setSource(meta);
    setZoom(1);
  };

  // Load interactive photography sample
  const handleLoadSample = () => {
    try {
      setErrorMessage(null);
      setDownloadSuccess(false);
      const sample = generateWatermarkSampleImage();
      setSource(sample);
      setZoom(1);
    } catch {
      setErrorMessage("Could not load sample preview.");
    }
  };

  // Reset tool state
  const handleReset = () => {
    setSource(null);
    setResult(null);
    setOptions(DEFAULT_WATERMARK_OPTIONS);
    setZoom(1);
    setDownloadSuccess(false);
    setErrorMessage(null);
  };

  // Download watermarked result
  const handleDownload = () => {
    if (!result) return;
    downloadWatermarkedFile(result, source?.name || "watermarked-image");
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <WatermarkImageHeaderBar
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        isProcessing={isProcessing}
      />

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs underline hover:text-red-300 ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace */}
      {!source ? (
        <div className="space-y-6">
          <WatermarkImageDropzone
            onImageSelected={handleImageSelected}
            onUseSample={handleLoadSample}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas Preview Area */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <WatermarkImageCanvasStage
              source={source}
              options={options}
              result={result}
              isProcessing={isProcessing}
              zoom={zoom}
              onZoomChange={setZoom}
              onResetZoom={() => setZoom(1)}
            />

            {/* Quick Result Summary Bar */}
            {result && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block">Resolution</span>
                    <span className="font-semibold text-slate-200">
                      {result.width} × {result.height} px
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Output Size</span>
                    <span className="font-semibold text-slate-200">
                      {formatBytes(result.sizeBytes)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Format</span>
                    <span className="font-semibold text-orange-400 uppercase">
                      {result.mimeType.replace("image/", "")}
                    </span>
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-300 hover:to-amber-400 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {downloadSuccess ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Watermarked Image</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Watermark Controls Area */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <WatermarkImageControls
                options={options}
                result={result}
                isProcessing={isProcessing}
                onOptionsChange={setOptions}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WatermarkImageTool;
