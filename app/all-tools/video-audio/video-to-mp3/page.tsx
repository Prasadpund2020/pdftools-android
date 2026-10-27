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
import VideoToMp3Tool from "@/components/tools/video-to-mp3/VideoToMp3Tool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("video-audio", "video-to-mp3") || getToolBySlug("video-to-mp3");

  if (!tool) {
    return {
      title: "Video to MP3 Converter — Extract Audio Online Free | FileLab",
      description:
        "Extract high-bitrate MP3, WAV, or AAC audio from MP4, MKV, and MOV videos. 100% in-browser WebAudio & WebAssembly processing with zero server uploads.",
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
      url: `/all-tools/video-audio/video-to-mp3`,
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
      canonical: `/all-tools/video-audio/video-to-mp3`,
    },
  };
}

export default function VideoToMp3Page() {
  const category = "video-audio";
  const slug = "video-to-mp3";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "video-to-mp3",
    title: "Video to MP3",
    category: "video-audio",
    description:
      "Extract crystal clear audio tracks from MP4, MKV, MOV and web videos.",
    clayColor: "clay-purple",
    iconType: "play",
    badgeText: "320 kbps",
    actionText: "Extract MP3 Audio",
    isPrimaryAction: true,
    acceptedFormats: ".mp4,.mkv,.mov,.webm",
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
    url: `${SITE_URL}/all-tools/video-audio/video-to-mp3`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with Web Audio API and WebAssembly support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side audio stream demuxing via Web Audio API & WebAssembly",
      "Interactive acoustic waveform visualizer and time range precision trimmer",
      "Multiple output formats (MP3, WAV, AAC, FLAC, M4A) up to 320 kbps",
      "Acoustic gain normalization (0dB, +3dB, EBU R128 peak limiting)",
      "Built-in ID3 tag editor for Title, Artist, and Album metadata",
    ],
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              label: catInfo ? catInfo.name : "Video & Audio",
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
              <span className="w-8 h-8 border-[3px] border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading Video to MP3 Lab…
              </span>
            </div>
          </div>
        }
      >
        <VideoToMp3Tool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; Client-Side Audio Demuxing
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Video to MP3 &amp; Audio Lab provides broadcast-grade audio extraction running entirely inside
          your web browser. Using the Web Audio API and WebAssembly codecs, video containers are demuxed locally
          without uploading sensitive interviews, presentations, or keynote recordings to remote servers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500">
              Media never leaves your computer. Streams are demuxed in local RAM with instant client-side file synthesis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Acoustic Precision Trimming
            </div>
            <p className="text-xs text-slate-500">
              Scrub the interactive audio spectrum to extract ringtones, sound bites, or full speeches with sub-second accuracy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Studio Bitrates &amp; ID3 Tags
            </div>
            <p className="text-xs text-slate-500">
              Export up to 320 kbps Extreme Studio fidelity with embedded artist, track, and album metadata tags.
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
                Related {catInfo?.name || "Video & Audio"} Tools
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
