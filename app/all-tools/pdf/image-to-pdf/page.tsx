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
import ImageToPdfTool from "@/components/tools/image-to-pdf/ImageToPdfTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("pdf", "image-to-pdf") || getToolBySlug("image-to-pdf");

  if (!tool) {
    return {
      title: "Image to PDF Converter — Free & Private | FileLab",
      description:
        "Convert photos, receipts, JPG, and PNG images into high quality PDF documents. 100% client-side WebAssembly, zero server uploads.",
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
      url: `/all-tools/pdf/image-to-pdf`,
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
      canonical: `/all-tools/pdf/image-to-pdf`,
    },
  };
}

export default function ImageToPdfPage() {
  const category = "pdf";
  const slug = "image-to-pdf";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "image-to-pdf",
    title: "Image to PDF",
    category: "pdf",
    description:
      "Convert photos, scans, PNG and JPG images into clean PDF documents.",
    clayColor: "clay-orange",
    iconType: "photo",
    badgeText: "PDF",
    actionText: "Generate PDF",
    isPrimaryAction: true,
    acceptedFormats: ".jpg,.jpeg,.png,.webp",
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
    url: `${SITE_URL}/all-tools/pdf/image-to-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with WebAssembly and Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side WebAssembly & Canvas image rasterization",
      "Zero server uploads — 100% private memory sandbox",
      "Multi-image drag & drop page sequencing and individual 90° rotation",
      "Configurable page formats (A4, US Letter, Fit to Image) and margins",
      "Real-time DPI balance and quality compression engine",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                Loading Image to PDF Desk…
              </span>
            </div>
          </div>
        }
      >
        <ImageToPdfTool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; High-Fidelity PDF Assembly
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Image to PDF is a tactile executive-grade staging desk for converting receipts, contract scans,
          presentation slides, and identification photos into unified, print-ready PDF files. Built on top of
          WebAssembly and the HTML5 Canvas 2D engine, every image is scaled, oriented, and compressed directly
          inside your browser&apos;s memory sandbox with zero network uploads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500">
              Images are transformed into vector PDF streams entirely client-side using pdf-lib. No external API calls.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Precision Page Geometry
            </div>
            <p className="text-xs text-slate-500">
              Customize page format (A4, US Letter, Fit), page orientation (Auto, Portrait, Landscape), and margin spacing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Live Compression Balancer
            </div>
            <p className="text-xs text-slate-500">
              Tune DPI quality balance from 40% to 100% with real-time output size estimation before compiling.
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
