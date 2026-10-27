"use client";

import React from "react";
import Link from "next/link";
import { ToolCategory } from "@/types/tools";
import { CATEGORIES } from "@/data/tools";
import { getCategoryUrl } from "@/lib/tools";

interface SidebarProps {
  activeCategory?: ToolCategory;
  onSelectCategory?: (category: ToolCategory) => void;
}

export default function Sidebar({
  activeCategory = "all",
  onSelectCategory,
}: SidebarProps) {
  const getCategoryIcon = (id: ToolCategory) => {
    switch (id) {
      case "all":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case "pdf":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        );
      case "image":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        );
      case "video-audio":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        );
      case "downloaders":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        );
      case "edit-convert":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        );
      case "more":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Mobile & Tablet Horizontal Category Pills Strip (lg:hidden) */}
      <nav 
        className="lg:hidden w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1 px-0.5 select-none"
        aria-label="Filter categories"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const href = getCategoryUrl(cat.id);
          return (
            <Link
              key={cat.id}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 no-underline ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400"}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Glass Vertical Sidebar (hidden lg:flex) */}
      <aside className="hidden lg:flex w-56 bg-white/70 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/60 flex-col justify-between self-start mt-2 select-none flex-shrink-0">
        {/* Categories Navigation List */}
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const href = getCategoryUrl(cat.id);
            return (
              <Link
                key={cat.id}
                href={href}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all no-underline ${
                  isActive
                    ? "bg-blue-100/70 text-blue-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span>{cat.name}</span>
                </div>
                <span
                  className={`text-[11px] ${
                    isActive ? "text-blue-600 font-bold" : "text-slate-400"
                  }`}
                >
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Privacy Badge */}
        <div className="mt-8 pt-3 bg-amber-50/50 rounded-xl p-2.5 border border-amber-100/80">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Private & Safe</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-500 font-normal">
            All files are processed in your browser. Nothing is uploaded.
          </p>
        </div>
      </aside>
    </>
  );
}
