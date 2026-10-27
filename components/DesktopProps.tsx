import React from "react";

export default function DesktopProps() {
  return (
    <>
      {/* Ambient lighting overlay */}
      <div className="fixed inset-0 desk-vignette z-0 pointer-events-none" />

      {/* Bottom Left: Potted Green Foliage / Succulent (desktop only) */}
      <div className="hidden xl:block fixed bottom-0 left-0 pointer-events-none z-10 w-44 h-44 overflow-hidden select-none">
        <svg
          className="w-full h-full transform translate-y-6 -translate-x-6 filter drop-shadow-xl"
          fill="none"
          viewBox="0 0 200 200"
        >
          <path
            d="M-10 190 C20 130, 70 120, 100 130 C90 160, 50 180, -10 190 Z"
            fill="#2d5a27"
          />
          <path
            d="M-5 195 C25 140, 65 130, 95 135"
            stroke="#3d7535"
            strokeWidth="2"
          />
          <path
            d="M30 200 C50 140, 110 110, 150 130 C130 165, 80 185, 30 200 Z"
            fill="#3e7c33"
          />
          <path
            d="M10 170 C40 100, 90 90, 120 115 C100 140, 60 155, 10 170 Z"
            fill="#4d9940"
          />
          <path
            d="M-10 150 C20 90, 80 80, 90 110 C70 130, 30 145, -10 150 Z"
            fill="#5cb74d"
          />
        </svg>
      </div>

    </>
  );
}
