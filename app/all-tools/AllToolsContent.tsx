"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_TOOLS } from "@/data/tools";
import { ToolItem } from "@/types/tools";
import ToolCard from "@/components/tools/ToolCard";
import AllToolsHero from "@/components/tools/AllToolsHero";

interface StudioDesk {
  id: string;
  title: string;
  pillColor: string;
  toolIds: string[];
}

const DESKS: StudioDesk[] = [
  {
    id: "security-signature",
    title: "Security & Signature Desk",
    pillColor: "bg-emerald-600",
    toolIds: [
      "sign-pdf",
      "protect-pdf",
      "redact-pdf",
      "watermark-pdf",
      "compare-pdf",
      "repair-pdf",
    ],
  },
  {
    id: "core-converters",
    title: "Core Converters & Transformers",
    pillColor: "bg-rose-500",
    toolIds: [
      "pdf-to-word",
      "word-to-pdf",
      "pdf-to-excel",
      "excel-to-pdf",
      "image-to-pdf",
      "pdf-to-jpg",
      "html-to-pdf",
    ],
  },
  {
    id: "document-press",
    title: "Document Press & Page Management",
    pillColor: "bg-sky-500",
    toolIds: [
      "pdf-merge",
      "split-pdf",
      "compress-pdf",
      "organize-pdf",
      "ocr-scanner",
      "epub-to-pdf",
    ],
  },
  {
    id: "visual-studio",
    title: "The Visual Studio & Darkroom",
    pillColor: "bg-teal-500",
    toolIds: [
      "compress-image",
      "remove-bg",
      "resize-image",
      "crop-image",
      "jpg-to-png",
      "convert-webp",
      "watermark-image",
    ],
  },
  {
    id: "soundstage-cinema",
    title: "Soundstage & Cinema Lab",
    pillColor: "bg-purple-500",
    toolIds: [
      "video-to-mp3",
      "trim-video",
      "volume-booster",
      "convert-audio",
      "mute-video",
    ],
  },
  {
    id: "media-courier",
    title: "The Media Courier & Social Capture",
    pillColor: "bg-amber-500",
    toolIds: [
      "youtube-downloader",
      "insta-reels",
      "tiktok-saver",
      "twitter-media",
      "qr-generator",
      "barcode-scanner",
    ],
  },
];

export default function AllToolsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTools = useMemo(() => {
    let list = ALL_TOOLS;

    // Filter by category dock selection
    if (activeCategory !== "all") {
      switch (activeCategory) {
        case "pdf":
          list = list.filter(
            (t) =>
              t.category === "pdf" ||
              t.id.includes("pdf") ||
              t.title.toLowerCase().includes("pdf")
          );
          break;
        case "image":
          list = list.filter(
            (t) =>
              t.category === "image" ||
              t.id.includes("image") ||
              t.title.toLowerCase().includes("image") ||
              t.title.toLowerCase().includes("jpg") ||
              t.title.toLowerCase().includes("png") ||
              t.title.toLowerCase().includes("bg")
          );
          break;
        case "video":
          list = list.filter(
            (t) =>
              (t.category === "video-audio" &&
                (t.id.includes("video") ||
                  t.title.toLowerCase().includes("video"))) ||
              t.title.toLowerCase().includes("video") ||
              t.category === "downloaders"
          );
          break;
        case "audio":
          list = list.filter(
            (t) =>
              (t.category === "video-audio" &&
                (t.id.includes("audio") ||
                  t.id.includes("mp3") ||
                  t.title.toLowerCase().includes("volume") ||
                  t.title.toLowerCase().includes("sound") ||
                  t.title.toLowerCase().includes("audio"))) ||
              t.title.toLowerCase().includes("audio") ||
              t.title.toLowerCase().includes("mp3")
          );
          break;
        case "text":
          list = list.filter(
            (t) =>
              t.category === "edit-convert" ||
              t.title.toLowerCase().includes("word") ||
              t.title.toLowerCase().includes("excel") ||
              t.title.toLowerCase().includes("text") ||
              t.title.toLowerCase().includes("ocr") ||
              t.title.toLowerCase().includes("epub")
          );
          break;
        case "other":
          list = list.filter(
            (t) =>
              t.category === "downloaders" ||
              t.category === "more" ||
              t.id.includes("qr") ||
              t.id.includes("barcode")
          );
          break;
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.acceptedFormats && t.acceptedFormats.toLowerCase().includes(q))
      );
    }

    return list;
  }, [searchQuery, activeCategory]);

  // Compute desk tool lists
  const desksWithTools = useMemo(() => {
    return DESKS.map((desk) => {
      const tools = desk.toolIds
        .map((id) => ALL_TOOLS.find((t) => t.id === id))
        .filter((t): t is ToolItem => Boolean(t));
      return { ...desk, tools };
    });
  }, []);

  const isFiltered = Boolean(searchQuery.trim() || activeCategory !== "all");

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-4 lg:py-4.5">
      {/* Atelier Hero Section matching reference mockup */}
      <AllToolsHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        totalCount={ALL_TOOLS.length}
      />

      {/* Main Workspace Area */}
      <div id="tools-workspace" className="scroll-mt-6">
        {isFiltered ? (
          <div>
            {/* Filter Status Bar */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
                <span>
                  Showing{" "}
                  <strong className="text-stone-900 font-bold">
                    {filteredTools.length}
                  </strong>{" "}
                  {filteredTools.length === 1 ? "tool" : "tools"}
                </span>
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold capitalize">
                    {activeCategory} Tools
                  </span>
                )}
                {searchQuery && (
                  <span className="text-stone-500">
                    matching &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            </div>

            {/* Results Grid or Empty State */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-dashed border-stone-300">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">
                  No tools found
                </h3>
                <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                  We couldn&apos;t find any tools matching your criteria. Try
                  refining your search or browse all desks.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-xl shadow-xs transition-colors"
                >
                  View All {ALL_TOOLS.length} Tools
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* When not filtered: render Desks with Section Headers and 3-column Card Grid */
          <div className="space-y-12">
            {desksWithTools.map((desk) => (
              <section key={desk.id}>
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-4.5 rounded-full ${desk.pillColor}`} />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {desk.title}
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {desk.tools.length} utilities
                  </span>
                </div>

                {/* 3-column Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {desk.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
