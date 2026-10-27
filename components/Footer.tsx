import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/80 bg-[#f4f2eb] mt-12 sm:mt-16 text-stone-600 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20 md:pb-8">
        {/* Main Grid: Brand & Structured Tool Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 sm:pb-10 border-b border-stone-200/70">
          {/* Brand & Privacy Capsule (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <Link href="/" className="inline-flex items-center group no-underline hover:opacity-95 transition-opacity">
                <BrandLogo className="h-8 sm:h-9 w-auto" />
              </Link>

              <p className="mt-3 text-xs text-stone-500 leading-relaxed max-w-sm">
                Private, in-browser file laboratory. Conversions and media operations execute entirely in your local WebAssembly memory. Zero server uploads.
              </p>
            </div>

            {/* Privacy Guarantee Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-medium self-start shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span>100% In-Browser &middot; Memory Sandbox &middot; Free</span>
            </div>
          </div>

          {/* Directory Links (8 cols: 4 balanced columns on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            {/* Col 1: Document Press */}
            <div>
              <div className="font-bold text-stone-900 tracking-wider text-[11px] uppercase mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                <span>PDF Press</span>
              </div>
              <ul className="space-y-1.5 text-stone-500">
                <li>
                  <Link href="/all-tools/pdf/pdf-to-word" className="hover:text-stone-900 transition-colors no-underline">
                    PDF to Word
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/pdf/pdf-merge" className="hover:text-stone-900 transition-colors no-underline">
                    Merge PDF
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/pdf/compress-pdf" className="hover:text-stone-900 transition-colors no-underline">
                    Compress PDF
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/pdf/split-pdf" className="hover:text-stone-900 transition-colors no-underline">
                    Split Pages
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/pdf" className="font-bold text-rose-600 hover:text-rose-700 transition-colors no-underline text-[11px]">
                    All PDF Tools &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Visual Studio */}
            <div>
              <div className="font-bold text-stone-900 tracking-wider text-[11px] uppercase mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                <span>Image Studio</span>
              </div>
              <ul className="space-y-1.5 text-stone-500">
                <li>
                  <Link href="/all-tools/image/compress-image" className="hover:text-stone-900 transition-colors no-underline">
                    Compress Image
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/image/remove-bg" className="hover:text-stone-900 transition-colors no-underline">
                    Remove BG
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/image/resize-image" className="hover:text-stone-900 transition-colors no-underline">
                    Resize & Crop
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/image/jpg-to-png" className="hover:text-stone-900 transition-colors no-underline">
                    JPG to PNG
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/image" className="font-bold text-teal-600 hover:text-teal-700 transition-colors no-underline text-[11px]">
                    All Image Tools &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Media & Sound */}
            <div>
              <div className="font-bold text-stone-900 tracking-wider text-[11px] uppercase mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                <span>Media Lab</span>
              </div>
              <ul className="space-y-1.5 text-stone-500">
                <li>
                  <Link href="/all-tools/video-audio/video-to-mp3" className="hover:text-stone-900 transition-colors no-underline">
                    Video to MP3
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/video-audio/trim-video" className="hover:text-stone-900 transition-colors no-underline">
                    Trim Video
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/downloaders/youtube-downloader" className="hover:text-stone-900 transition-colors no-underline">
                    YT Downloader
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/edit-convert/ocr-scanner" className="hover:text-stone-900 transition-colors no-underline">
                    OCR Scanner
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/video-audio" className="font-bold text-purple-600 hover:text-purple-700 transition-colors no-underline text-[11px]">
                    All Media Tools &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Platform & Navigation */}
            <div>
              <div className="font-bold text-stone-900 tracking-wider text-[11px] uppercase mb-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span>Atelier Hub</span>
              </div>
              <ul className="space-y-1.5 text-stone-500">
                <li>
                  <Link href="/" className="hover:text-stone-900 transition-colors no-underline">
                    Home Desk
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools" className="hover:text-stone-900 transition-colors no-underline">
                    All 33+ Tools
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/edit-convert" className="hover:text-stone-900 transition-colors no-underline">
                    Universal Press
                  </Link>
                </li>
                <li>
                  <Link href="/all-tools/downloaders" className="hover:text-stone-900 transition-colors no-underline">
                    Media Courier
                  </Link>
                </li>
                <li>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Client Sandbox
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Single Clean Line with Copyright & Versioning */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span className="font-semibold text-stone-700">
              &copy; 2026 freeconvertingtools.com.
            </span>
            <span>Handcrafted for privacy. Zero cookies &middot; No accounts &middot; No tracking.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/" className="hover:text-stone-900 transition-colors no-underline">
              Desk
            </Link>
            <span className="text-stone-300">&bull;</span>
            <Link href="/all-tools" className="hover:text-stone-900 transition-colors no-underline">
              All Tools
            </Link>
            <span className="text-stone-300">&bull;</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono text-[10px] border border-stone-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              WASM v2.4
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
