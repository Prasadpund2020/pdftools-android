"use client";

import React from "react";
import Link from "next/link";
import { ToolItem } from "@/types/tools";
import { CATEGORIES } from "@/data/tools";
import { getCategoryUrl } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

interface CategoryTabsProps {
  activeCategory: string;
}

export default function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  const renderIcon = (id: string, className = "w-3.5 h-3.5") => {
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

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1.5 no-scrollbar select-none">
      {CATEGORIES.map((cat) => {
        const isActive =
          activeCategory === cat.id ||
          (activeCategory === "all" && cat.id === "all");

        const href = getCategoryUrl(cat.id);

        return (
          <Link
            key={cat.id}
            href={href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all border no-underline ${
              isActive
                ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border-stone-200/80 shadow-2xs"
            }`}
          >
            <span className={isActive ? "text-blue-400" : "text-slate-400"}>
              {renderIcon(cat.id)}
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
          </Link>
        );
      })}
    </div>
  );
}
