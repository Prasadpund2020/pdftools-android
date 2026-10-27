"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { WatermarkSourceMeta } from "./types";

interface WatermarkImageDropzoneProps {
  onImageSelected: (meta: WatermarkSourceMeta) => void;
  onUseSample: () => void;
}

export default function WatermarkImageDropzone({
  onImageSelected,
  onUseSample,
}: WatermarkImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (JPG, PNG, WebP, SVG, BMP).");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          onImageSelected({
            file,
            name: file.name,
            originalWidth: img.width,
            originalHeight: img.height,
            originalSizeBytes: file.size,
            aspectRatio: img.width / img.height,
            dataUrl,
            mimeType: file.type,
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFile]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full rounded-3xl border-2 border-dashed p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
        isDragging
          ? "border-orange-500 bg-orange-50/80 scale-[1.01] shadow-lg shadow-orange-100"
          : "border-stone-300/80 bg-white/80 hover:bg-white hover:border-orange-400 hover:shadow-md"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/bmp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />

      <div className="w-20 h-20 rounded-3xl bg-orange-100/80 border border-orange-200/80 flex items-center justify-center text-orange-600 shadow-inner mb-4 group-hover:scale-110 transition-transform">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
        Drop an image to watermark, paste <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300">Ctrl+V</kbd>, or browse
      </h3>
      <p className="text-xs text-stone-500 mt-1 max-w-md">
        Protect photos with custom copyright text, logo stamps, or tiled diagonal patterns. 100% private in-browser RAM execution.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 hover:shadow-lg transition-all cursor-pointer"
        >
          Select Photo from Computer
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUseSample();
          }}
          className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 transition-all cursor-pointer"
        >
          Load Demo Artwork
        </button>
      </div>
    </div>
  );
}
