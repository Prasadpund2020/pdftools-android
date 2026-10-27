"use client";

import React, { useRef, useState } from "react";

interface PdfMergeDropzoneProps {
  onFilesSelect: (files: FileList) => void;
  onLoadSamples: () => void;
  isLoadingSamples: boolean;
}

export default function PdfMergeDropzone({
  onFilesSelect,
  onLoadSamples,
  isLoadingSamples,
}: PdfMergeDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-8">
      {/* Interactive Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 bg-white/90 shadow-sm ${
          isDragOver
            ? "border-blue-500 bg-blue-50/60 scale-[1.01]"
            : "border-stone-300 hover:border-blue-500 hover:bg-stone-50/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Big tactile icon badge */}
        <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 shadow-md flex items-center justify-center text-blue-600 mb-5 group-hover:scale-105 transition-transform">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 tracking-tight">
          Drop multiple PDF files here, or{" "}
          <span className="text-blue-600 underline decoration-blue-300 underline-offset-4">
            browse files
          </span>
        </h3>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
          Combine reports, invoices, contracts, and scans in any order. 100% private in-browser merging with zero server uploads.
        </p>

        {/* Accepted Formats */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold font-mono tracking-wide border border-blue-100">
            .PDF
          </span>
          <span className="text-xs text-stone-400">Select multiple files at once</span>
        </div>
      </div>

      {/* Preset 1-Click Samples Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">
              Want to test the merger immediately?
            </span>
            <span className="text-[11px] text-slate-500">
              Generate 3 multi-page executive sample documents in memory.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLoadSamples}
          disabled={isLoadingSamples}
          className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
        >
          {isLoadingSamples ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Samples…</span>
            </>
          ) : (
            <>
              <span>Load 3 Sample PDFs</span>
              <span className="text-amber-400 font-bold">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
