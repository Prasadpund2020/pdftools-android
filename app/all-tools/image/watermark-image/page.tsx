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
import WatermarkImageTool from "@/components/tools/watermark-image/WatermarkImageTool";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import { SITE_URL } from "@/lib/constants";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tool =
    getToolBySlugs("image", "watermark-image") || getToolBySlug("watermark-image");

  if (!tool) {
    return {
      title: "Add Watermark to Image Online Free — Custom Text & Logo | FileLab",
      description:
        "Add custom text or brand logo watermarks to photos online for free. Adjust opacity, angle, size, position, and repeating tile pattern. 100% private in browser.",
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
      url: `/all-tools/image/watermark-image`,
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
      canonical: `/all-tools/image/watermark-image`,
    },
  };
}

export default function WatermarkImagePage() {
  const category = "image";
  const slug = "watermark-image";

  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug) || {
    id: "watermark-image",
    title: "Add Watermark to Image",
    category: "image",
    description: "Overlay custom text or brand logos with adjustable opacity, position, and tile patterns.",
    clayColor: "clay-teal",
    iconType: "watermark",
    badgeText: "Watermark HD",
    actionText: "Apply Watermark",
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
    url: `${SITE_URL}/all-tools/image/watermark-image`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // Schema.org BreadcrumbList
  const breadcrumbsJsonLd = {
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
        name: catInfo?.name || "Image Tools",
        item: `${SITE_URL}/all-tools/image`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: `${SITE_URL}/all-tools/image/watermark-image`,
      },
    ],
  };

  // Schema.org HowTo
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to add a watermark to an image online",
    description: "Learn how to protect your photos with text or transparent logo watermarks using FileLab.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload Image",
        text: "Select or drop your JPG, PNG, or WebP photo into the workspace.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose Watermark Type",
        text: "Select either Text Watermark (enter your text, color, font, and size) or Image Brand Logo.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Customize Opacity and Position",
        text: "Adjust transparency, rotation angle, 9-point anchor alignment, or enable repeating diagonal grid tiles.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Download Protected File",
        text: "Click Download Watermarked Image to instantly save your protected picture without quality loss.",
      },
    ],
  };

  // Schema.org FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is it safe to watermark confidential images here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 100%. FileLab performs all image composition directly in your web browser using HTML5 Canvas. Your photos and watermark logos are never uploaded to any remote server or stored in the cloud.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use my transparent PNG company logo as a watermark?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Switch to the 'Image Brand Logo' tab and upload your transparent PNG logo. You can scale its size, adjust opacity, and place it at any corner or tiled across the entire picture.",
        },
      },
      {
        "@type": "Question",
        name: "Can I create a repeating diagonal watermark across the entire photo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Simply toggle the 'Repeat / Tile pattern' switch. The watermark will automatically repeat in diagonal grid rows with custom spacing to deter unauthorized image cropping or reuse.",
        },
      },
      {
        "@type": "Question",
        name: "Does adding a watermark lower the quality of my original photo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. FileLab exports your image at 100% full pixel resolution with maximum JPEG or PNG fidelity, preserving sharp details and vibrant colors.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs Navigation */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: catInfo?.name || "Image Tools",
                href: `/all-tools/${category}`,
              },
              { label: tool.title, href: `/all-tools/${category}/${slug}` },
            ]}
          />
        </div>

          {/* Interactive Workspace */}
          <Suspense
            fallback={
              <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent" />
                <p className="mt-4 text-sm text-slate-400">
                  Loading Watermark Engine...
                </p>
              </div>
            }
          >
            <WatermarkImageTool />
          </Suspense>

          {/* Detailed Features & Educational Section for SEO */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-slate-800/80">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Protect and Brand Your Photos Online
              </h2>
              <p className="mt-4 text-base text-slate-400">
                Watermarking photos protects your intellectual property, deters content theft,
                and builds brand recognition before sharing client proofs or social posts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Text &amp; Logo Support
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Type custom copyright notices, creator names, or upload your official company PNG logo with full alpha channel transparency.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Repeating Tile Patterns
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Enable diagonal grid tiling across the entire canvas so photos cannot be cropped or trimmed to remove the creator mark.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Zero Server Uploads
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every watermark blend operation is performed on-device via HTML5 Canvas. Your sensitive proofs and assets stay strictly private.
                </p>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-16 p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80">
              <h3 className="text-2xl font-bold text-white mb-6">
                How to Add a Watermark in 4 Steps
              </h3>
              <ol className="space-y-4 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-400">Step 1:</span>
                  <span>Upload your JPEG, PNG, or WebP photo by dragging it into the workspace.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-400">Step 2:</span>
                  <span>Choose Text (enter your copyright notice) or Brand Logo (upload transparent PNG).</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-400">Step 3:</span>
                  <span>Fine-tune the opacity, size, angle, 9-point anchor alignment, or enable repeating pattern.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-cyan-400">Step 4:</span>
                  <span>Click Download Watermarked Image to export your high-resolution finished picture.</span>
                </li>
              </ol>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">
                    Explore Other Image Tools
                  </h3>
                  <Link
                    href={`/all-tools/${category}`}
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    View all {catInfo?.name || "Image Tools"} &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedTools.map((rt) => (
                    <ToolCard key={rt.id} tool={rt} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </>
    );
  }
