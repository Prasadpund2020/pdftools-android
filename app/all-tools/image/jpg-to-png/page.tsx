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
import JpgToPngTool from "@/components/tools/jpg-to-png/JpgToPngTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("image", "jpg-to-png") || getToolBySlug("jpg-to-png");

  if (!tool) {
    return {
      title: "JPG to PNG Converter — Free & Lossless | FileLab",
      description:
        "Convert JPG and JPEG photos to lossless transparent PNG format online for free. Batch conversion with instant ZIP download. 100% in-browser processing.",
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
      url: `/all-tools/image/jpg-to-png`,
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
      canonical: `/all-tools/image/jpg-to-png`,
    },
  };
}

export default function JpgToPngPage() {
  const category = "image";
  const slug = "jpg-to-png";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "jpg-to-png",
    title: "JPG to PNG",
    category: "image",
    description: "Convert JPG photos to lossless transparent PNG format.",
    clayColor: "clay-green",
    iconType: "image",
    badgeText: ".PNG HD",
    actionText: "Convert to PNG",
    isPrimaryAction: true,
    acceptedFormats: ".jpg,.jpeg",
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
    url: `${SITE_URL}/all-tools/image/jpg-to-png`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser with HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Lossless in-memory conversion from JPEG discrete cosine matrices into truecolor PNG maps",
      "Batch parallel processing with multiple file selection",
      "One-click consolidated ZIP archive export",
      "100% Client-side sandbox execution with zero file uploads and complete privacy",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools",
        item: `${SITE_URL}/all-tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Image Tools",
        item: `${SITE_URL}/all-tools/image`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.title,
        item: `${SITE_URL}/all-tools/image/jpg-to-png`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why should I convert my JPG photos to PNG format?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PNG is a lossless raster format that prevents generation loss during repetitive edits in photo software like Photoshop or Figma. It also provides truecolor depth without JPEG blocking artifacts.",
        },
      },
      {
        "@type": "Question",
        name: "Can I convert multiple JPG files to PNG at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Drag and drop multiple JPG or JPEG photos into the dropzone. All files are converted in parallel inside your browser and can be saved individually or downloaded as a unified ZIP archive.",
        },
      },
      {
        "@type": "Question",
        name: "Are my photos uploaded to any server during conversion?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. FileLab processes all image conversions 100% inside your browser's local memory. Your files never leave your computer or phone.",
        },
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert JPG to PNG Online for Free",
    description: "Step-by-step instructions to convert JPG and JPEG photos to lossless PNG format.",
    totalTime: "PT1M",
    tool: [{ "@type": "HowTool", name: "Web Browser (Chrome, Firefox, Safari, Edge)" }],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select or drop your JPG files",
        text: "Select one or multiple JPG or JPEG files from your computer or phone.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Automatic in-browser transcoding",
        text: "FileLab decodes the JPEG streams and renders clean, uncompressed PNG rasters in local memory.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Save PNG files or download ZIP",
        text: "Click Save on any photo or Download All as ZIP to preserve the entire converted bundle.",
      },
    ],
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Schema.org WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "FileLab Studio", href: "/" },
            { label: "All Tools", href: "/all-tools" },
            {
              label: catInfo ? catInfo.name : "Image Tools",
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
              <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading JPG to PNG Studio…
              </span>
            </div>
          </div>
        }
      >
        <JpgToPngTool />
      </Suspense>

      {/* Educational & Architectural Feature Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          About {tool.title} &amp; Lossless Raster Packaging
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab JPG to PNG Converter transposes lossy JPEG files into Portable Network Graphics (PNG) standard containers. Unlike online converters that queue your personal photos on third-party cloud machines, our engine decodes and re-encodes rasters purely in your device&apos;s browser sandbox, protecting confidential documents, receipts, and personal photography.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              No Generation Loss
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lock in visual fidelity so future image edits won&apos;t compound compression artifacts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Parallel Batch Encoding
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Process multiple files at the same time and download everything in a neat ZIP folder.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Files are processed 100% in client-side memory without touching external servers.
            </p>
          </div>
        </div>
      </div>

      {/* Related Image Tools */}
      {relatedTools.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Explore More Image Utilities
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Complementary client-side tools processed directly in your browser
              </p>
            </div>
            <Link
              href="/all-tools/image"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              View all image tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
