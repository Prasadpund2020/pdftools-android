"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Category3DStage from "@/components/tools/Category3DStage";

interface CategoryHeroProps {
  category: string;
  categoryName: string;
  departmentNumber: string;
  description: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  toolCount: number;
}

export default function CategoryHero({
  category,
  categoryName,
  departmentNumber,
  description,
  searchQuery,
  onSearchChange,
  toolCount,
}: CategoryHeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Category theme styling configurations
  const THEMES: Record<
    string,
    {
      titleAccent: string;
      eyebrow: string;
      glowGradient: string;
      glowBorder: string;
      glowRing: string;
      submitBtn: string;
      departmentBadge: string;
    }
  > = {
    pdf: {
      titleAccent: "text-[#c23333]",
      eyebrow: "DEPARTMENT 01 · DOCUMENT ATELIER",
      glowGradient: "from-rose-300/40 via-red-200/50 to-rose-400/30",
      glowBorder: "border-rose-300/70",
      glowRing: "focus-within:ring-rose-500/40 focus-within:border-rose-500",
      submitBtn: "bg-[#182029] hover:bg-black",
      departmentBadge: "bg-rose-100/90 text-rose-800 border-rose-200/80",
    },
    image: {
      titleAccent: "text-[#0d9488]",
      eyebrow: "DEPARTMENT 02 · VISUAL DARKROOM",
      glowGradient: "from-teal-300/40 via-emerald-200/50 to-teal-400/30",
      glowBorder: "border-teal-300/70",
      glowRing: "focus-within:ring-teal-500/40 focus-within:border-teal-500",
      submitBtn: "bg-[#182029] hover:bg-black",
      departmentBadge: "bg-teal-100/90 text-teal-800 border-teal-200/80",
    },
    "video-audio": {
      titleAccent: "text-[#7c3aed]",
      eyebrow: "DEPARTMENT 03 · SOUNDSTAGE & CINEMA",
      glowGradient: "from-purple-300/40 via-violet-200/50 to-purple-400/30",
      glowBorder: "border-purple-300/70",
      glowRing: "focus-within:ring-purple-500/40 focus-within:border-purple-500",
      submitBtn: "bg-[#182029] hover:bg-black",
      departmentBadge: "bg-purple-100/90 text-purple-800 border-purple-200/80",
    },
    downloaders: {
      titleAccent: "text-[#d97706]",
      eyebrow: "DEPARTMENT 04 · MEDIA COURIER",
      glowGradient: "from-amber-300/40 via-orange-200/50 to-amber-400/30",
      glowBorder: "border-amber-300/70",
      glowRing: "focus-within:ring-amber-500/40 focus-within:border-amber-500",
      submitBtn: "bg-[#182029] hover:bg-black",
      departmentBadge: "bg-amber-100/90 text-amber-800 border-amber-200/80",
    },
    "edit-convert": {
      titleAccent: "text-[#2563eb]",
      eyebrow: "DEPARTMENT 05 · UNIVERSAL PRESS",
      glowGradient: "from-blue-300/40 via-indigo-200/50 to-blue-400/30",
      glowBorder: "border-blue-300/70",
      glowRing: "focus-within:ring-blue-500/40 focus-within:border-blue-500",
      submitBtn: "bg-[#182029] hover:bg-black",
      departmentBadge: "bg-blue-100/90 text-blue-800 border-blue-200/80",
    },
  };

  const theme = THEMES[category] || {
    titleAccent: "text-[#a86828]",
    eyebrow: "SPECIAL COLLECTION · TOOLS ATELIER",
    glowGradient: "from-amber-300/40 via-amber-200/50 to-amber-400/30",
    glowBorder: "border-amber-300/70",
    glowRing: "focus-within:ring-amber-500/40 focus-within:border-amber-500",
    submitBtn: "bg-[#182029] hover:bg-black",
    departmentBadge: "bg-stone-100 text-stone-800 border-stone-200/80",
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = document.getElementById("category-tools-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative mb-3 sm:mb-4">
      {/* 2. Main Architectural Category Showcase Card (Streamlined & Compact) */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#faf7f2] via-[#f7f2ea] to-[#efe9dd] border border-[#e8dfd2] p-3.5 sm:p-4.5 lg:px-6 lg:py-4 shadow-xs overflow-hidden">
        {/* Subtle architectural noise/grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #785b3a 0.8px, transparent 0.8px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
          {/* Left Column: Department Headline & Search */}
          <div className="w-full lg:max-w-[520px] xl:max-w-[580px] z-10">
            {/* Eyebrow rule & department badge */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="w-4 h-[1.5px] bg-stone-400/80" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                {theme.eyebrow}
              </span>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md border ${theme.departmentBadge}`}
              >
                {departmentNumber}
              </span>
              <span className="text-stone-300">•</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-md bg-stone-200/60 text-stone-800 text-[10px] font-bold">
                {toolCount} tools
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-black tracking-tight text-stone-900 leading-tight mb-2 sm:mb-2.5">
              <span className={`${theme.titleAccent} font-black`}>
                {categoryName}
              </span>{" "}
              Utilities
            </h1>

            {/* HERO SEARCH BAR with Glowing Ambient Aura & Round Arrow Button */}
            <form
              onSubmit={handleSubmit}
              className="relative max-w-md xl:max-w-lg w-full mb-0 group"
            >
              {/* Luminous Golden Ambient Glow Halo */}
              <div
                className={`absolute -inset-1 rounded-full bg-gradient-to-r ${theme.glowGradient} blur-md opacity-80 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300 pointer-events-none`}
                aria-hidden="true"
              />

              <div
                className={`relative flex items-center bg-white rounded-full p-1 sm:p-1.2 pl-3.5 sm:pl-4 border ${theme.glowBorder} shadow-[0_3px_16px_rgba(180,115,35,0.14)] group-hover:shadow-[0_4px_22px_rgba(180,115,35,0.2)] focus-within:ring-2 ${theme.glowRing} transition-all duration-300`}
              >
                {/* Search Magnifying Glass Icon */}
                <svg
                  className="w-4 h-4 text-stone-400 group-focus-within:text-stone-700 transition-colors mr-2.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>

                {/* Input Text Field */}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={`Search within ${toolCount} ${categoryName.toLowerCase()}...`}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none pr-2.5"
                  aria-label={`Search ${categoryName}`}
                />

                {/* Quick Clear Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange("");
                      inputRef.current?.focus();
                    }}
                    className="mr-1.5 text-xs text-stone-400 hover:text-stone-700 font-bold p-1 transition-colors"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}

                {/* Circular Action Arrow Button */}
                <button
                  type="submit"
                  className={`w-8 h-8 rounded-full ${theme.submitBtn} text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-xs group-hover:scale-[1.02]`}
                  aria-label="Search"
                  title="Search"
                >
                  <svg
                    className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Code-Based Compact 3D Floating Category Stage */}
          <div className="hidden lg:flex items-center justify-center relative flex-shrink-0 w-[320px] xl:w-[350px]">
            <Category3DStage category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}
