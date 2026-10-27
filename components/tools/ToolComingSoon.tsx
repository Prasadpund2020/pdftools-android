"use client";

import React from "react";
import Link from "next/link";
import { ToolItem } from "@/types/tools";
import { getToolUrl } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

interface ToolComingSoonProps {
  tool: ToolItem;
}

export default function ToolComingSoon({ tool }: ToolComingSoonProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tool Hero Card */}
      <div className="relative bg-gradient-to-br from-white/95 via-stone-50/90 to-white/95 rounded-3xl border border-stone-200/80 shadow-lg p-6 sm:p-8 mb-6 overflow-hidden">
        {/* Subtle Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #1e293b 0.8px, transparent 0.8px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-start gap-5">
          {/* Large Clay Icon */}
          <div
            className={`clay-btn ${tool.clayColor} w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}
          >
            <ToolIcon iconType={tool.iconType} className="w-10 h-10" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {tool.title}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/60">
                Free
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              {tool.description}
            </p>

            {/* Format Support Tags */}
            {tool.acceptedFormats && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Accepts:
                </span>
                {tool.acceptedFormats.split(",").map((fmt) => (
                  <span
                    key={fmt}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 border border-stone-200/60 uppercase"
                  >
                    {fmt.trim().replace(".", "")}
                  </span>
                ))}
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                100% Client-Side
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Zero Uploads
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant Processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon State */}
      <div className="bg-gradient-to-b from-white/90 to-stone-50/80 rounded-3xl border-2 border-dashed border-stone-300/60 p-8 sm:p-12 text-center">
        {/* Decorative Construction Icon */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-inner">
          <span className="text-4xl" role="img" aria-label="Under construction">
            🛠️
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-2">
          Tool Interface Coming Soon
        </h2>

        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
          The interactive {tool.title} workspace is being crafted. The full processing engine
          will be available here — drop files, configure options, and download results.
        </p>

        {/* Visual Skeleton Placeholder */}
        <div className="max-w-md mx-auto space-y-3 mb-6">
          {/* Upload zone skeleton */}
          <div className="h-36 rounded-2xl bg-stone-100/60 border border-stone-200/50 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-stone-200/80 animate-pulse"></div>
            <div className="w-32 h-3 rounded-full bg-stone-200/80 animate-pulse"></div>
            <div className="w-24 h-2 rounded-full bg-stone-200/60 animate-pulse"></div>
          </div>
          {/* Options bar skeleton */}
          <div className="flex gap-2">
            <div className="flex-1 h-10 rounded-xl bg-stone-100/60 border border-stone-200/50 animate-pulse"></div>
            <div className="w-28 h-10 rounded-xl bg-stone-100/60 border border-stone-200/50 animate-pulse"></div>
          </div>
          {/* Action button skeleton */}
          <div className="h-12 rounded-xl bg-stone-200/50 border border-stone-200/40 animate-pulse"></div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/all-tools"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all no-underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse All Tools
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 text-xs font-bold border border-stone-200 shadow-xs hover:shadow-md active:scale-95 transition-all no-underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
