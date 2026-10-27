"use client";

import React, { useRef } from "react";

interface PdfMergeHeaderBarProps {
  fileCount: number;
  totalPageCount: number;
  onAddFiles: (files: FileList) => void;
  onClear: () => void;
  isMerging: boolean;
}

export default function PdfMergeHeaderBar({
  fileCount,
  totalPageCount,
  onAddFiles,
  onClear,
  isMerging,
}: PdfMergeHeaderBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl shadow-xs border border-stone-200/80 backdrop-blur-xs">
      <div className="flex items-center gap-3.5 flex-wrap min-w-0">
        {/* Tool Badge */}
        <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
          PDF Merge
        </span>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Combine PDF Documents
        </h1>

        {/* Total Count Chips */}
        {fileCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-blue-900 text-xs font-semibold">
            <span>{fileCount} {fileCount === 1 ? "document" : "documents"}</span>
            <span className="text-blue-300">•</span>
            <span>{totalPageCount} total {totalPageCount === 1 ? "page" : "pages"}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isMerging}
          className="cursor-pointer px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 border border-blue-200 active:scale-95"
        >
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add More PDFs</span>
        </button>

        {fileCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            disabled={isMerging}
            title="Clear all documents"
            className="px-3 py-1.5 sm:py-2 rounded-full bg-white text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs font-semibold shadow-xs border border-stone-200 active:scale-95"
          >
            Clear All
          </button>
        )}
      </div>
    </header>
  );
}
