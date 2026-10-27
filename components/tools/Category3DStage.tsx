"use client";

import React, { useState } from "react";

interface Category3DStageProps {
  category: string;
}

export default function Category3DStage({ category }: Category3DStageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Render category-specific compact 3D floating cards
  const renderCards = () => {
    switch (category) {
      case "pdf":
        return (
          <>
            {/* Card 1: PDF Document */}
            <div
              onMouseEnter={() => setHoveredCard("pdf1")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "pdf1" ? "none" : "catFloatA 3.8s ease-in-out infinite",
                transform: hoveredCard === "pdf1" ? "translateY(-6px) scale(1.1) rotate(-3deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(239,68,68,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-red-100 font-mono font-bold leading-none">.PDF</span>
                <span className="font-black text-[10px] text-white text-center tracking-tight">PDF</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Document</span>
            </div>

            {/* Card 2: Word Converter */}
            <div
              onMouseEnter={() => setHoveredCard("pdf2")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "pdf2" ? "none" : "catFloatB 3.5s ease-in-out infinite 0.3s",
                transform: hoveredCard === "pdf2" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(59,130,246,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-blue-100 font-mono font-bold leading-none">.DOCX</span>
                <span className="font-black text-[9px] text-white text-center">WORD⇄PDF</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Convert</span>
            </div>

            {/* Card 3: Merge / Split */}
            <div
              onMouseEnter={() => setHoveredCard("pdf3")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "pdf3" ? "none" : "catFloatC 4.2s ease-in-out infinite 0.6s",
                transform: hoveredCard === "pdf3" ? "translateY(-6px) scale(1.1) rotate(4deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(245,158,11,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-amber-100 font-mono font-bold leading-none">PAGES</span>
                <span className="font-black text-[9px] text-white text-center">MERGE</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Organize</span>
            </div>
          </>
        );

      case "image":
        return (
          <>
            {/* Card 1: PNG Compress */}
            <div
              onMouseEnter={() => setHoveredCard("img1")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "img1" ? "none" : "catFloatA 3.8s ease-in-out infinite",
                transform: hoveredCard === "img1" ? "translateY(-6px) scale(1.1) rotate(-3deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(13,148,136,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-teal-100 font-mono font-bold leading-none">.PNG</span>
                <span className="font-black text-[9px] text-white text-center">COMPRESS</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Optimize</span>
            </div>

            {/* Card 2: Resize & Crop */}
            <div
              onMouseEnter={() => setHoveredCard("img2")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "img2" ? "none" : "catFloatB 3.5s ease-in-out infinite 0.3s",
                transform: hoveredCard === "img2" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(59,130,246,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-cyan-100 font-mono font-bold leading-none">.JPG</span>
                <span className="font-black text-[9px] text-white text-center">RESIZE</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Dimensions</span>
            </div>

            {/* Card 3: WebP Converter */}
            <div
              onMouseEnter={() => setHoveredCard("img3")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "img3" ? "none" : "catFloatC 4.2s ease-in-out infinite 0.6s",
                transform: hoveredCard === "img3" ? "translateY(-6px) scale(1.1) rotate(4deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(168,85,247,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-indigo-100 font-mono font-bold leading-none">.WEBP</span>
                <span className="font-black text-[9px] text-white text-center">CONVERT</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Modern</span>
            </div>
          </>
        );

      case "video-audio":
        return (
          <>
            {/* Card 1: Video MP4 */}
            <div
              onMouseEnter={() => setHoveredCard("va1")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "va1" ? "none" : "catFloatA 3.8s ease-in-out infinite",
                transform: hoveredCard === "va1" ? "translateY(-6px) scale(1.1) rotate(-3deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(124,58,237,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-purple-100 font-mono font-bold leading-none">.MP4</span>
                <span className="font-black text-[9px] text-white text-center">CINEMA</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Video</span>
            </div>

            {/* Card 2: Audio MP3 */}
            <div
              onMouseEnter={() => setHoveredCard("va2")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "va2" ? "none" : "catFloatB 3.5s ease-in-out infinite 0.3s",
                transform: hoveredCard === "va2" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(245,158,11,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-amber-100 font-mono font-bold leading-none">.MP3</span>
                <span className="font-black text-[9px] text-white text-center">EXTRACT</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Sound</span>
            </div>

            {/* Card 3: Volume Booster */}
            <div
              onMouseEnter={() => setHoveredCard("va3")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "va3" ? "none" : "catFloatC 4.2s ease-in-out infinite 0.6s",
                transform: hoveredCard === "va3" ? "translateY(-6px) scale(1.1) rotate(4deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(236,72,153,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-pink-100 font-mono font-bold leading-none">AUDIO</span>
                <span className="font-black text-[9px] text-white text-center">BOOST</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Level</span>
            </div>
          </>
        );

      case "downloaders":
        return (
          <>
            {/* Card 1: YouTube Downloader */}
            <div
              onMouseEnter={() => setHoveredCard("dl1")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "dl1" ? "none" : "catFloatA 3.8s ease-in-out infinite",
                transform: hoveredCard === "dl1" ? "translateY(-6px) scale(1.1) rotate(-3deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(239,68,68,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-red-100 font-mono font-bold leading-none">STREAM</span>
                <span className="font-black text-[9px] text-white text-center">4K YT</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Video</span>
            </div>

            {/* Card 2: Social Reels */}
            <div
              onMouseEnter={() => setHoveredCard("dl2")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "dl2" ? "none" : "catFloatB 3.5s ease-in-out infinite 0.3s",
                transform: hoveredCard === "dl2" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(217,119,6,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-pink-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-amber-100 font-mono font-bold leading-none">SOCIAL</span>
                <span className="font-black text-[9px] text-white text-center">REELS</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Capture</span>
            </div>

            {/* Card 3: Media Vault */}
            <div
              onMouseEnter={() => setHoveredCard("dl3")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "dl3" ? "none" : "catFloatC 4.2s ease-in-out infinite 0.6s",
                transform: hoveredCard === "dl3" ? "translateY(-6px) scale(1.1) rotate(4deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(16,185,129,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-emerald-100 font-mono font-bold leading-none">MEDIA</span>
                <span className="font-black text-[9px] text-white text-center">DIRECT</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Courier</span>
            </div>
          </>
        );

      case "edit-convert":
      default:
        return (
          <>
            {/* Card 1: Word */}
            <div
              onMouseEnter={() => setHoveredCard("ec1")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "ec1" ? "none" : "catFloatA 3.8s ease-in-out infinite",
                transform: hoveredCard === "ec1" ? "translateY(-6px) scale(1.1) rotate(-3deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(37,99,235,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-blue-100 font-mono font-bold leading-none">.DOCX</span>
                <span className="font-black text-[9px] text-white text-center">WORD</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Writer</span>
            </div>

            {/* Card 2: Excel */}
            <div
              onMouseEnter={() => setHoveredCard("ec2")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "ec2" ? "none" : "catFloatB 3.5s ease-in-out infinite 0.3s",
                transform: hoveredCard === "ec2" ? "translateY(-6px) scale(1.1) rotate(0deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(16,185,129,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-emerald-100 font-mono font-bold leading-none">.XLSX</span>
                <span className="font-black text-[9px] text-white text-center">SHEET</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Table</span>
            </div>

            {/* Card 3: OCR */}
            <div
              onMouseEnter={() => setHoveredCard("ec3")}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animation: hoveredCard === "ec3" ? "none" : "catFloatC 4.2s ease-in-out infinite 0.6s",
                transform: hoveredCard === "ec3" ? "translateY(-6px) scale(1.1) rotate(4deg)" : undefined,
              }}
              className="flex flex-col items-center p-1.5 rounded-xl backdrop-blur-md bg-white/85 border border-white/90 shadow-[0_6px_16px_rgba(168,85,247,0.12)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 p-1 flex flex-col justify-between shadow-xs">
                <span className="text-[6px] text-purple-100 font-mono font-bold leading-none">SCAN</span>
                <span className="font-black text-[9px] text-white text-center">OCR</span>
                <div className="w-5 h-0.5 rounded-full bg-white/40 self-center" />
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Extract</span>
            </div>
          </>
        );
    }
  };

  return (
    <div className="relative w-full max-w-[340px] xl:max-w-[360px] h-[100px] flex items-center justify-center select-none overflow-visible">
      {/* CSS Floating Keyframes */}
      <style jsx>{`
        @keyframes catFloatA {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-5px) rotate(-4deg); }
        }
        @keyframes catFloatB {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes catFloatC {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-4px) rotate(7deg); }
        }
      `}</style>

      {/* Subtle Ambient Light Halo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-52 h-16 rounded-full bg-gradient-to-r from-amber-300/25 via-amber-200/35 to-amber-400/20 blur-xl opacity-70" />
        <div className="absolute bottom-1 w-48 h-3 rounded-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent blur-[2px]" />
      </div>

      {/* Horizontal Floating Card Cluster */}
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-2.5">
        {renderCards()}
      </div>
    </div>
  );
}
