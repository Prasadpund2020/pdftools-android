"use client";

import React, { useState, useRef } from "react";

interface DocumentUploaderProps {
  onFileUpload: (file: File) => void;
  onLoadSample: () => void;
  isProcessing?: boolean;
}

export default function DocumentUploader({
  onFileUpload,
  onLoadSample,
  isProcessing = false,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Please select a valid PDF document (.pdf).");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("File exceeds 50MB limit for browser-memory signing.");
      return;
    }

    onFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndProcessFile(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 border-2 border-dashed ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/70 scale-[1.01] shadow-xl"
            : "border-stone-300 bg-white/90 hover:border-emerald-500/60 hover:bg-stone-50/50 shadow-md"
        }`}
      >
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/40 via-transparent to-stone-50/20 pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
          {/* Animated PDF Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-6 group-hover:scale-105 transition-transform">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
            Upload PDF Document to Sign
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            Drag and drop your PDF contract, invoice, or agreement here, or browse files from your computer.
          </p>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center mb-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#043d2c] hover:bg-[#032e21] text-white text-sm font-bold shadow-lg shadow-[#043d2c]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>{isProcessing ? "Loading Document..." : "Select PDF Document"}</span>
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Or Try Sample Contract</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Trust & Privacy Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-stone-200/80 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              100% Client-Side RAM Sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <span>🔒 Zero Cloud Uploads</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>⚡ Up to 50MB Supported</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
