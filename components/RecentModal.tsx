"use client";

import React from "react";
import { ToolItem } from "@/types/tools";
import ToolIcon from "@/components/ToolIcon";

interface RecentModalProps {
  isOpen: boolean;
  recentTools: ToolItem[];
  onClose: () => void;
  onSelectTool: (tool: ToolItem) => void;
  onClearRecent: () => void;
}

export default function RecentModal({
  isOpen,
  recentTools,
  onClose,
  onSelectTool,
  onClearRecent,
}: RecentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recent tools"
        className="relative z-10 w-full max-w-md max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 p-4 sm:p-5 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <h3 className="font-bold text-sm text-slate-800">
              Recently Used Tools
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="py-2 sm:py-3 max-h-[60vh] sm:max-h-72 overflow-y-auto divide-y divide-slate-100 flex-1">
          {recentTools.length > 0 ? (
            recentTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool);
                  onClose();
                }}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`clay-btn ${tool.clayColor} w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs`}
                  >
                    <ToolIcon iconType={tool.iconType} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-blue-500">
                  Open →
                </span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No recent tools yet. Select a tool to start!
            </div>
          )}
        </div>

        {recentTools.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClearRecent}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              Clear Recent History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
