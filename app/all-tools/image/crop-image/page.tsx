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
import CropImageTool from "@/components/tools/crop-image/CropImageTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("image", "crop-image") || getToolBySlug("crop-image");

  if (!tool) {
    return {
      title: "Crop Image Online — Free Aspect Ratio Photo Trimmer | FileLab",
      description:
        "Crop photos to standard aspect ratios (1:1, 16:9, 4:5, 9:16) or custom bounds online for free. Drag handles with live preview. Zero server uploads.",
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
      url: `/all-tools/image/crop-image`,
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
      canonical: `/all-tools/image/crop-image`,
    },
  };
}

export default function CropImagePage() {
  const category = "image";
  const slug = "crop-image";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "crop-image",
    title: "Crop Image",
    category: "image",
    description: "Trim unwanted borders or crop to exact rectangular ratios.",
    clayColor: "clay-pink",
    iconType: "crop",
    badgeText: "Ratio Cut",
    actionText: "Crop Image",
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
    url: `${SITE_URL}/all-tools/image/crop-image`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser with HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Interactive draggable bounding box with 8 precision edge handles",
      "Preset aspect ratios: 1:1 Square, 16:9 Landscape, 9:16 Story, 4:5 Portrait, 4:3 Photo",
      "Rule-of-thirds composition overlay grid for cinematic framing",
      "90-degree lossless clockwise rotation and horizontal mirroring",
      "Zero server uploads - 100% private in-browser canvas execution",
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
        item: `${SITE_URL}/all-tools/image/crop-image`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I crop an image into a perfect 1:1 square for Instagram or profile pictures?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Select your image, then click the '1:1 Square' aspect ratio preset in the controls panel. The crop box automatically locks into a square that you can move across your photo.",
        },
      },
      {
        "@type": "Question",
        name: "Does cropping reduce my image resolution?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cropping extracts a specific region from your original high-resolution photo. FileLab never compresses or reduces pixel density inside the crop area unless you choose to lower the export quality.",
        },
      },
      {
        "@type": "Question",
        name: "Can I rotate or flip my photo while cropping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Use the Rotate 90° or Flip Horizontal buttons in the top header or controls bar to re-orient your photo before downloading.",
        },
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Crop an Image Online for Free",
    description: "Step-by-step instructions to crop photos and adjust visual framing in your browser.",
    totalTime: "PT1M",
    tool: [{ "@type": "HowTool", name: "Web Browser (Chrome, Firefox, Safari, Edge)" }],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload your image",
        text: "Select or drop your photo into the FileLab Crop Studio dropzone.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select ratio and adjust frame",
        text: "Pick an aspect ratio (1:1, 16:9, 4:5) or drag the corner handles to freely frame your subject.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download the cropped photo",
        text: "Choose your desired export format (WebP, JPG, or PNG) and click Download Cropped Image.",
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
              <span className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading Image Crop Studio…
              </span>
            </div>
          </div>
        }
      >
        <CropImageTool />
      </Suspense>

      {/* Educational & Architectural Feature Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          About {tool.title} &amp; Rule-of-Thirds Composition
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Crop Studio empowers creators, photographers, and developers to trim unwanted peripheries and reframe photos for social feeds or hero banners. With dynamic aspect ratio locks and interactive rule-of-thirds grid guides, you can position your subject with aesthetic precision. Every operation runs in client-side memory with zero server uploads.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              8-Point Precision Handles
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag corner anchors or cardinal edge handles to shave off borders with single-pixel accuracy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Social Ratio Standards
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standardized presets for Instagram Squares (1:1), Portrait Feeds (4:5), YouTube Thumbnails (16:9), and TikTok Reels (9:16).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Compression Loss
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract slices directly from source resolution without downsampling or lossy re-encoding artifacts.
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
