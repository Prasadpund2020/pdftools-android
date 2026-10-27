"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenRecent: () => void;
  onOpenSettings: () => void;
}

export default function Navbar({
  onOpenSearch,
  onOpenRecent,
  onOpenSettings,
}: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAllTools = pathname.startsWith("/all-tools");

  return (
    <header className="w-full flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-5 select-none">
      {/* Brand Logo Section - Always links directly to Home Desk */}
      <Link href="/" className="flex items-center cursor-pointer group flex-shrink-0 no-underline hover:opacity-95 transition-opacity">
        <BrandLogo className="h-8 sm:h-9 md:h-10 w-auto" />
      </Link>

      {/* Desktop Search Bar with Ctrl+K */}
      <div className="hidden md:block w-full max-w-md lg:max-w-xl mx-2 lg:mx-4">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full relative flex items-center bg-white/90 backdrop-blur-md rounded-full px-4 py-2 sm:py-2.5 shadow-sm border border-slate-200 hover:border-slate-300 hover:bg-white text-left transition-all group"
          title="Search all tools (Ctrl+K)"
        >
          <svg className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          <span className="w-full bg-transparent border-none p-0 text-xs sm:text-sm text-slate-400 group-hover:text-slate-600 truncate transition-colors">
            Search tools (e.g. PDF, image, video...)
          </span>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 ml-2 group-hover:bg-slate-200/80 transition-colors flex-shrink-0">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Desktop Navigation Actions */}
      <nav className="hidden md:flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenRecent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-white/50"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span>Recent</span>
        </button>

        {/* Home Desk Link */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all no-underline ${
            isHome
              ? "bg-slate-800 text-white hover:bg-slate-900 shadow-xs"
              : "bg-white/70 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span>Desk</span>
        </Link>

        {/* All Tools Link */}
        <Link
          href="/all-tools"
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all no-underline ${
            isAllTools
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200/80 bg-white/50"
          }`}
        >
          All Tools (33)
        </Link>

        {/* Settings Cog */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-all"
          title="Settings"
          aria-label="Settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </nav>

      {/* Mobile Top Actions (Search, Direct Links, Settings) */}
      <div className="flex md:hidden items-center gap-1.5">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="p-2 text-slate-600 bg-white/80 hover:bg-white rounded-full shadow-xs border border-slate-200/80 transition-colors"
          title="Search tools"
          aria-label="Search tools"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
          </svg>
        </button>

        {/* Mobile View Switcher Pill */}
        <div className="flex items-center bg-white/80 border border-slate-200/80 p-0.5 rounded-full shadow-xs">
          <Link
            href="/"
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all no-underline ${
              isHome
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Desk
          </Link>
          <Link
            href="/all-tools"
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all no-underline ${
              isAllTools
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tools
          </Link>
        </div>

        {/* Mobile Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 text-slate-500 hover:text-slate-800 bg-white/80 hover:bg-white rounded-full shadow-xs border border-slate-200/80 transition-colors"
          title="Settings"
          aria-label="Settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </header>
  );
}
