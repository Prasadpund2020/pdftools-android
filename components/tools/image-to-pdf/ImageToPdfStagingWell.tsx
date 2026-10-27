"use client";

import React, { useRef, useState } from "react";
import { StagedImage } from "./types";
import ImageToPdfCard from "./ImageToPdfCard";

interface ImageToPdfStagingWellProps {
  images: StagedImage[];
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (newImages: StagedImage[]) => void;
  onAppendFiles: (files: FileList | File[]) => void;
  onConvert: () => void;
  isConverting?: boolean;
}

export default function ImageToPdfStagingWell({
  images,
  onRotate,
  onRemove,
  onReorder,
  onAppendFiles,
  onConvert,
  isConverting = false,
}: ImageToPdfStagingWellProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDropzoneHovered, setIsDropzoneHovered] = useState(false);

  // Drag & drop card reordering handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Set transparent ghost drag image or data
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...images];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);
    onReorder(updated);
    setDraggedIndex(null);
  };

  // Secondary inset dropzone handlers
  const handleSecondaryDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropzoneHovered(true);
  };

  const handleSecondaryDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropzoneHovered(false);
  };

  const handleSecondaryDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropzoneHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAppendFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAppendFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className="relative p-5 sm:p-6 lg:p-7 rounded-3xl bg-stone-100/80 border border-stone-200/90 shadow-[inset_0_3px_10px_rgba(41,37,36,0.06),inset_0_1px_3px_rgba(41,37,36,0.04)]">
      {/* Tactile Annotation Pin */}
      <div className="absolute -top-3.5 left-8 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-600 text-white text-xs font-bold shadow-[0_4px_10px_rgba(253,118,26,0.35)] select-none">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
        <span>Auto-Sequence Enabled</span>
      </div>

      {/* Reorder Header & Quick Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pt-1">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Drag cards to arrange page sequence
        </div>

        <button
          type="button"
          onClick={onConvert}
          disabled={isConverting || images.length === 0}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-[0_8px_16px_-4px_rgba(253,118,26,0.35)] hover:shadow-[0_12px_20px_-4px_rgba(253,118,26,0.45)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isConverting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Assembling...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>Merge into PDF ({images.length} {images.length === 1 ? "File" : "Files"})</span>
            </>
          )}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <ImageToPdfCard
            key={img.id}
            image={img}
            index={idx}
            onRotate={onRotate}
            onRemove={onRemove}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            isDraggingCurrent={draggedIndex === idx}
          />
        ))}
      </div>

      {/* Secondary Inset Dropzone for Appending Files */}
      <div
        onDragOver={handleSecondaryDragOver}
        onDragLeave={handleSecondaryDragLeave}
        onDrop={handleSecondaryDrop}
        className={`mt-5 p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
          isDropzoneHovered
            ? "border-orange-500 bg-orange-50/80 scale-[1.01]"
            : "border-stone-300 bg-white/70 hover:border-orange-300 hover:bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-xs sm:text-sm text-stone-600 font-medium">
            Drop images to append or
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            Browse Device
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.gif,.bmp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
