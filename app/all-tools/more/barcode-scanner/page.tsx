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
import BarcodeScannerTool from "@/components/tools/barcode-scanner/BarcodeScannerTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("more", "barcode-scanner") || getToolBySlug("barcode-scanner");

  if (!tool) {
    return {
      title: "Barcode Scanner & Maker — Free & Private | FileLab",
      description:
        "Scan barcodes using your camera or generate retail UPC, EAN, and Code128 barcodes online. Fast, clean vector barcode generator in your browser.",
    };
  }

  const seo = getToolSeo(tool);

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${tool.title} — FileLab`,
      description: seo.description,
      type: "website",
      url: `/all-tools/more/barcode-scanner`,
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
      canonical: `/all-tools/more/barcode-scanner`,
    },
  };
}

export default function BarcodeScannerPage() {
  const category = "more";
  const slug = "barcode-scanner";

  const tool =
    getToolBySlugs(category, slug) || getToolBySlug(slug) || {
      id: "barcode-scanner",
      title: "Barcode Scanner & Maker",
      category: "more",
      description:
        "Scan camera barcodes or generate UPC/EAN retail barcodes instantly.",
      clayColor: "clay-orange",
      iconType: "barcode",
      quickBadge: { bg: "bg-orange-100", text: "text-orange-500" },
    };

  const catInfo = getCategoryInfo(category);
  const relatedTools = getToolsByCategory(category)
    .filter((t: ToolItem) => t.id !== tool.id)
    .slice(0, 4);

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${SITE_URL}/all-tools/more/barcode-scanner`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All (Browser-based)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side barcode generation",
      "Zero server uploads — 100% private",
      "SVG vector export",
      "Camera-based barcode scanning",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />

      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "FileLab Studio", href: "/" },
            { label: "All Tools", href: "/all-tools" },
            {
              label: catInfo ? catInfo.name : "More Tools",
              href: `/all-tools/${category}`,
            },
            { label: tool.title },
          ]}
        />
      </div>

      <Suspense
        fallback={
          <div className="w-full min-h-[500px] flex items-center justify-center bg-[#faf8f5] rounded-3xl border border-stone-200">
            <div className="flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-[3px] border-orange-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading Barcode Studio…
              </span>
            </div>
          </div>
        }
      >
        <div className="bg-white/90 rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8">
          <BarcodeScannerTool />
        </div>
      </Suspense>

      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title}
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          FileLab Barcode Scanner & Maker runs entirely within your browser.
          Generate CODE128, EAN-13, UPC-A, ISBN, and CODE39 barcodes with
          customizable styling. Scan barcodes using your camera — all
          processing is local, nothing is uploaded.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-stone-500">
              Barcodes are generated and scanned locally in browser memory.
              Nothing is uploaded to any server.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              SVG Export
            </div>
            <p className="text-xs text-stone-500">
              Download your barcode as a scalable SVG vector file for print and
              digital use.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Multiple Formats
            </div>
            <p className="text-xs text-stone-500">
              Supports CODE128, EAN-13, UPC-A, ISBN, and CODE39 barcode formats.
            </p>
          </div>
        </div>
      </div>

      {relatedTools.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Related {catInfo?.name || "More"} Tools
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
