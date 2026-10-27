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
import ResizeImageTool from "@/components/tools/resize-image/ResizeImageTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("image", "resize-image") || getToolBySlug("resize-image");

  if (!tool) {
    return {
      title: "Resize Image Online — Scale Dimensions & Aspect Ratio Free | FileLab",
      description:
        "Resize JPG, PNG, and WebP image dimensions online for free. Scale by pixels or percentage with aspect ratio lock. 100% in-browser processing.",
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
      url: `/all-tools/image/resize-image`,
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
      canonical: `/all-tools/image/resize-image`,
    },
  };
}

export default function ResizeImagePage() {
  const category = "image";
  const slug = "resize-image";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "resize-image",
    title: "Resize Image",
    category: "image",
    description: "Scale image pixel dimensions and aspect ratios for web, print or socials.",
    clayColor: "clay-blue",
    iconType: "aspect-ratio",
    badgeText: "Scale HD",
    actionText: "Resize Image",
    isPrimaryAction: true,
    acceptedFormats: ".png,.jpg,.jpeg,.webp",
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
    url: `${SITE_URL}/all-tools/image/resize-image`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser with HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Pixel-perfect bilinear downscaling and bicubic upscaling",
      "Social media preset dimensions (Instagram, YouTube, Twitter/X, Full HD, 4K)",
      "Lock aspect ratio toggle with automatic proportional dimension calculation",
      "Format conversion to modern WebP, JPG, or PNG with zero compression artifacts",
      "100% Client-side RAM sandbox execution with zero file uploads",
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
        item: `${SITE_URL}/all-tools/image/resize-image`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does resizing an image reduce its visual quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When scaling down, FileLab uses high-quality multi-step bilinear interpolation to preserve sharp edges and text contrast without pixelation. When scaling up, vector interpolation ensures clean smoothing.",
        },
      },
      {
        "@type": "Question",
        name: "How can I resize a photo for Instagram or YouTube?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Click the 'Social Presets' tab in the controls panel. Choose presets like Instagram Post (1080×1080), Story / Reel (1080×1920), or YouTube Thumbnail (1280×720) to automatically resize in one click.",
        },
      },
      {
        "@type": "Question",
        name: "Are my photos uploaded to any external server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. FileLab processes all resizing operations 100% inside your browser's private memory. Your images never leave your computer or phone.",
        },
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Resize an Image Online for Free",
    description: "Step-by-step instructions to resize photos and image dimensions in your web browser.",
    totalTime: "PT1M",
    tool: [{ "@type": "HowTool", name: "Web Browser (Chrome, Firefox, Safari, Edge)" }],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload or drop your photo",
        text: "Select a JPG, PNG, or WebP photo or drag it into the dropzone.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Adjust dimensions or pick a preset",
        text: "Type your target width and height in pixels, use the percentage slider, or choose a social media preset.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download the resized image",
        text: "Select your desired export format (WebP, JPG, or PNG) and click Download Resized Image.",
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
              <span className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading Image Resizer Studio…
              </span>
            </div>
          </div>
        }
      >
        <ResizeImageTool />
      </Suspense>

      {/* Educational & Architectural Feature Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          About {tool.title} &amp; High-Fidelity Client-Side Scaling
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Image Resizer provides professional pixel-scaling and aspect ratio formatting directly in browser memory. Whether resizing banner photos for social media feeds or shrinking high-resolution camera photography for responsive mobile web pages, our engine performs multi-pass interpolation with zero loss in color gamut and zero server uploads.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Multi-Pass Interpolation
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Step-down bicubic smoothing avoids jagged diagonal lines and aliasing artifacts common in standard browser resizers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proportional Lock
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Locking aspect ratios guarantees your portraits and product photos never appear stretched or horizontally distorted.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Social Presets Built-In
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              One-click presets for Instagram Squares (1080×1080), Stories/Reels (1080×1920), YouTube Thumbnails, and Twitter Headers.
            </p>
          </div>
        </div>
      </div>

      {/* Related Image Tools Carousel/Grid */}
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
