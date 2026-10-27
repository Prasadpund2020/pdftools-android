"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToolItem } from "@/types/tools";
import { getToolUrl } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

interface ToolCardProps {
  tool: ToolItem;
}

// Visual color configuration helper matching the sleek modern atelier cards
function getCardStyling(tool: ToolItem) {
  // 1. Squircle Icon Color, Badge Color, and Button Background Color
  let squircleBg = "bg-slate-800";
  let badgeColor = "bg-slate-100 text-slate-700";
  let btnBg = "bg-[#1e293b] group-hover:bg-[#2e3e56]";
  let titleHover = "group-hover:text-slate-900";

  switch (tool.id) {
    case "sign-pdf":
    case "pdf-to-excel":
    case "compress-image":
    case "jpg-to-png":
    case "excel-to-pdf":
      squircleBg = "bg-[#10b981]";
      badgeColor = "bg-emerald-50 text-emerald-700";
      btnBg = "bg-[#0d3b32] group-hover:bg-[#134d41]";
      titleHover = "group-hover:text-emerald-700";
      break;

    case "protect-pdf":
    case "video-to-mp3":
    case "organize-pdf":
    case "epub-to-pdf":
    case "trim-video":
      squircleBg = "bg-[#a855f7]";
      badgeColor = "bg-purple-50 text-purple-700";
      btnBg = "bg-[#331548] group-hover:bg-[#441d60]";
      titleHover = "group-hover:text-purple-700";
      break;

    case "redact-pdf":
    case "pdf-to-word":
    case "compress-pdf":
    case "mute-video":
      squircleBg = "bg-[#ef4444]";
      badgeColor = "bg-rose-50 text-rose-700";
      btnBg = "bg-[#451218] group-hover:bg-[#5a1820]";
      titleHover = "group-hover:text-rose-700";
      break;

    case "watermark-pdf":
    case "word-to-pdf":
    case "pdf-merge":
    case "split-pdf":
    case "resize-image":
    case "twitter-media":
      squircleBg = "bg-[#38bdf8]";
      badgeColor = "bg-sky-50 text-sky-700";
      btnBg = "bg-[#0c364c] group-hover:bg-[#114660]";
      titleHover = "group-hover:text-sky-700";
      break;

    case "compare-pdf":
    case "remove-bg":
    case "qr-generator":
    case "convert-webp":
    case "tiktok-saver":
      squircleBg = "bg-[#06b6d4]";
      badgeColor = "bg-cyan-50 text-cyan-700";
      btnBg = "bg-[#08383f] group-hover:bg-[#0c4750]";
      titleHover = "group-hover:text-cyan-700";
      break;

    case "repair-pdf":
    case "youtube-downloader":
    case "ocr-scanner":
    case "volume-booster":
    case "watermark-image":
    case "barcode-scanner":
      squircleBg = "bg-[#f59e0b]";
      badgeColor = "bg-amber-50 text-amber-700";
      btnBg = "bg-[#422208] group-hover:bg-[#542c0b]";
      titleHover = "group-hover:text-amber-700";
      break;

    case "pdf-to-jpg":
    case "crop-image":
    case "insta-reels":
      squircleBg = "bg-[#ec4899]";
      badgeColor = "bg-pink-50 text-pink-700";
      btnBg = "bg-[#46122d] group-hover:bg-[#591739]";
      titleHover = "group-hover:text-pink-700";
      break;

    case "html-to-pdf":
      squircleBg = "bg-[#f97316]";
      badgeColor = "bg-orange-50 text-orange-700";
      btnBg = "bg-[#441d08] group-hover:bg-[#59260a]";
      titleHover = "group-hover:text-orange-700";
      break;

    default:
      if (tool.clayColor === "clay-green") {
        squircleBg = "bg-[#10b981]";
        badgeColor = "bg-emerald-50 text-emerald-700";
        btnBg = "bg-[#0d3b32] group-hover:bg-[#134d41]";
        titleHover = "group-hover:text-emerald-700";
      } else if (tool.clayColor === "clay-purple") {
        squircleBg = "bg-[#a855f7]";
        badgeColor = "bg-purple-50 text-purple-700";
        btnBg = "bg-[#331548] group-hover:bg-[#441d60]";
        titleHover = "group-hover:text-purple-700";
      } else if (tool.clayColor === "clay-red") {
        squircleBg = "bg-[#ef4444]";
        badgeColor = "bg-rose-50 text-rose-700";
        btnBg = "bg-[#451218] group-hover:bg-[#5a1820]";
        titleHover = "group-hover:text-rose-700";
      } else if (tool.clayColor === "clay-blue") {
        squircleBg = "bg-[#38bdf8]";
        badgeColor = "bg-sky-50 text-sky-700";
        btnBg = "bg-[#0c364c] group-hover:bg-[#114660]";
        titleHover = "group-hover:text-sky-700";
      } else if (tool.clayColor === "clay-cyan") {
        squircleBg = "bg-[#06b6d4]";
        badgeColor = "bg-cyan-50 text-cyan-700";
        btnBg = "bg-[#08383f] group-hover:bg-[#0c4750]";
        titleHover = "group-hover:text-cyan-700";
      } else if (tool.clayColor === "clay-yellow" || tool.clayColor === "clay-orange") {
        squircleBg = "bg-[#f59e0b]";
        badgeColor = "bg-amber-50 text-amber-700";
        btnBg = "bg-[#422208] group-hover:bg-[#542c0b]";
        titleHover = "group-hover:text-amber-700";
      } else if (tool.clayColor === "clay-pink") {
        squircleBg = "bg-[#ec4899]";
        badgeColor = "bg-pink-50 text-pink-700";
        btnBg = "bg-[#46122d] group-hover:bg-[#591739]";
        titleHover = "group-hover:text-pink-700";
      }
      break;
  }

  // 2. Badge Text
  let badgeText = tool.badgeText || tool.badge;
  if (!badgeText) {
    if (tool.id === "compress-image") badgeText = "-80% Size";
    else if (tool.id === "remove-bg") badgeText = "AI Neural";
    else if (tool.id === "pdf-merge") badgeText = "Combine";
    else if (tool.id === "split-pdf") badgeText = "Extract";
    else if (tool.id === "compress-pdf") badgeText = "Lossless";
    else if (tool.id === "pdf-to-jpg") badgeText = "High-Res";
    else if (tool.id === "video-to-mp3") badgeText = "320kbps";
    else if (tool.id === "youtube-downloader") badgeText = "4K / HD";
    else if (tool.id === "ocr-scanner") badgeText = "Extract Text";
    else if (tool.id === "qr-generator") badgeText = "Vector";
    else if (tool.id === "html-to-pdf") badgeText = "HTML → PDF";
    else if (tool.id === "organize-pdf") badgeText = "Reorder";
    else if (tool.acceptedFormats) {
      badgeText = tool.acceptedFormats.split(",")[0].toUpperCase();
    } else {
      badgeText = "Fast";
    }
  }

  // 3. Action Text
  let actionText = tool.actionText;
  if (!actionText) {
    if (tool.id === "compress-image") actionText = "Shrink Image";
    else if (tool.id === "remove-bg") actionText = "Cutout Subject";
    else if (tool.id === "pdf-merge") actionText = "Combine PDFs";
    else if (tool.id === "split-pdf") actionText = "Split Pages";
    else if (tool.id === "compress-pdf") actionText = "Compress Doc";
    else if (tool.id === "pdf-to-jpg") actionText = "Export JPG";
    else if (tool.id === "video-to-mp3") actionText = "Extract Audio";
    else if (tool.id === "youtube-downloader") actionText = "Download Video";
    else if (tool.id === "ocr-scanner") actionText = "Scan Document";
    else if (tool.id === "qr-generator") actionText = "Generate QR";
    else if (tool.id === "html-to-pdf") actionText = "Convert to PDF";
    else if (tool.id === "organize-pdf") actionText = "Organize Pages";
    else actionText = "Open Tool";
  }

  return { squircleBg, badgeColor, badgeText, actionText, btnBg, titleHover };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [isDragTarget, setIsDragTarget] = useState(false);
  const toolUrl = getToolUrl(tool);
  const { squircleBg, badgeColor, badgeText, actionText, btnBg, titleHover } = getCardStyling(tool);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragTarget(false);
    window.location.href = toolUrl;
  };

  return (
    <Link
      href={toolUrl}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between select-none no-underline ${
        isDragTarget ? "ring-2 ring-emerald-500 bg-emerald-50/20" : ""
      }`}
    >
      {/* Drag & Drop Feedback */}
      {isDragTarget && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white z-30 p-3 text-center">
          <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">Release to launch</span>
          <span className="text-sm font-bold mt-0.5">{tool.title}</span>
        </div>
      )}

      <div>
        {/* Top Row: Squircle Icon + Feature Badge Pill */}
        <div className="flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 ${squircleBg}`}
          >
            <ToolIcon iconType={tool.iconType} className="w-5 h-5 text-white" />
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-tight ${badgeColor}`}>
            {badgeText}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className={`text-[15px] font-bold text-slate-900 mt-4 mb-1 tracking-tight ${titleHover} transition-colors`}>
          {tool.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[34px]">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action: Solid Pill Button themed with respective icon color */}
      <div className={`mt-5 w-full ${btnBg} text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between transition-colors shadow-xs group-hover:shadow-sm`}>
        <span>{actionText}</span>
        <span className="text-white/80 text-sm font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
      </div>
    </Link>
  );
}
