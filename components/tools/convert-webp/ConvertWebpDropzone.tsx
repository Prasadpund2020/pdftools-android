"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { WebPConversionItem } from "./types";

interface ConvertWebpDropzoneProps {
  onFilesAdded: (items: WebPConversionItem[]) => void;
  onUseSample: () => void;
}

export default function ConvertWebpDropzone({
  onFilesAdded,
  onUseSample,
}: ConvertWebpDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = useCallback(
    (files: FileList | File[]) => {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("image/")) {
          validFiles.push(files[i]);
        }
      }

      if (validFiles.length === 0) {
        alert("Please select valid image files (JPG, PNG, GIF, BMP, SVG).");
        return;
      }

      const newItems: WebPConversionItem[] = [];
      let loadedCount = 0;

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            newItems.push({
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: file.name,
              originalWidth: img.width,
              originalHeight: img.height,
              originalSizeBytes: file.size,
              previewUrl: dataUrl,
              status: "pending",
            });

            loadedCount++;
            if (loadedCount === validFiles.length) {
              onFilesAdded(newItems);
            }
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      });
    },
    [onFilesAdded]
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        processFileList(files);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFileList]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full rounded-3xl border-2 border-dashed p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
        isDragging
          ? "border-cyan-500 bg-cyan-50/80 scale-[1.01] shadow-lg shadow-cyan-100"
          : "border-stone-300/80 bg-white/80 hover:bg-white hover:border-cyan-400 hover:shadow-md"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFileList(e.target.files);
          }
        }}
      />

      <div className="w-20 h-20 rounded-3xl bg-cyan-100/80 border border-cyan-200/80 flex items-center justify-center text-cyan-600 shadow-inner mb-4 group-hover:scale-110 transition-transform">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
        Drop images here, select multiple files, or paste <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300">Ctrl+V</kbd>
      </h3>
      <p className="text-xs text-stone-500 mt-1 max-w-md">
        Batch convert JPG, PNG, and GIF into Google WebP format. Batch download or export as a combined ZIP archive.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 hover:shadow-lg transition-all cursor-pointer"
        >
          Select Multiple Photos
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUseSample();
          }}
          className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 transition-all cursor-pointer"
        >
          Load 3 Demo Images
        </button>
      </div>
    </div>
  );
}
