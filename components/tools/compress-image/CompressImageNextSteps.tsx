"use client";

import React from "react";
import Link from "next/link";

export default function CompressImageNextSteps() {
  const nextTools = [
    {
      id: "remove-bg",
      title: "Remove BG",
      subtitle: "AI Alpha Cutout",
      href: "/all-tools/image/remove-bg",
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      iconBg: "bg-blue-100 text-blue-700",
      hoverBorder: "hover:border-blue-300",
    },
    {
      id: "image-to-pdf",
      title: "Image to PDF",
      subtitle: "Document Packaging",
      href: "/all-tools/pdf/image-to-pdf",
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      iconBg: "bg-orange-100 text-orange-700",
      hoverBorder: "hover:border-orange-300",
    },
    {
      id: "upscale-image",
      title: "AI 4x Upscale",
      subtitle: "Enhance Pixel Detail",
      href: "/all-tools/image/upscale-image",
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      ),
      iconBg: "bg-amber-100 text-amber-700",
      hoverBorder: "hover:border-amber-300",
    },
    {
      id: "crop-image",
      title: "Crop & Aspect",
      subtitle: "Social Aspect Presets",
      href: "/all-tools/image/crop-image",
      iconSvg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      iconBg: "bg-stone-200 text-stone-700",
      hoverBorder: "hover:border-stone-400",
    },
  ];

  return (
    <div className="mt-6 pt-6 border-t border-stone-200/80 flex flex-col gap-4">
      <div>
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          Next Step Options
        </span>
        <h2 className="text-base sm:text-lg font-bold text-stone-900">
          Continue Editing This Image
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {nextTools.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className={`bg-white p-4 rounded-2xl shadow-[0_8px_18px_rgba(41,37,36,0.05)] hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center gap-2 group border border-stone-200/80 ${t.hoverBorder}`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${t.iconBg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
            >
              {t.iconSvg}
            </div>
            <span className="text-sm font-bold text-stone-900">{t.title}</span>
            <span className="text-xs text-stone-500 font-medium">{t.subtitle}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
