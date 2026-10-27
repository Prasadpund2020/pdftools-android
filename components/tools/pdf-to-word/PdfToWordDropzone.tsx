"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface PdfToWordDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function PdfToWordDropzone({
  onFileSelect,
  isLoading = false,
}: PdfToWordDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setValidationError(null);
    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      setValidationError("Only PDF files are supported.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setValidationError("File exceeds 50 MB limit.");
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative flex flex-col items-center justify-center gap-4 min-h-[320px] rounded-3xl border-2 border-dashed transition-all duration-200 cursor-default select-none px-8 py-12",
          isDragging
            ? "border-rose-500 bg-rose-50 scale-[1.01]"
            : "border-rose-300 bg-rose-50/40 hover:border-rose-400 hover:bg-rose-50/60",
        ].join(" ")}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <span className="w-10 h-10 border-[3px] border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-rose-600">Reading PDF…</span>
          </div>
        ) : (
          <>
            {/* Upload Icon */}
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-100 border border-rose-200 shadow-sm">
              <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">Drop your PDF here</p>
              <p className="text-sm text-slate-500 mt-1">or select a file from your device</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full max-w-[240px]">
              <div className="flex-1 h-px bg-rose-200" />
              <span className="text-xs font-medium text-rose-400">or</span>
              <div className="flex-1 h-px bg-rose-200" />
            </div>

            {/* Browse Button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white text-sm font-semibold shadow hover:from-rose-700 hover:to-red-800 active:scale-95 transition-all duration-150"
            >
              Browse Files
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Validation error */}
            {validationError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                ⚠ {validationError}
              </p>
            )}

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {["🔒 Zero uploads", "⚡ Up to 50 MB", "📄 PDF Only"].map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-medium text-rose-600 bg-rose-100 rounded-full px-3 py-1 border border-rose-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
