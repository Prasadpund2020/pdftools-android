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
import TikTokSaverTool from "@/components/tools/tiktok-saver/TikTokSaverTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("downloaders", "tiktok-saver") ||
    getToolBySlug("tiktok-saver");

  if (!tool) {
    return {
      title: "TikTok Saver No Watermark — Download HD Video & MP3 Audio | FileLab",
      description:
        "Save high quality TikTok videos without platform watermarks. Extract viral audio tracks and cover posters in 1080p MP4. Free & fast.",
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
      url: `/all-tools/downloaders/tiktok-saver`,
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
      canonical: `/all-tools/downloaders/tiktok-saver`,
    },
  };
}

export default function TikTokSaverPage() {
  const category = "downloaders";
  const slug = "tiktok-saver";

  const tool =
    getToolBySlugs(category, slug) ||
    getToolBySlug(slug) || {
      id: "tiktok-saver",
      title: "TikTok Saver No Watermark",
      category: "downloaders",
      description:
        "Save high quality TikTok videos without platform watermarks.",
      clayColor: "clay-cyan",
      iconType: "music",
      badgeText: "No Watermark",
      actionText: "Save TikTok",
      isPrimaryAction: true,
      acceptedFormats: "URL Link",
    };

  const catInfo = getCategoryInfo(category);
  const relatedTools = getToolsByCategory(category)
    .filter((t: ToolItem) => t.id !== tool.id)
    .slice(0, 4);

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TikTok Saver No Watermark — FileLab",
    description: tool.description,
    url: `${SITE_URL}/all-tools/downloaders/tiktok-saver`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Watermark-free 1080p HD TikTok MP4 saving",
      "Direct viral audio sound extraction in 320 kbps MP3",
      "Clean original video stream with zero ads or third-party banners",
      "Compatible with mobile devices (iOS/Android) and desktop browsers",
    ],
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              label: catInfo ? catInfo.name : "Downloaders",
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
              <span className="w-8 h-8 border-[3px] border-cyan-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading TikTok Saver Studio…
              </span>
            </div>
          </div>
        }
      >
        <TikTokSaverTool />
      </Suspense>

      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; Clean Video Extraction
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab TikTok Saver allows you to extract full high-definition TikTok videos without the distracting bouncing logo watermark. Convert choreography clips, food recipes, educational tutorials, and viral sound tracks directly to MP4 and MP3 with fast, private client-side dispatch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Watermarks
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enjoy unobstructed, original video frames without the corner TikTok handles or outro sequences.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Viral Audio Grabber
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract background songs and vocal trends directly into high-fidelity 320 kbps MP3 files.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Device Versatility
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seamlessly works across Safari, Chrome, iOS Safari, Android Chrome, and all major desktop platforms.
            </p>
          </div>
        </div>
      </div>

      {relatedTools.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Related {catInfo?.name || "Downloader"} Tools
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
