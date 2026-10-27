"use client";

import React from "react";
import { MergeResult } from "./types";
import { formatBytes } from "./pdfMergeEngine";

interface PdfMergeSuccessModalProps {
  result: MergeResult;
  onReset: () => void;
}

export default function PdfMergeSuccessModal({
  result,
  onReset,
}: PdfMergeSuccessModalProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.downloadUrl;
    link.download = result.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPreview = () => {
    window.open(result.downloadUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-10 rounded-3xl bg-white shadow-xl border border-stone-200 max-w-xl mx-auto w-full my-6">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm border border-emerald-100 animate-bounce">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">
        PDFs Merged Successfully!
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6">
        Combined {result.fileCount} documents into a single unified file.
      </p>

      {/* File Info Card */}
      <div className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200/80 mb-6 flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">File Name:</span>
          <span className="text-xs font-mono font-bold text-slate-800 truncate max-w-[280px]">
            {result.fileName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Pages:</span>
          <span className="text-xs font-bold text-blue-600">
            {result.totalPages} pages
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Output Size:</span>
          <span className="text-xs font-bold text-slate-700">
            {formatBytes(result.sizeBytes)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_20px_-4px_rgba(37,99,235,0.35)] transition-all active:scale-[0.99] cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download Merged PDF</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>Open Preview</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Merge Another</span>
          </button>
        </div>
      </div>
    </div>
  );
}
