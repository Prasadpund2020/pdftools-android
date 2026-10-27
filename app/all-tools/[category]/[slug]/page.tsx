import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_TOOLS } from "@/data/tools";
import { ToolItem } from "@/types/tools";
import {
  getToolBySlugs,
  getToolBySlug,
  getCategoryInfo,
  getCategorySlug,
  getToolsByCategory,
  getToolSeo,
  isToolPublished,
} from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";
import ToolComingSoon from "@/components/tools/ToolComingSoon";
import Breadcrumbs from "@/components/tools/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";

interface ToolPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Allow blocking route for Next.js 16 Partial Prefetching / Instant Shell
export const instant = false;

export async function generateStaticParams() {
  return ALL_TOOLS.map((tool: ToolItem) => ({
    category: getCategorySlug(tool.category),
    slug: tool.id,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug);

  if (!tool || !isToolPublished(tool)) {
    return {
      title: "Tool Not Found — FileLab",
      robots: { index: false, follow: false },
    };
  }

  const seo = getToolSeo(tool);

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${tool.title} — FileLab`,
      description: seo.description,
      type: "website",
      url: `/all-tools/${category}/${slug}`,
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
      canonical: `/all-tools/${category}/${slug}`,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category, slug } = await params;
  const tool = getToolBySlugs(category, slug) || getToolBySlug(slug);

  if (!tool || !isToolPublished(tool)) {
    notFound();
  }

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
    url: `${SITE_URL}/all-tools/${category}/${slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All (Browser-based)",
    browserRequirements: "Requires modern web browser with WebAssembly and Web Worker support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "100% Client-side execution",
      "Zero server uploads",
      "Privacy-preserving memory sandbox",
      tool.acceptedFormats ? `Accepts ${tool.acceptedFormats}` : "Multi-format support",
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
        name: catInfo ? catInfo.name : "Category",
        item: `${SITE_URL}/all-tools/${category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.title,
        item: `${SITE_URL}/all-tools/${category}/${slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${tool.title} free to use?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, FileLab's ${tool.title} is 100% free with no account creation, subscription, or usage limit required.`,
        },
      },
      {
        "@type": "Question",
        name: `Are my files uploaded to any server when using ${tool.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No. FileLab processes files 100% client-side inside your browser's private memory sandbox. Your files never touch external servers or third-party databases.`,
        },
      },
      {
        "@type": "Question",
        name: `What devices and browsers support ${tool.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool.title} works seamlessly on any modern web browser including Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, and Opera across Windows, Mac, Linux, iOS, and Android.`,
        },
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use ${tool.title} Online for Free`,
    description:
      tool.seoDescription ||
      `Step-by-step instructions for using ${tool.title} safely in your web browser.`,
    totalTime: "PT1M",
    tool: [
      {
        "@type": "HowTool",
        name: "Web Browser (Chrome, Firefox, Safari, Edge)",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select your file or link",
        text:
          tool.category === "downloaders"
            ? "Paste the public video or media URL into the search box."
            : `Select or drop your ${tool.acceptedFormats || "document"} directly into the tool dropzone.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Process locally in browser",
        text: "The tool executes parsing and conversion 100% inside your browser memory sandbox with zero server uploads.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download the result",
        text: `Click ${tool.actionText || "Download"} to immediately save your processed file onto your computer or phone.`,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <Breadcrumbs
        items={[
          { label: "FileLab Studio", href: "/" },
          { label: "All Tools", href: "/all-tools" },
          {
            label: catInfo ? catInfo.name : "Category",
            href: `/all-tools/${category}`,
          },
          { label: tool.title },
        ]}
      />

      {/* Main Tool Workspace / Coming Soon UI */}
      <ToolComingSoon tool={tool} />

      {/* Tool Information & FAQ Section for SEO */}
      <div className="mt-12 bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          About {tool.title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {tool.description} Unlike traditional cloud conversion services, FileLab executes
          computations directly in your browser using modern WebAssembly (WASM) and HTML5 Canvas APIs.
          Your private documents, images, and media never leave your device or touch an external server.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Zero Uploads
            </div>
            <p className="text-xs text-slate-500">
              Files are converted in browser RAM and destroyed immediately upon task completion.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Supported Inputs
            </div>
            <p className="text-xs text-slate-500">
              {tool.acceptedFormats || "Various industry standard file formats"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Completely Free
            </div>
            <p className="text-xs text-slate-500">
              No credits, no registration, no daily quota limits, no paywalls.
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
                Related {catInfo?.name || "Tools"}
              </h3>
              <p className="text-xs text-slate-500">
                More in-browser utilities from this department
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
