"use client";

import React from "react";
import { StagedImage } from "./types";

interface ImageToPdfCardProps {
  image: StagedImage;
  index: number;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  isDraggingCurrent?: boolean;
}

export default function ImageToPdfCard({
  image,
  index,
  onRotate,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDraggingCurrent = false,
}: ImageToPdfCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative rounded-2xl bg-white p-4 shadow-sm border border-stone-200/80 hover:shadow-lg hover:border-orange-200 transition-all cursor-grab active:cursor-grabbing select-none ${
        isDraggingCurrent ? "opacity-40 scale-[0.98] border-dashed border-orange-400" : ""
      }`}
    >
      {/* Card Header: sequence number, title, rotate & delete actions */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-900 font-bold text-xs flex items-center justify-center shrink-0 border border-orange-200/60">
            {index + 1}
          </span>
          <span
            className="text-xs sm:text-sm font-semibold text-stone-800 truncate"
            title={image.name}
          >
            {image.name}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-stone-500">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotate(image.id);
            }}
            className="p-1.5 hover:text-orange-600 rounded-full hover:bg-orange-50 transition-colors cursor-pointer"
            title="Rotate 90 deg clockwise"
            aria-label="Rotate image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(image.id);
            }}
            className="p-1.5 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
            title="Remove page"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Preview Area with Rotation Transform */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-stone-100/90 border border-stone-200/60 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.previewUrl}
          alt={image.name}
          className="max-w-full max-h-full object-contain transition-transform duration-300 pointer-events-none group-hover:scale-105"
          style={{ transform: `rotate(${image.rotation}deg)` }}
        />

        {/* Format & Size Badge */}
        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
          {image.format} • {image.formattedSize}
          {image.rotation > 0 && ` • ${image.rotation}°`}
        </div>

        {/* Drag Handle Indicator */}
        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-stone-500 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
