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
import PdfToWordTool from "@/components/tools/pdf-to-word/PdfToWordTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("pdf", "pdf-to-word") || getToolBySlug("pdf-to-word");

  if (!tool) {
    return {
      title: "PDF to Word Converter — Free & Private | FileLab",
      description:
        "Convert PDF files to editable Word documents. Preserves text, paragraphs, and basic formatting. 100% client-side, zero server uploads.",
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
      url: `/all-tools/pdf/pdf-to-word`,
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
      canonical: `/all-tools/pdf/pdf-to-word`,
    },
  };
}

export default function PdfToWordPage() {
  const category = "pdf";
  const slug = "pdf-to-word";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "pdf-to-word",
    title: "PDF to Word",
    category: "pdf",
    description:
      "Convert PDF files to editable Word documents. Preserves text, paragraphs, and basic formatting.",
    clayColor: "clay-red",
    iconType: "pdf-word",
    badgeText: ".DOCX",
    actionText: "Convert to Word",
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
    url: `${SITE_URL}/all-tools/pdf/pdf-to-word`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with WebAssembly and Web Worker support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side PDF text extraction",
      "Zero server uploads — 100% private sandbox",
      "Exports to DOCX (Open XML), RTF, or plain text",
      "Page range selection & formatting preservation",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Schema.org JSON-LD */}
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
              <span className="w-8 h-8 border-[3px] border-rose-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading PDF to Word Studio…
              </span>
            </div>
          </div>
        }
      >
        <div className="bg-white/90 rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8">
          <PdfToWordTool />
        </div>
      </Suspense>

      {/* Tool Information */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab PDF to Word runs entirely within your browser using the
          PDF.js rendering engine. Text is extracted page-by-page and assembled
          into a proper Word document (Open XML format) or RTF, preserving
          paragraph structure and line breaks. Your file is never uploaded to
          any server.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500">
              Your PDF is processed locally in browser memory using PDF.js
              WebAssembly. Nothing leaves your device.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Multiple Output Formats
            </div>
            <p className="text-xs text-slate-500">
              Export as DOCX (Open XML), RTF for older Word versions, or plain
              TXT for maximum compatibility.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Free &amp; Unlimited
            </div>
            <p className="text-xs text-slate-500">
              No page quotas, no account required, no watermarks on output.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
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
