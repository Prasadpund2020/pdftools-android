"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolItem, ToolCategory } from "@/types/tools";
import { ALL_TOOLS, CATEGORIES } from "@/data/tools";
import ToolIcon from "@/components/ToolIcon";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolItem) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectTool,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global key listener for Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter tools
  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    const matchesQuery =
      tool.title.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Handle arrow key selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredTools.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredTools.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        onSelectTool(filteredTools[selectedIndex]);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-slate-100 flex-shrink-0">
          <svg
            className="w-5 h-5 text-slate-400 mr-2.5 sm:mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools (e.g. compress, merge, pdf to word, mp3...)"
            className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex-shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-50/80 border-b border-slate-100 overflow-x-auto text-xs no-scrollbar flex-shrink-0 select-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-slate-800 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/60"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[55vh] sm:max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-900 shadow-xs"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`clay-btn ${tool.clayColor} w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs`}
                    >
                      <ToolIcon iconType={tool.iconType} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs truncate">
                          {tool.title}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200/60 text-slate-600 uppercase">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 pl-2 flex-shrink-0">
                    ↵
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No tools matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with ↑ ↓ and press Enter</span>
          <span>33 Tools Available</span>
        </div>
      </div>
    </div>
  );
}
