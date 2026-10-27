"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ToolItem, ToolCategory } from "@/types/tools";
import { ALL_TOOLS, CATEGORIES } from "@/data/tools";
import { getToolUrl } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

interface AllToolsGridProps {
  activeCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  onSelectTool: (tool: ToolItem) => void;
  onBackToDesk: () => void;
  onFileDrop?: (file: File, tool: ToolItem) => void;
}

// Handwritten micro-notes for standout tools (matches desk Caveat handwriting)
const HANDWRITTEN_NOTES: Record<string, { text: string; rotate: string }> = {
  "pdf-to-word": { text: "Editable .docx!", rotate: "-rotate-2" },
  "compress-image": { text: "Up to 80% smaller!", rotate: "rotate-2" },
  "pdf-merge": { text: "Combine instantly", rotate: "-rotate-3" },
  "remove-bg": { text: "AI neural cutout ✨", rotate: "rotate-3" },
  "youtube-downloader": { text: "1080p & 4K HD", rotate: "-rotate-1" },
  "video-to-mp3": { text: "320kbps audio", rotate: "rotate-2" },
  "image-to-pdf": { text: "Album to PDF", rotate: "-rotate-2" },
  "html-to-pdf": { text: "Pixel-perfect!", rotate: "rotate-1" },
  "compress-pdf": { text: "Lossless shrink", rotate: "-rotate-2" },
  "protect-pdf": { text: "AES-256 cipher 🔒", rotate: "rotate-2" },
  "word-to-pdf": { text: "Preserves fonts", rotate: "-rotate-1" },
  "ocr-scanner": { text: "Extracts text ✨", rotate: "rotate-2" },
  "qr-generator": { text: "Vector crisp", rotate: "-rotate-2" },
  "volume-booster": { text: "300% louder 🔊", rotate: "rotate-2" },
  "trim-video": { text: "Instant cut", rotate: "-rotate-1" },
};

// Department Shelves definition for organized studio workflow
interface DepartmentShelf {
  id: ToolCategory | "more";
  title: string;
  department: string;
  subtitle: string;
  icon: string;
  badgeColor: string;
  accentBar: string;
}

const SHELVES: DepartmentShelf[] = [
  {
    id: "pdf",
    department: "Department 01",
    title: "The Document Press",
    subtitle: "Precision PDF manipulation, editing, page merging & military-grade AES encryption.",
    icon: "document",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    accentBar: "from-rose-500 to-red-500",
  },
  {
    id: "image",
    department: "Department 02",
    title: "The Darkroom & Visual Studio",
    subtitle: "Lossless compression, neural AI cutout, aspect-ratio resizing & format translation.",
    icon: "photograph",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accentBar: "from-emerald-500 to-teal-500",
  },
  {
    id: "video-audio",
    department: "Department 03",
    title: "Soundstage & Cinema Lab",
    subtitle: "Lossless audio extraction, video slimming, volume amplification & track muting.",
    icon: "film",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    accentBar: "from-purple-500 to-indigo-500",
  },
  {
    id: "downloaders",
    department: "Department 04",
    title: "The Media Courier",
    subtitle: "Direct capture of videos, shorts, reels & high-definition clips in browser memory.",
    icon: "download",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    accentBar: "from-amber-500 to-orange-500",
  },
  {
    id: "edit-convert",
    department: "Department 05",
    title: "Conversion Bench & Utilities",
    subtitle: "OCR text extraction, spreadsheets to PDF, EPUB readers, QR studios & checksums.",
    icon: "pencil",
    badgeColor: "bg-sky-100 text-sky-700 border-sky-200",
    accentBar: "from-sky-500 to-blue-500",
  },
];

export default function AllToolsGrid({
  activeCategory,
  onSelectCategory,
  onSelectTool,
  onBackToDesk,
  onFileDrop,
}: AllToolsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"shelves" | "grid">("shelves");
  const [dragOverToolId, setDragOverToolId] = useState<string | null>(null);

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      // Category match
      const matchesCategory =
        activeCategory === "all"
          ? true
          : activeCategory === "edit-convert"
          ? tool.category === "edit-convert" || tool.category === "more"
          : tool.category === activeCategory;

      if (!matchesCategory) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = tool.title.toLowerCase().includes(q);
      const descMatch = tool.description.toLowerCase().includes(q);
      const catMatch = tool.category.toLowerCase().includes(q);
      const formatsMatch = tool.acceptedFormats?.toLowerCase().includes(q);
      return titleMatch || descMatch || catMatch || formatsMatch;
    });
  }, [activeCategory, searchQuery]);

  // Group tools by department when in shelves mode
  const shelfGroups = useMemo(() => {
    return SHELVES.map((shelf) => {
      const toolsInShelf = filteredTools.filter((tool) => {
        if (shelf.id === "edit-convert") {
          return tool.category === "edit-convert" || tool.category === "more";
        }
        return tool.category === shelf.id;
      });
      return { shelf, tools: toolsInShelf };
    }).filter((group) => group.tools.length > 0);
  }, [filteredTools]);

  const handleCardDragOver = (e: React.DragEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverToolId(toolId);
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverToolId(null);
  };

  const handleCardDrop = (e: React.DragEvent, tool: ToolItem) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverToolId(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onFileDrop) {
        onFileDrop(file, tool);
      } else {
        onSelectTool(tool);
      }
    } else {
      onSelectTool(tool);
    }
  };

  // Helper for Category icons
  const renderCategoryIcon = (id: string, className = "w-3.5 h-3.5") => {
    switch (id) {
      case "all":
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case "pdf":
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "image":
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "video-audio":
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "downloaders":
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        );
      case "edit-convert":
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  // Reusable Tool Card Component
  const renderToolCard = (tool: ToolItem) => {
    const isDragTarget = dragOverToolId === tool.id;
    const note = HANDWRITTEN_NOTES[tool.id];

    return (
      <Link
        key={tool.id}
        href={getToolUrl(tool)}
        onDragOver={(e) => handleCardDragOver(e, tool.id)}
        onDragLeave={handleCardDragLeave}
        onDrop={(e) => handleCardDrop(e, tool)}
        className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none no-underline ${
          isDragTarget
            ? "ring-4 ring-blue-500 scale-[1.03] shadow-2xl bg-blue-50/90 border-blue-400"
            : "bg-gradient-to-b from-white/95 via-stone-50/90 to-white/90 border border-stone-200/80 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98]"
        }`}
        style={{
          boxShadow: isDragTarget
            ? "0 20px 35px -8px rgba(59, 130, 246, 0.4)"
            : "0 4px 12px -2px rgba(40, 30, 20, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        }}
      >
        {/* Drag Drop Overlay */}
        {isDragTarget && (
          <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white z-30 p-3 text-center animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">Release to launch</span>
            <span className="text-sm font-black underline mt-0.5">{tool.title}</span>
          </div>
        )}

        <div>
          {/* Top Row: 3D Clay Icon + Formats Badge / Handwritten Note */}
          <div className="flex items-start justify-between mb-3 relative">
            <div
              className={`clay-btn ${tool.clayColor} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-[-2deg] transition-all duration-300 flex-shrink-0`}
            >
              <ToolIcon iconType={tool.iconType} className="w-6 h-6" />
            </div>

            <div className="flex flex-col items-end gap-1">
              {/* Handwritten Note (if available) */}
              {note && (
                <span
                  className={`font-handwriting text-[13px] font-bold text-amber-900 bg-amber-100/90 border border-amber-200/90 px-2 py-0.5 rounded-full shadow-xs transform ${note.rotate} pointer-events-none whitespace-nowrap`}
                >
                  {note.text}
                </span>
              )}

              {/* Supported Format Tag or Category */}
              {tool.acceptedFormats ? (
                <span className="text-[10px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-md bg-stone-100 text-slate-500 border border-stone-200/60 uppercase">
                  {tool.acceptedFormats.split(",")[0].replace(".", "")}
                  {tool.acceptedFormats.split(",").length > 1
                    ? ` +${tool.acceptedFormats.split(",").length - 1}`
                    : ""}
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-slate-500">
                  {tool.category}
                </span>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="font-bold text-[15px] text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">
            {tool.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Footer: Quick Launch Trigger & Status */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            100% Client-side
          </span>

          <div className="flex items-center gap-1 font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
            <span>Launch</span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col my-1 sm:my-2 animate-in fade-in duration-200">
      {/* ================================================================ */}
      {/* 1. ATELIER COMMAND TRAY (HEADER BANNER WITH SEARCH & VIEW MODES) */}
      {/* ================================================================ */}
      <div className="relative mb-5 bg-gradient-to-br from-white/95 via-stone-50/90 to-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-md">
        {/* Subtle decorative top pin accent */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-stone-300/80 rounded-full"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Atelier Status */}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>The Tool Atelier</span>
                <span className="font-serif italic font-normal text-slate-400 text-lg sm:text-xl">
                  & Studio Registry
                </span>
              </h2>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/70 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{filteredTools.length} Client-Side Engines</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Handcrafted in-browser file utilities. Zero server uploads, zero subscriptions, 100% private.
            </p>
          </div>

          {/* Controls: Search, View Switcher & Back to Desk */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Instant Search Bar */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tools or formats..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-stone-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-2xs transition-all"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* View Mode Switcher: Shelves vs Index Grid */}
            <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("shelves")}
                title="View by Department Shelves"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "shelves"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="hidden sm:inline">Shelves</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Compact Index Grid"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden sm:inline">Index</span>
              </button>
            </div>

            {/* Back to Desk Button */}
            <button
              type="button"
              onClick={onBackToDesk}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Return to Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. TACTILE INDEX FILING TABS (WORKSHOP DIVIDERS)                 */}
      {/* ================================================================ */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1.5 no-scrollbar select-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border-stone-200/80 shadow-2xs"
              }`}
            >
              <span className={isActive ? "text-blue-400" : "text-slate-400"}>
                {renderCategoryIcon(cat.id)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-stone-100 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* 3. EMPTY STATE (IF NO TOOLS MATCH SEARCH)                        */}
      {/* ================================================================ */}
      {filteredTools.length === 0 && (
        <div className="w-full max-w-md mx-auto my-12 p-8 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-stone-200/80 shadow-md">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No instruments found for &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try checking spelling or resetting your category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              onSelectCategory("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ================================================================ */}
      {/* 4. CONTENT VIEW: DEPARTMENT SHELVES OR FLAT INDEX GRID           */}
      {/* ================================================================ */}
      {viewMode === "shelves" && activeCategory === "all" && !searchQuery ? (
        /* Organized Studio Wings */
        <div className="space-y-8 pb-16">
          {shelfGroups.map(({ shelf, tools }) => (
            <section
              key={shelf.id}
              className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-4 sm:p-5 border border-white/70 shadow-xs"
            >
              {/* Shelf Department Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/70">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-7 w-1.5 rounded-full bg-gradient-to-b ${shelf.accentBar}`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
                        {shelf.department}
                      </span>
                      <span className="text-slate-300">•</span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                        {shelf.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${shelf.badgeColor}`}
                      >
                        {tools.length} Tools
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{shelf.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCategory(shelf.id as ToolCategory)}
                  className="self-start sm:self-auto text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn"
                >
                  <span>Focus Wing</span>
                  <svg
                    className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Tools Cards for this Shelf */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {tools.map((tool) => renderToolCard(tool))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat Grid View (when filtered by category, search, or Index mode) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 pb-16">
          {filteredTools.map((tool) => renderToolCard(tool))}
        </div>
      )}
    </div>
  );
}
