"use client";

import React from "react";
import Link from "next/link";
import { DocumentInfo } from "./types";

interface SignPdfHeaderProps {
  doc: DocumentInfo | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUploadPdf: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function SignPdfHeader({
  doc,
  fileInputRef,
  onUploadPdf,
  onReset,
}: SignPdfHeaderProps) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Tool Name & Document Pellet */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              href="/all-tools/pdf"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
              title="Back to PDF Tools"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
              Sign PDF Document
            </h1>
          </div>

          {/* Active Document Pellet */}
          {doc && (
            <div className="flex items-center gap-2 bg-stone-100/90 border border-stone-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              <span className="text-xs font-bold text-stone-800 max-w-[180px] sm:max-w-[240px] truncate">
                {doc.fileName}
              </span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-xs text-stone-500 font-medium">
                {doc.pageCount} {doc.pageCount === 1 ? "Page" : "Pages"}
              </span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold flex items-center gap-1 ml-1 transition-colors cursor-pointer"
                title="Upload another PDF to sign"
              >
                <span>Upload New PDF</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={onUploadPdf}
              />
            </div>
          )}
        </div>

        {/* Right: Security & Quick Action Pills */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% In-Browser E-Sign</span>
          </div>

          {doc && (
            <button
              type="button"
              onClick={onReset}
              className="h-8 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
