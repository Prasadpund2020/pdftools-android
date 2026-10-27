"use client";

import React, { useState } from "react";

interface Hero3DStageProps {
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
}

export default function Hero3DStage({
  onSelectCategory,
  activeCategory,
}: Hero3DStageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCardClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(activeCategory === catId ? "all" : catId);
    }
  };

  return (
    <div className="relative w-full max-w-[340px] xl:max-w-[360px] h-[100px] flex items-center justify-center select-none overflow-visible">
      {/* CSS Floating Keyframes */}
      <style jsx>{`
        @keyframes atelierFloatA {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-4px) rotate(-6deg); }
        }
        @keyframes atelierFloatB {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(0deg); }
        }
        @keyframes atelierFloatC {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
        @keyframes atelierFloatD {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(-3deg); }
        }
        @keyframes atelierFloatE {
          0%, 100% { transform: translateY(0px) rotate(7deg); }
          50% { transform: translateY(-4px) rotate(9deg); }
        }
      `}</style>

      {/* Subtle Ambient Light & Glowing Podium Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft Golden Oval Halo */}
        <div className="w-56 h-16 rounded-full bg-gradient-to-r from-amber-300/25 via-amber-200/35 to-amber-400/20 blur-xl opacity-70" />
        {/* Subtle pedestal reflection rim */}
        <div className="absolute bottom-1 w-52 h-4 rounded-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent blur-[2px]" />
      </div>

      {/* Horizontal Floating Card Cluster */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
        {/* CARD 1: PDF */}
        <button
          type="button"
          onClick={() => handleCardClick("pdf")}
          onMouseEnter={() => setHoveredCard("pdf")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            animation: hoveredCard === "pdf" ? "none" : "atelierFloatA 4s ease-in-out infinite",
            transform: hoveredCard === "pdf" ? "translateY(-6px) scale(1.1) rotate(-4deg)" : undefined,
          }}
          className={`group flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/80 border border-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer ${
            activeCategory === "pdf"
              ? "ring-2 ring-red-400 bg-white shadow-[0_8px_20px_rgba(239,68,68,0.22)] scale-105"
              : "hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
          }`}
          title="Filter by PDF Tools"
        >
          <div className="w-9 h-11 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 p-1 flex flex-col justify-between shadow-xs">
            <span className="text-[6px] text-red-100 font-mono font-bold leading-none">.PDF</span>
            <span className="font-black text-[9px] text-white text-center tracking-tight">PDF</span>
            <div className="w-4 h-0.5 rounded-full bg-white/40 self-center" />
          </div>
          <span className="text-[9px] font-bold text-stone-700 mt-1">PDF</span>
        </button>

        {/* CARD 2: Image */}
        <button
          type="button"
          onClick={() => handleCardClick("image")}
          onMouseEnter={() => setHoveredCard("image")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            animation: hoveredCard === "image" ? "none" : "atelierFloatB 3.6s ease-in-out infinite 0.4s",
            transform: hoveredCard === "image" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
          }}
          className={`group flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/80 border border-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer ${
            activeCategory === "image"
              ? "ring-2 ring-blue-400 bg-white shadow-[0_8px_20px_rgba(59,130,246,0.22)] scale-105"
              : "hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
          }`}
          title="Filter by Image Tools"
        >
          <div className="w-9 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1 flex flex-col justify-between shadow-xs">
            <span className="text-[6px] text-blue-100 font-mono font-bold leading-none">.IMG</span>
            <svg className="w-4 h-4 text-white self-center drop-shadow-2xs" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <div className="w-4 h-0.5 rounded-full bg-white/40 self-center" />
          </div>
          <span className="text-[9px] font-bold text-stone-700 mt-1">Image</span>
        </button>

        {/* CARD 3: Video */}
        <button
          type="button"
          onClick={() => handleCardClick("video")}
          onMouseEnter={() => setHoveredCard("video")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            animation: hoveredCard === "video" ? "none" : "atelierFloatC 4.2s ease-in-out infinite 0.8s",
            transform: hoveredCard === "video" ? "translateY(-6px) scale(1.1) rotate(4deg)" : undefined,
          }}
          className={`group flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/80 border border-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer ${
            activeCategory === "video"
              ? "ring-2 ring-purple-400 bg-white shadow-[0_8px_20px_rgba(168,85,247,0.22)] scale-105"
              : "hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
          }`}
          title="Filter by Video Tools"
        >
          <div className="w-9 h-11 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 p-1 flex flex-col justify-between shadow-xs">
            <span className="text-[6px] text-purple-100 font-mono font-bold leading-none">.MP4</span>
            <svg className="w-4 h-4 text-white self-center drop-shadow-2xs" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <div className="w-4 h-0.5 rounded-full bg-white/40 self-center" />
          </div>
          <span className="text-[9px] font-bold text-stone-700 mt-1">Video</span>
        </button>

        {/* CARD 4: Audio */}
        <button
          type="button"
          onClick={() => handleCardClick("audio")}
          onMouseEnter={() => setHoveredCard("audio")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            animation: hoveredCard === "audio" ? "none" : "atelierFloatD 3.8s ease-in-out infinite 0.2s",
            transform: hoveredCard === "audio" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
          }}
          className={`group flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/80 border border-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer ${
            activeCategory === "audio"
              ? "ring-2 ring-amber-400 bg-white shadow-[0_8px_20px_rgba(245,158,11,0.22)] scale-105"
              : "hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
          }`}
          title="Filter by Audio Tools"
        >
          <div className="w-9 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-1 flex flex-col justify-between shadow-xs">
            <span className="text-[6px] text-amber-100 font-mono font-bold leading-none">.MP3</span>
            <svg className="w-4 h-4 text-white self-center drop-shadow-2xs" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            <div className="w-4 h-0.5 rounded-full bg-white/40 self-center" />
          </div>
          <span className="text-[9px] font-bold text-stone-700 mt-1">Audio</span>
        </button>

        {/* CARD 5: Text / Documents */}
        <button
          type="button"
          onClick={() => handleCardClick("text")}
          onMouseEnter={() => setHoveredCard("text")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            animation: hoveredCard === "text" ? "none" : "atelierFloatE 4.4s ease-in-out infinite 0.6s",
            transform: hoveredCard === "text" ? "translateY(-6px) scale(1.1) rotate(6deg)" : undefined,
          }}
          className={`group flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/80 border border-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer ${
            activeCategory === "text"
              ? "ring-2 ring-emerald-400 bg-white shadow-[0_8px_20px_rgba(16,185,129,0.22)] scale-105"
              : "hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
          }`}
          title="Filter by Text & Document Tools"
        >
          <div className="w-9 h-11 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-1 flex flex-col justify-between shadow-xs">
            <span className="text-[6px] text-emerald-100 font-mono font-bold leading-none">.DOC</span>
            <span className="font-black text-[9px] text-white text-center tracking-tight">DOC</span>
            <div className="w-4 h-0.5 rounded-full bg-white/40 self-center" />
          </div>
          <span className="text-[9px] font-bold text-stone-700 mt-1">Text</span>
        </button>
      </div>
    </div>
  );
}
