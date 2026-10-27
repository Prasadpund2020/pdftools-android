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
import SignPdfTool from "@/components/tools/SignPdfTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolBySlugs("pdf", "sign-pdf") || getToolBySlug("sign-pdf");

  if (!tool) {
    return {
      title: "Sign PDF Online — Free & Secure Electronic Signatures — FileLab",
      description: "Sign PDF documents online for free. Draw, type, or stamp verifiable digital signatures with zero server uploads.",
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
      url: `/all-tools/pdf/sign-pdf`,
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
      canonical: `/all-tools/pdf/sign-pdf`,
    },
  };
}

export default function SignPdfPage() {
  const category = "pdf";
  const slug = "sign-pdf";
  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "sign-pdf",
    title: "Sign PDF",
    category: "pdf",
    description: "Draw, type, or stamp verifiable digital signatures.",
    clayColor: "clay-green",
    iconType: "sign",
    badgeText: "E-Sign",
    actionText: "Sign Document",
    isPrimaryAction: true,
    acceptedFormats: ".pdf",
  };

  const catInfo = getCategoryInfo(category);
  const relatedTools = getToolsByCategory(category)
    .filter((t: ToolItem) => t.id !== tool.id)
    .slice(0, 4);

  // Schema.org WebApplication structured data for SEO rich snippets
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${SITE_URL}/all-tools/pdf/sign-pdf`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser with WebAssembly and Web Worker support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side cryptographic execution",
      "Zero server uploads - 100% private sandbox",
      "Archival ink rendering (Matte Black, Archival Navy, Notary Crimson)",
      "Interactive signature placement & live PDF export",
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

      {/* Main Tool Workspace: Physical Desk Inspired Sign PDF Studio */}
      <Suspense
        fallback={
          <div className="w-full min-h-[500px] flex items-center justify-center bg-[#faf8f5] rounded-3xl border border-stone-200">
            <div className="flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">Loading Sign PDF Studio...</span>
            </div>
          </div>
        }
      >
        <SignPdfTool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} & Cryptographic Signatures
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Sign PDF is an executive-grade e-signing studio running entirely within your browser
          using WebAssembly and client-side PDF document manipulation. Your sensitive financial, employment,
          and legal agreements never leave your device or get sent to third-party servers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500">
              Your document is modified locally in browser memory using HTML5 Canvas &amp; pdf-lib.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Verifiable Audit Certificate
            </div>
            <p className="text-xs text-slate-500">
              Each signed export includes an embedded SHA-256 integrity hash and timestamp seal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Free &amp; Unlimited
            </div>
            <p className="text-xs text-slate-500">
              No signatures quotas, account registration, or watermarks.
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