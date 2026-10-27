import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { CATEGORIES } from "@/data/tools";
import {
  getCategoryInfo,
  getCategorySeo,
  getToolsByCategory,
  categoryFromSlug,
} from "@/lib/tools";
import CategoryPageContent from "@/components/tools/CategoryPageContent";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Allow blocking route for Next.js 16 Partial Prefetching / Instant Shell
export const instant = false;

export async function generateStaticParams() {
  // Pre-render all category pages at build time
  return [
    { category: "pdf" },
    { category: "image" },
    { category: "video-audio" },
    { category: "downloaders" },
    { category: "edit-convert" },
  ];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const seo = getCategorySeo(category);
  const catInfo = getCategoryInfo(category);

  if (!seo || !catInfo) {
    return {
      title: "Category Not Found — FileLab",
    };
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: `${seo.title} — 100% Free Client-Side Tools`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${seo.title} — FileLab`,
      description: seo.description,
      type: "website",
      url: `/all-tools/${category}`,
      images: [
        {
          url: "/images/all-tools-hero-banner.png",
          width: 1200,
          height: 630,
          alt: `${seo.title} — FileLab`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} — FileLab`,
      description: seo.description,
      images: ["/images/all-tools-hero-banner.png"],
    },
    alternates: {
      canonical: `/all-tools/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catInfo = getCategoryInfo(category);

  if (!catInfo) {
    notFound();
  }

  const tools = getToolsByCategory(category);
  const seo = getCategorySeo(category);

  // Department metadata for visual storytelling
  const DEPARTMENT_INFO: Record<
    string,
    { department: string; accentColor: string; bgGradient: string; badge: string }
  > = {
    pdf: {
      department: "Department 01",
      accentColor: "from-rose-500 to-red-500",
      bgGradient: "from-rose-50/60 via-white to-stone-50/60",
      badge: "bg-rose-100 text-rose-700 border-rose-200/80",
    },
    image: {
      department: "Department 02",
      accentColor: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50/60 via-white to-stone-50/60",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200/80",
    },
    "video-audio": {
      department: "Department 03",
      accentColor: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50/60 via-white to-stone-50/60",
      badge: "bg-purple-100 text-purple-700 border-purple-200/80",
    },
    downloaders: {
      department: "Department 04",
      accentColor: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50/60 via-white to-stone-50/60",
      badge: "bg-amber-100 text-amber-800 border-amber-200/80",
    },
    "edit-convert": {
      department: "Department 05",
      accentColor: "from-sky-500 to-blue-500",
      bgGradient: "from-sky-50/60 via-white to-stone-50/60",
      badge: "bg-sky-100 text-sky-700 border-sky-200/80",
    },
  };

  const dept = DEPARTMENT_INFO[category] || {
    department: "Special Collection",
    accentColor: "from-blue-500 to-indigo-500",
    bgGradient: "from-white to-stone-50/60",
    badge: "bg-blue-100 text-blue-700 border-blue-200/80",
  };

  // Structured data JSON-LD for category collection
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo?.title || catInfo.name,
    description: seo?.description || `${catInfo.name} tools running in-browser`,
    url: `${SITE_URL}/all-tools/${category}`,
    hasPart: tools.map((t) => ({
      "@type": "WebApplication",
      name: t.title,
      description: t.description,
      url: `${SITE_URL}/all-tools/${category}/${t.id}`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    })),
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
        name: catInfo.name,
        item: `${SITE_URL}/all-tools/${category}`,
      },
    ],
  };

  return (
    <>
      {/* Schema.org CollectionPage & BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CategoryPageContent
        category={category}
        categoryName={catInfo.name}
        departmentNumber={dept.department}
        description={
          seo?.description ||
          `Explore free client-side ${catInfo.name.toLowerCase()} processed directly in your browser with zero server uploads.`
        }
        initialTools={tools}
      />
    </>
  );
}
