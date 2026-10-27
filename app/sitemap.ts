import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { ALL_TOOLS, CATEGORIES } from "@/data/tools";
import { getCategorySlug, isToolPublished } from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;
const DEFAULT_DATE = new Date("2026-10-24T00:00:00.000Z");

/**
 * Safely read file modification timestamp without falling back to `new Date()` on each invocation.
 * Scoped explicitly to the `app` directory to avoid whole-project Turbopack tracing.
 */
function getAppFileLastModified(subPath: string): Date {
  try {
    const fullPath = path.join(process.cwd(), "app", subPath);
    if (fs.existsSync(fullPath)) {
      return fs.statSync(fullPath).mtime;
    }
  } catch {
    // fallback if file stat fails
  }
  return DEFAULT_DATE;
}

/**
 * Verifies that a tool's dedicated route page exists on disk.
 */
function routePageExists(catSlug: string, toolId: string): boolean {
  try {
    const pagePath = path.join(
      process.cwd(),
      "app",
      "all-tools",
      catSlug,
      toolId,
      "page.tsx"
    );
    return fs.existsSync(pagePath);
  } catch {
    return false;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Homepage
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    lastModified: getAppFileLastModified("page.tsx"),
    changeFrequency: "weekly",
    priority: 1.0,
  };

  // 2. All Tools Index
  const allToolsEntry: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}/all-tools`,
    lastModified: getAppFileLastModified("all-tools/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9,
  };

  // 3. Filter published tools: must be marked published/ready AND have an implemented route page on disk
  const publishedTools = ALL_TOOLS.filter((tool) => {
    if (!isToolPublished(tool)) return false;
    const catSlug = getCategorySlug(tool.category);
    return routePageExists(catSlug, tool.id);
  });

  // Track active categories containing at least one published tool
  const activeCategorySlugs = new Set(
    publishedTools.map((tool) => getCategorySlug(tool.category))
  );

  // 4. Category Pages (only active categories with functional tools)
  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES
    .filter(
      (cat) =>
        cat.id !== "all" && activeCategorySlugs.has(getCategorySlug(cat.id))
    )
    .map((cat) => {
      const catSlug = getCategorySlug(cat.id);
      return {
        url: `${BASE_URL}/all-tools/${catSlug}`,
        lastModified: getAppFileLastModified("all-tools/[category]/page.tsx"),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

  // 5. Individual Published Tool Pages
  const toolEntries: MetadataRoute.Sitemap = publishedTools.map((tool) => {
    const catSlug = getCategorySlug(tool.category);
    const toolSubPath = path.join("all-tools", catSlug, tool.id, "page.tsx");
    const lastModified = tool.lastModified
      ? new Date(tool.lastModified)
      : getAppFileLastModified(toolSubPath);

    return {
      url: `${BASE_URL}/all-tools/${catSlug}/${tool.id}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [homeEntry, allToolsEntry, ...categoryEntries, ...toolEntries];
}
