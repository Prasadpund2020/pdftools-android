import { ToolItem, ToolCategory } from "@/types/tools";
import { ALL_TOOLS, CATEGORIES } from "@/data/tools";

// ─── Category slug mapping ─────────────────────────────────────────────────────
const CATEGORY_SLUG_MAP: Record<ToolCategory, string> = {
  all: "all",
  pdf: "pdf",
  image: "image",
  "video-audio": "video-audio",
  downloaders: "downloaders",
  "edit-convert": "edit-convert",
  more: "more",
};

const SLUG_TO_CATEGORY: Record<string, ToolCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([k, v]) => [v, k as ToolCategory])
) as Record<string, ToolCategory>;

// ─── URL generators ─────────────────────────────────────────────────────────────

/**
 * Returns the canonical URL path for a tool.
 * e.g. "/all-tools/pdf/pdf-to-word"
 */
export function getToolUrl(tool: ToolItem): string {
  const catSlug = getCategorySlug(tool.category);
  return `/all-tools/${catSlug}/${tool.id}`;
}

/**
 * Returns the canonical URL path for a category page.
 * e.g. "/all-tools/pdf"
 */
export function getCategoryUrl(category: ToolCategory): string {
  if (category === "all") return "/all-tools";
  return `/all-tools/${getCategorySlug(category)}`;
}

export function getCategorySlug(category: ToolCategory): string {
  return CATEGORY_SLUG_MAP[category] || category;
}

export function categoryFromSlug(slug: string): ToolCategory | null {
  return SLUG_TO_CATEGORY[slug] ?? null;
}

// ─── Data lookups ───────────────────────────────────────────────────────────────

/**
 * Find a tool by its slug (id).
 */
export function getToolBySlug(slug: string): ToolItem | undefined {
  return ALL_TOOLS.find((t) => t.id === slug);
}

/**
 * Find a tool by category slug + tool slug.
 */
export function getToolBySlugs(
  categorySlug: string,
  toolSlug: string
): ToolItem | undefined {
  const category = categoryFromSlug(categorySlug);
  if (!category) return undefined;
  return ALL_TOOLS.find(
    (t) =>
      t.id === toolSlug &&
      (category === "edit-convert"
        ? t.category === "edit-convert" || t.category === "more"
        : t.category === category)
  );
}

/**
 * Get all tools for a given category slug.
 */
export function getToolsByCategory(categorySlug: string): ToolItem[] {
  const category = categoryFromSlug(categorySlug);
  if (!category || category === "all") return ALL_TOOLS;
  if (category === "edit-convert") {
    return ALL_TOOLS.filter(
      (t) => t.category === "edit-convert" || t.category === "more"
    );
  }
  return ALL_TOOLS.filter((t) => t.category === category);
}

/**
 * Get the CategoryInfo for a slug.
 */
export function getCategoryInfo(categorySlug: string) {
  const category = categoryFromSlug(categorySlug);
  if (!category) return undefined;
  return CATEGORIES.find((c) => c.id === category);
}

/**
 * Determine whether a tool is published and ready for public indexing.
 * Considers explicit isPublished / status, falls back to isPrimaryAction for backward compatibility,
 * and ensures status !== "draft" && status !== "coming-soon".
 */
export function isToolPublished(tool: ToolItem): boolean {
  if (tool.status === "draft" || tool.status === "coming-soon") return false;
  if (tool.isPublished === false) return false;
  if (tool.isPublished === true) return true;
  return Boolean(tool.isPrimaryAction);
}

/**
 * Get all published tools from the central registry.
 */
export function getPublishedTools(): ToolItem[] {
  return ALL_TOOLS.filter(isToolPublished);
}

// ─── SEO helpers ────────────────────────────────────────────────────────────────

const CATEGORY_SEO: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  pdf: {
    title: "PDF Tools",
    description:
      "Free client-side PDF tools: convert to Word, merge, split, compress, protect, and organize PDF pages — all in your browser with zero uploads.",
    keywords: [
      "pdf to word",
      "merge pdf",
      "compress pdf",
      "split pdf",
      "pdf tools online free",
      "pdf converter",
    ],
  },
  image: {
    title: "Image Tools",
    description:
      "Compress, resize, crop, watermark, and convert images between JPG, PNG, and WebP formats entirely client-side in your browser.",
    keywords: [
      "compress image",
      "resize image",
      "jpg to png",
      "remove background",
      "image compressor online",
    ],
  },
  "video-audio": {
    title: "Video & Audio Tools",
    description:
      "Extract audio from video, trim clips, boost volume, mute tracks, and convert between audio formats — all processed locally in your browser.",
    keywords: [
      "video to mp3",
      "trim video online",
      "audio converter",
      "volume booster",
      "extract audio from video",
    ],
  },
  downloaders: {
    title: "Media Downloaders",
    description:
      "Download videos from YouTube, Instagram, TikTok, and Twitter/X in HD quality directly in your browser.",
    keywords: [
      "youtube downloader",
      "instagram reels download",
      "tiktok saver",
      "twitter video download",
    ],
  },
  "edit-convert": {
    title: "Edit & Convert Tools",
    description:
      "Convert Word to PDF, Excel to PDF, extract text with OCR, generate QR codes, and more — powerful conversion utilities running entirely in your browser.",
    keywords: [
      "word to pdf",
      "excel to pdf",
      "ocr scanner",
      "qr code generator",
      "epub to pdf",
    ],
  },
};

export function getCategorySeo(categorySlug: string) {
  return CATEGORY_SEO[categorySlug];
}

export function getToolSeo(tool: ToolItem) {
  const categoryLabel =
    CATEGORIES.find((c) => c.id === tool.category)?.name || "Tool";
  const cleanCat = categoryLabel.replace(" Tools", "");
  const description =
    tool.seoDescription ||
    `${tool.description} Free client-side tool with instant browser execution and zero file uploads.`;

  return {
    title: `${tool.title} — Free Online ${cleanCat} Tool`,
    description,
    keywords: [
      tool.title.toLowerCase(),
      tool.id.replace(/-/g, " "),
      `free ${tool.title.toLowerCase()} online`,
      `${tool.title.toLowerCase()} in browser`,
      `private ${tool.title.toLowerCase()}`,
      `client-side ${tool.title.toLowerCase()}`,
      `${cleanCat.toLowerCase()} tool`,
    ],
  };
}
