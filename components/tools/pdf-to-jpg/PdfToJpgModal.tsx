"use client";

import React, { useEffect } from "react";
import { ProofPage } from "./types";

interface PdfToJpgModalProps {
  page: ProofPage | null;
  onClose: () => void;
  onDownloadPage: (page: ProofPage) => void;
}

export default function PdfToJpgModal({
  page,
  onClose,
  onDownloadPage,
}: PdfToJpgModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!page) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-900/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 border border-stone-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
              {page.pageNumber}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {page.label} Preview Inspector
            </h3>
            {page.badgeLabel && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {page.badgeLabel}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Image Stage */}
        <div className="relative w-full aspect-[3/4] max-h-[65vh] rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.previewUrl}
            alt={page.label}
            className="max-w-full max-h-full object-contain pointer-events-none"
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs text-stone-500 font-medium">
            High-fidelity client raster • {page.sizeFormatted}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onDownloadPage(page)}
              className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download This Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
