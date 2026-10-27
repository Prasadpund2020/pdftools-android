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
import TwitterMediaTool from "@/components/tools/twitter-media/TwitterMediaTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("downloaders", "twitter-media") ||
    getToolBySlug("twitter-media");

  if (!tool) {
    return {
      title: "Twitter / X Video Downloader — Save X Videos & GIFs in 1080p MP4 | FileLab",
      description:
        "Download videos and animated GIFs from Twitter / X in 1080p, 720p HD MP4 format. Free online browser downloader with zero ads.",
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
      url: `/all-tools/downloaders/twitter-media`,
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
      canonical: `/all-tools/downloaders/twitter-media`,
    },
  };
}

export default function TwitterMediaPage() {
  const category = "downloaders";
  const slug = "twitter-media";

  const tool =
    getToolBySlugs(category, slug) ||
    getToolBySlug(slug) || {
      id: "twitter-media",
      title: "Twitter / X Video Downloader",
      category: "downloaders",
      description:
        "Grab MP4 videos and GIFs directly from Twitter / X status URLs.",
      clayColor: "clay-blue",
      iconType: "share",
      badgeText: "X / Twitter MP4",
      actionText: "Download Video",
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
    name: "Twitter / X Video Downloader — FileLab",
    description: tool.description,
    url: `${SITE_URL}/all-tools/downloaders/twitter-media`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "1080p Full HD and 720p Twitter / X MP4 video downloads",
      "Animated GIF loop conversion and extraction",
      "Stereo audio MP3 track extraction",
      "Zero account logins or developer API keys required",
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
              <span className="w-8 h-8 border-[3px] border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading Twitter / X Video Downloader…
              </span>
            </div>
          </div>
        }
      >
        <TwitterMediaTool />
      </Suspense>

      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; Social Video Preservation
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Twitter / X Video Downloader extracts full resolution MP4 video streams, high-framerate clips, and looping GIFs directly from public post URLs. Save viral memes, breaking news footage, and keynote speeches directly into your personal media library with complete privacy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Crystal 1080p Bitrate
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Streams are parsed directly from primary content distribution edges to maintain original color dynamics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              True GIF Transcoding
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Convert Twitter looping clips directly into portable `.gif` graphic files with endless looping playback.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Tracking
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              No analytics cookies, no required login authentication, and zero retention of queried post URLs.
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
