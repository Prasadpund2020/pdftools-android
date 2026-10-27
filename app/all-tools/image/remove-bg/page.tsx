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
import RemoveBackgroundTool from "@/components/tools/remove-background/RemoveBackgroundTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("image", "remove-bg") ||
    getToolBySlug("remove-bg") ||
    getToolBySlug("remove-background");

  if (!tool) {
    return {
      title: "Remove Background Studio — Free AI Image Cutout | FileLab",
      description:
        "Isolate subjects automatically with client-side AI image processing. Preserve ultra-fine hair strands and edge details with zero server uploads.",
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
      url: `/all-tools/image/remove-bg`,
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
      canonical: `/all-tools/image/remove-bg`,
    },
  };
}

export default function RemoveBackgroundPage() {
  const category = "image";
  const slug = "remove-bg";

  const tool =
    getToolBySlugs(category, slug) ||
    getToolBySlug(slug) || {
      id: "remove-bg",
      title: "Remove Background",
      category: "image",
      description:
        "Cut out subjects automatically with client-side AI image processing.",
      clayColor: "clay-cyan",
      iconType: "cutout",
      badgeText: "AI Cutout",
      actionText: "Remove Background",
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
    name: "Remove Background Studio — FileLab",
    description: tool.description,
    url: `${SITE_URL}/all-tools/image/remove-bg`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements:
      "Requires modern web browser with WebGL, WebAssembly, and HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side AI neural background segmentation",
      "Interactive Erase and Restore brush with customizable radius",
      "Dynamic background replacement with color swatches, hex picker, or custom backdrop images",
      "Ultra-fine hair strand edge isolation and feather softness controls",
      "Natural contact shadow retention with transparent PNG and WebP exports",
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
              <span className="w-8 h-8 border-[3px] border-[#006591] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-stone-500">
                Loading Remove Background Studio…
              </span>
            </div>
          </div>
        }
      >
        <RemoveBackgroundTool />
      </Suspense>

      {/* Tool Information & Security Guide */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title} &amp; Client-Side Neural Segmentation
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          FileLab Remove Background Studio empowers designers, e-commerce sellers, and creators to extract high-resolution portrait subjects, products, and graphics with pristine alpha transparency. All edge-matting and color clustering pipelines execute strictly inside your local browser sandbox with zero cloud uploads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Server Uploads
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your photographs never leave your device. Segmentation algorithms process memory buffers locally.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hair Strand Fidelity
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Edge-aware color dilation preserves wisps of hair, wool sweater textures, and transparent glasses frames.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Instant Backdrop Swap
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Preview cutouts immediately against clean studio whites, editorial sands, dark navies, or your own imagery.
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
                Related {catInfo?.name || "Image"} Tools
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
