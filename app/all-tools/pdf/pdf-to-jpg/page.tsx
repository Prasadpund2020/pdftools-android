import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ToolItem } from "@/types/tools";
import {
  getToolBySlugs,
  getToolBySlug,
  getCategoryInfo,
  getToolsByCategory,
  getToolSeo,
} from "@/lib/tools";
import PdfToJpgTool from "@/components/tools/pdf-to-jpg/PdfToJpgTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("pdf", "pdf-to-jpg") || getToolBySlug("pdf-to-jpg");

  if (!tool) {
    return {
      title: "PDF to JPG Converter — Convert PDF Pages to Images | FileLab",
      description:
        "Convert PDF pages to high-resolution JPG, PNG, and WebP images. 100% in-browser WebAssembly rasterization with zero server uploads.",
    };
  }

  const seo = getToolSeo(tool);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${tool.title} — FileLab`,
      description: seo.description,
      type: "website",
      url: `/all-tools/pdf/pdf-to-jpg`,
      images: [
        {
          url: "/images/all-tools-hero-banner.png",
          width: 1200,
          height: 630,
          alt: `${tool.title} — FileLab`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: seo.description,
      images: ["/images/all-tools-hero-banner.png"],
    },
    alternates: {
      canonical: `/all-tools/pdf/pdf-to-jpg`,
    },
  };
}

export default function PdfToJpgPage() {
  const category = "pdf";
  const slug = "pdf-to-jpg";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    category: "pdf",
    description:
      "Extract and convert high-resolution image pages from any PDF document.",
    clayColor: "clay-pink",
    iconType: "zoom-in",
    badgeText: "Hi-Res",
    actionText: "Extract Images",
    isPrimaryAction: true,
    acceptedFormats: ".pdf",
  };

  const catInfo = getCategoryInfo(category);
  const relatedTools = getToolsByCategory(category)
    .filter((t: ToolItem) => t.id !== tool.id)
    .slice(0, 4);

  // Schema.org WebApplication structured data
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${SITE_URL}/all-tools/pdf/pdf-to-jpg`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with WebAssembly and HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side vector rasterization via PDF.js WebAssembly",
      "Interactive proof stage grid with individual page selection and inspection",
      "Selectable raster densities: 72, 150, 300 (Print Ready), and 600 DPI",
      "Target output formats: JPG (92% quality), PNG (Lossless), and WebP",
      "In-memory ZIP archive packaging with instant browser download",
    ],
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Schema.org WebApplication JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "FileLab Studio", href: "/" },
            { label: "All Tools", href: "/all-tools" },
            {
              label: catInfo ? catInfo.name : "PDF Tools",
              href: `/all-tools/${category}`,
            },
            { label: tool.title },
          ]}
        />
      </div>

      {/* Main Tool Workspace: Physical Desk Metaphor */}
      <Suspense
        fallback={
          <div className="w-full min-h-[500px] flex items-center justify-center bg-[#faf8f5] rounded-3xl border border-stone-200">
            <div className="flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading PDF to JPG Rasterizer…
              </span>
            </div>
          </div>
        }
      >
        <PdfToJpgTool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; High-DPI Vector Rasterization
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab PDF to JPG converts vector PDF pages into high-density raster graphics entirely within
          your browser using PDF.js WebAssembly and the HTML5 2D Canvas pipeline. Whether converting full multi-page
          catalogs, contracts, or presentation decks, every pixel is decoded in local memory with zero server uploads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500">
              PDF documents never leave your device. All rasterization and color space conversions run in local RAM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Up to 600 DPI Print Clarity
            </div>
            <p className="text-xs text-slate-500">
              Render at 72 DPI for web use, 300 DPI for press-ready proofs, or up to 600 DPI for archival reproductions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Client ZIP Packaging
            </div>
            <p className="text-xs text-slate-500">
              Selected pages are bundled into a compressed ZIP file in memory, ready for instant one-click download.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Shelf */}
      {relatedTools.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Related {catInfo?.name || "PDF"} Tools
              </h3>
              <p className="text-xs text-slate-500">
                More client-side utilities from this suite
              </p>
            </div>
            <Link
              href={`/all-tools/${category}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 no-underline"
            >
              View all ({getToolsByCategory(category).length})
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((relTool: ToolItem) => (
              <ToolCard key={relTool.id} tool={relTool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
