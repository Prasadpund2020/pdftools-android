"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "full" | "icon";
  showSubtitle?: boolean;
}

export default function BrandLogo({
  className = "h-10",
  variant = "full",
  showSubtitle = true,
}: BrandLogoProps) {
  // Vector Squircle Icon with 3D Origami Cycling Arrows
  const iconSvg = (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full aspect-square flex-shrink-0"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="brand-squircle-clip">
          <rect x="8" y="8" width="104" height="104" rx="28" />
        </clipPath>
      </defs>

      {/* Pine Green Squircle Background */}
      <rect x="8" y="8" width="104" height="104" rx="28" fill="#0b382c" />

      <g clipPath="url(#brand-squircle-clip)">
        {/* Lower Emerald Green Arrow */}
        <polygon
          points="60,92 41,77 60,62 60,69 76,55 94,50 94,66 76,84 60,84"
          fill="#00c476"
        />
        {/* Emerald Fold Shadow Facet */}
        <polygon
          points="60,84 76,84 76,55 60,69"
          fill="#059e61"
        />

        {/* Upper White Arrow */}
        <polygon
          points="60,20 79,35 60,50 60,43 44,57 26,62 26,46 44,28 60,28"
          fill="#ffffff"
        />
        {/* Silver Fold Shadow Facet */}
        <polygon
          points="60,28 44,28 44,57 60,43"
          fill="#cfded9"
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {iconSvg}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none flex-shrink-0 ${className}`}>
      {/* 1. Squircle Icon */}
      {iconSvg}

      {/* 2. Brand Typography Block */}
      <div className="flex flex-col justify-center min-w-0">
        {/* Main Wordmark Line */}
        <div className="flex items-center leading-none tracking-tight whitespace-nowrap">
          <span className="font-extrabold text-[#00c476] text-[1.25rem] sm:text-[1.45rem] leading-none">
            free
          </span>
          <span className="font-extrabold text-[#0b382c] text-[1.25rem] sm:text-[1.45rem] leading-none">
            convertingtools
          </span>
          <span
            className="text-[9px] sm:text-[10px] font-bold text-[#6b7f77] leading-none ml-1 select-none"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            .com
          </span>
        </div>

        {/* Subtitle Line */}
        {showSubtitle && (
          <span className="text-[7.5px] sm:text-[8.5px] font-bold tracking-[0.24em] text-[#4a5e55] uppercase mt-1 whitespace-nowrap leading-none">
            FREE ONLINE FILE CONVERTER
          </span>
        )}
      </div>
    </div>
  );
}
