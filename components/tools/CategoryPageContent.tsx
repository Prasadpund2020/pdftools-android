"use client";

import React, { useState, useMemo } from "react";
import { ToolItem } from "@/types/tools";
import CategoryHero from "@/components/tools/CategoryHero";
import CategoryTabs from "@/components/tools/CategoryTabs";
import ToolCard from "@/components/tools/ToolCard";

interface CategoryPageContentProps {
  category: string;
  categoryName: string;
  departmentNumber: string;
  description: string;
  initialTools: ToolItem[];
}

export default function CategoryPageContent({
  category,
  categoryName,
  departmentNumber,
  description,
  initialTools,
}: CategoryPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return initialTools;
    const q = searchQuery.toLowerCase().trim();
    return initialTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.acceptedFormats && t.acceptedFormats.toLowerCase().includes(q)) ||
        (t.actionText && t.actionText.toLowerCase().includes(q))
    );
  }, [searchQuery, initialTools]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-4 lg:py-4.5">
      {/* Enhanced Category Atelier Hero */}
      <CategoryHero
        category={category}
        categoryName={categoryName}
        departmentNumber={departmentNumber}
        description={description}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        toolCount={initialTools.length}
      />

      {/* Category Tabs for Fast Switching */}
      <div className="mb-3 sm:mb-4">
        <CategoryTabs activeCategory={category} />
      </div>

      {/* Main Tools Workspace */}
      <div id="category-tools-grid" className="scroll-mt-6">
        {searchQuery ? (
          <div>
            {/* Filter Status Bar */}
            <div className="mb-6 p-4 rounded-2xl bg-white/80 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
                <span>
                  Found{" "}
                  <strong className="text-stone-900 font-bold">
                    {filteredTools.length}
                  </strong>{" "}
                  {filteredTools.length === 1 ? "tool" : "tools"} matching &ldquo;
                  {searchQuery}&rdquo; in {categoryName}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                Clear search
              </button>
            </div>

            {/* Empty Search State */}
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
                  No {categoryName} found matching &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                  Try another keyword like &quot;Word&quot;, &quot;Merge&quot;, or &quot;Sign&quot;, or view all {categoryName}.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-xl shadow-xs transition-colors"
                >
                  View All {initialTools.length} {categoryName}
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
          /* Normal Category Tools Grid */
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Available {categoryName}
                </h2>
              </div>
              <span className="text-xs font-medium text-stone-400">
                {initialTools.length} utilities ready in browser
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {initialTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
