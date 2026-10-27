"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";

export default function AllToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Active nav state
  const isAllToolsPage = pathname.startsWith("/all-tools");
  const isHome = pathname === "/";

  return (
    <>
      <div className="relative z-10 w-full min-h-screen flex flex-col select-none overflow-x-hidden">
        {/* ─── Shared Navbar ─────────────────────────────────────────── */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-1.5 sm:pb-3 flex items-center justify-between gap-2 sm:gap-4 select-none">
          {/* Brand */}
          <Link href="/" className="flex items-center cursor-pointer group flex-shrink-0 no-underline hover:opacity-95 transition-opacity">
            <BrandLogo className="h-8 sm:h-9 md:h-10 w-auto" />
          </Link>

          {/* Nav Links + Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home link */}
            <Link
              href="/"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all no-underline ${
                isHome
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Desk
            </Link>

            {/* All Tools link */}
            <Link
              href="/all-tools"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all no-underline ${
                isAllToolsPage
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-stone-100"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              All Tools
            </Link>

            {/* Settings gear */}
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white/80 border border-stone-200/80 text-slate-500 flex items-center justify-center hover:text-slate-800 hover:bg-white transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* ─── Page Content ──────────────────────────────────────────── */}
        <main className="flex-1">
          {children}
        </main>

        {/* ─── Footer ────────────────────────────────────────────────── */}
        <Footer />
      </div>

      {/* ─── Mobile Bottom Navigation ────────────────────────────────── */}
      <nav
        className="fixed bottom-3 left-4 right-4 z-40 md:hidden bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl rounded-2xl p-1.5 flex items-center justify-around select-none"
        aria-label="Mobile Navigation"
      >
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all no-underline ${
            isHome
              ? "bg-slate-800 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold mt-0.5">Desk</span>
        </Link>

        <Link
          href="/all-tools"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all no-underline ${
            isAllToolsPage
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-[10px] font-bold mt-0.5">All Tools</span>
        </Link>

        <Link
          href="/all-tools"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all no-underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-bold mt-0.5">Search</span>
        </Link>
      </nav>
    </>
  );
}
