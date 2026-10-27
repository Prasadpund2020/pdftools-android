"use client";

import React, { useRef } from "react";
import { LoadedPdfInfo } from "./types";

interface PdfToJpgHeaderBarProps {
  pdfInfo: LoadedPdfInfo;
  onChangeFile: (file: File) => void;
}

export default function PdfToJpgHeaderBar({
  pdfInfo,
  onChangeFile,
}: PdfToJpgHeaderBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChangeFile(file);
      e.target.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Title & Eyebrow */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold uppercase tracking-wider shadow-2xs border border-orange-200/60">
            <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            PDF TO IMAGE
          </span>
          <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
            • High-Fidelity Rasterizer
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          PDF to JPG Converter
        </h1>
      </div>

      {/* Loaded File Badge Pill (Desk Station Metaphor) */}
      <div className="flex items-center gap-3 bg-stone-100/90 px-4 py-2.5 rounded-2xl shadow-xs border border-stone-200/80">
        <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-900 truncate max-w-[160px] sm:max-w-xs">
              {pdfInfo.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-black text-emerald-800">
              READY
            </span>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {pdfInfo.pageCount} Pages • {pdfInfo.formattedSize} • {pdfInfo.colorProfile}
          </span>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="ml-2 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-2xs border border-stone-200 flex items-center gap-1 cursor-pointer shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span>Change File</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
