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
import PdfMergeTool from "@/components/tools/pdf-merge/PdfMergeTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("pdf", "pdf-merge") || getToolBySlug("pdf-merge");

  if (!tool) {
    return {
      title: "PDF Merge — Combine Multiple PDF Files Online Free | FileLab",
      description:
        "Merge multiple PDF files into one clean document. Drag and drop, reorder pages, rotate sheets, and download instantly with 100% private in-browser processing.",
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
      url: `/all-tools/pdf/pdf-merge`,
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
      canonical: `/all-tools/pdf/pdf-merge`,
    },
  };
}

export default function PdfMergePage() {
  const category = "pdf";
  const slug = "pdf-merge";

  const tool =
    getToolBySlugs(category, slug) ||
    getToolBySlug(slug) || {
      id: "pdf-merge",
      title: "PDF Merge",
      category: "pdf",
      description:
        "Combine multiple PDF files into one clean, unified document in seconds.",
      clayColor: "clay-blue",
      iconType: "merge",
      badgeText: "PDF Merge",
      actionText: "Merge PDFs",
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
    name: "PDF Merge Studio — FileLab",
    description: tool.description,
    url: `${SITE_URL}/all-tools/pdf/pdf-merge`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with WebAssembly and client-side PDF processing support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Combine unlimited PDF files into one unified document",
      "Interactive drag-and-drop file reordering and 90-degree page rotation",
      "Optional consecutive page numbering (Page X of Y)",
      "Standardize page sizes to A4 or US Letter",
      "100% Client-side zero-server upload architecture",
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

      {/* Main Tool Workspace */}
      <Suspense
        fallback={
          <div className="w-full min-h-[500px] flex items-center justify-center bg-[#faf8f5] rounded-3xl border border-stone-200">
            <div className="flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading PDF Merge Studio…
              </span>
            </div>
          </div>
        }
      >
        <PdfMergeTool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; Client-Side Document Concatenation
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab PDF Merge combines financial statements, legal contracts, slide decks, and multi-page receipts directly in your browser. Using modern WebAssembly bytecode, memory buffers are merged in client RAM without transmitting proprietary data to third-party cloud servers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your confidential PDF documents remain strictly inside your device. No cloud storage, no retention, zero leaks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Flexible Sequencing
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Easily reorder files, rotate oriented sheets, and optionally inject consecutive &ldquo;Page X of Y&rdquo; footer numbers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cross-Platform Ready
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Merged PDFs adhere strictly to ISO 32000 specifications for flawless rendering in Acrobat, macOS Preview, and browsers.
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
