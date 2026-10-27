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
import YouTubeDownloaderTool from "@/components/tools/youtube-downloader/YouTubeDownloaderTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("downloaders", "youtube-downloader") ||
    getToolBySlug("youtube-downloader");

  if (!tool) {
    return {
      title: "YouTube Downloader — Download 1080p Video & MP3 Audio Online | FileLab",
      description:
        "Save YouTube videos in high definition 1080p, 720p MP4 or high-fidelity 320 kbps MP3 format. Fast, private, zero ads, no watermark.",
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
      url: `/all-tools/downloaders/youtube-downloader`,
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
      canonical: `/all-tools/downloaders/youtube-downloader`,
    },
  };
}

export default function YouTubeDownloaderPage() {
  const category = "downloaders";
  const slug = "youtube-downloader";

  const tool =
    getToolBySlugs(category, slug) ||
    getToolBySlug(slug) || {
      id: "youtube-downloader",
      title: "YouTube Downloader",
      category: "downloaders",
      description:
        "Save YouTube videos directly in 1080p, 720p, or high-definition MP3 format.",
      clayColor: "clay-yellow",
      iconType: "play-down",
      badgeText: "1080p / MP3",
      actionText: "Download Video",
      isPrimaryAction: true,
      acceptedFormats: "URL Link",
    };

  const catInfo = getCategoryInfo(category);
  const relatedTools = getToolsByCategory(category)
    .filter((t: ToolItem) => t.id !== tool.id)
    .slice(0, 4);

  // Schema.org WebApplication structured data
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "YouTube Downloader Studio — FileLab",
    description: tool.description,
    url: `${SITE_URL}/all-tools/downloaders/youtube-downloader`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with HTML5 Video and streaming download support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "1080p Full HD and 720p 60FPS video stream downloads",
      "Studio quality 320 kbps and 192 kbps MP3 audio extraction",
      "Maximum resolution cover art thumbnail downloads",
      "Support for YouTube regular videos, Shorts, and Live stream archives",
      "Clean downloads with zero watermarks or sponsor banners",
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
              label: catInfo ? catInfo.name : "Downloaders",
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
              <span className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading YouTube Downloader Studio…
              </span>
            </div>
          </div>
        }
      >
        <YouTubeDownloaderTool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; High-Definition Stream Dispatch
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab YouTube Downloader allows you to extract crystal-clear 1080p Full HD MP4 video streams and 320 kbps high-bitrate MP3 audio directly onto your device. Enjoy high-speed chunked downloads without third-party pop-up advertisements, intrusive watermarks, or lossy audio re-encoding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Multi-Resolution Support
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose from 1080p Full HD, 720p HD, 480p, or compact 360p streams tailored for phone storage and desktop monitors.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Audiophile 320 kbps MP3
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Isolate musical soundtracks, educational lectures, and podcast discussions in full stereo clarity with ID3 metadata tags.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              No Watermarks Added
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Files are saved strictly in their original presentation with zero branding, sponsor banners, or visual watermarks.
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
