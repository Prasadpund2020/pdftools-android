"use client";

import React from "react";
import Link from "next/link";
import { ToolItem } from "@/types/tools";
import { QUICK_TOOLS } from "@/data/tools";
import { getToolUrl } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

interface QuickToolsClipboardProps {
  onSelectTool?: (tool: ToolItem) => void;
}

export default function QuickToolsClipboard({
  onSelectTool,
}: QuickToolsClipboardProps) {
  return (
    <aside className="relative w-full max-w-sm sm:max-w-md lg:w-64 mx-auto lg:mx-0 self-center lg:self-start mt-4 lg:mt-2 z-20 select-none flex-shrink-0">
      {/* Metal Bulldog Clip on Top of the Paper */}
      <div className="absolute -top-4 right-8 sm:right-10 z-30 flex flex-col items-center pointer-events-none">
        {/* Wire loop arms */}
        <div className="w-7 h-5 rounded-t-full border-2 border-slate-700 bg-transparent mb-[-2px]"></div>
        {/* Clip body */}
        <div className="w-10 h-4 bg-slate-900 rounded-sm shadow-md border-t border-slate-600 flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>

      {/* The Paper Document / Clipboard Sheet */}
      <div className="paper-shadow bg-gradient-to-b from-white to-stone-50 rounded-2xl sm:rounded-lg p-4 sm:p-5 pt-6 sm:pt-7 border border-stone-200/90 rotate-0 lg:rotate-[0.5deg]">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5 mb-1">
          <h3 className="font-serif italic font-bold text-base sm:text-lg text-slate-800 tracking-wide">
            Quick Tools
          </h3>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Fast Access
          </span>
        </div>

        {/* List of Fast Access Tools */}
        <ul className="divide-y divide-stone-100 text-xs">
          {QUICK_TOOLS.map((tool) => {
            const badgeBg = tool.quickBadge?.bg || "bg-slate-100";
            const badgeText = tool.quickBadge?.text || "text-slate-600";
            const toolUrl = getToolUrl(tool);

            return (
              <li key={tool.id}>
                <Link
                  href={toolUrl}
                  onClick={() => onSelectTool?.(tool)}
                  className="py-2.5 sm:py-2 flex items-center justify-between hover:bg-stone-100/70 active:bg-stone-100 px-2 rounded-xl sm:rounded cursor-pointer group transition-colors no-underline"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 sm:w-6 sm:h-6 rounded-lg sm:rounded-md ${badgeBg} ${badgeText} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform flex-shrink-0`}
                    >
                      <ToolIcon iconType={tool.iconType} className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </span>
                    <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                      {tool.title}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
