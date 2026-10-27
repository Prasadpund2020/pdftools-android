"use client";

import React, { useRef, useState } from "react";

interface PdfToJpgDropzoneProps {
  onPdfSelected: (file: File) => void;
  onLoadSample: () => void;
}

export default function PdfToJpgDropzone({
  onPdfSelected,
  onLoadSample,
}: PdfToJpgDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);

    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };

  const validateAndSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMsg("Please select a valid PDF document (.pdf).");
      return;
    }
    onPdfSelected(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelect(file);
      e.target.value = "";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 border-2 border-dashed ${
        isDragging
          ? "border-orange-500 bg-orange-50/70 scale-[1.01] shadow-xl"
          : "border-stone-300 bg-white hover:border-orange-400 hover:bg-stone-50/50 shadow-md"
      }`}
    >
      <div className="flex flex-col items-center max-w-xl mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
          Upload PDF Document to Convert to JPG
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed mb-6">
          Drag and drop your PDF catalog, magazine, or document here to inspect individual pages and convert them into high-DPI JPG or PNG images.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center mb-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-lg shadow-orange-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Select PDF File</span>
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Try Sample Catalog (8 Pages)</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        {errorMsg && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-stone-200 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5 text-orange-900 font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            100% Client-Side WebAssembly
          </span>
          <span className="flex items-center gap-1.5">
            <span>🔒 Zero Server Uploads</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>⚡ Up to 600 DPI Master Print</span>
          </span>
        </div>
      </div>
    </div>
  );
}
