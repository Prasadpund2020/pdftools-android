import React from "react";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // JSON-LD structured data for breadcrumbs (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      {/* Schema.org breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-slate-500 select-none mb-4"
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg className="w-3 h-3 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast || !item.href ? (
                <span className={`font-semibold truncate ${isLast ? "text-slate-800" : "text-slate-500"}`}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-slate-500 hover:text-blue-600 transition-colors truncate"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
