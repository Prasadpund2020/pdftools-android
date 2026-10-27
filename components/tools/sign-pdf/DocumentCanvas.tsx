"use client";

import React, { useEffect, useRef, useState } from "react";
import { DocumentInfo, SignaturePlacement } from "./types";

interface DocumentCanvasProps {
  doc: DocumentInfo;
  currentPage: number;
  zoomLevel: number;
  signerName: string;
  signerTitle: string;
  signingDate: string;
  typedSignature: string;
  selectedInkColor: string;
  isSignaturePlaced: boolean;
  signaturePlacement: SignaturePlacement;
  onUpdatePlacement: (placement: SignaturePlacement) => void;
  onPlaceSignature: () => void;
  onRemoveSignature: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function DocumentCanvas({
  doc,
  currentPage,
  zoomLevel,
  signerName,
  signerTitle,
  signingDate,
  typedSignature,
  selectedInkColor,
  isSignaturePlaced,
  signaturePlacement,
  onUpdatePlacement,
  onPlaceSignature,
  onRemoveSignature,
}: DocumentCanvasProps) {
  const pdfRenderCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPdfRendering, setIsPdfRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const currentRenderTaskRef = useRef<any>(null);

  // Render real PDF page via pdfjs-dist if not a demo sample
  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!doc || (!doc.arrayBuffer && !doc.file) || doc.isDemoSample) return;

      try {
        // Cancel any pending render task on this canvas before starting a new one
        if (currentRenderTaskRef.current) {
          try {
            currentRenderTaskRef.current.cancel();
          } catch {
            // ignore
          }
          currentRenderTaskRef.current = null;
        }

        setIsPdfRendering(true);
        setRenderError(null);

        // Dynamically import pdfjs-dist to avoid SSR errors
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

        // Always pass a fresh, non-detached ArrayBuffer copy to pdfjs worker
        const freshBuffer = doc.file
          ? await doc.file.arrayBuffer()
          : doc.arrayBuffer!.slice(0);

        if (isCancelled) return;

        // Load document
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(freshBuffer),
          cMapUrl: "/pdfjs/cmaps/",
          cMapPacked: true,
          standardFontDataUrl: "/pdfjs/standard_fonts/",
        });

        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const pageNum = Math.min(Math.max(1, currentPage), pdf.numPages);
        const page = await pdf.getPage(pageNum);
        if (isCancelled) return;

        const canvas = pdfRenderCanvasRef.current;
        if (!canvas) return;

        // Render at crisp 1.4x resolution for sharp text
        const baseViewport = page.getViewport({ scale: 1.4 });
        canvas.width = baseViewport.width;
        canvas.height = baseViewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const renderContext: any = {
          canvasContext: ctx,
          viewport: baseViewport,
        };

        const renderTask = page.render(renderContext);
        currentRenderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name === "RenderingCancelledException") {
          // Expected when switching pages quickly
          return;
        }
        console.error("PDF render error:", err);
        if (!isCancelled) {
          setRenderError("Could not render page preview, but document is loaded for signing.");
        }
      } finally {
        if (!isCancelled) {
          setIsPdfRendering(false);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (currentRenderTaskRef.current) {
        try {
          currentRenderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        currentRenderTaskRef.current = null;
      }
    };
  }, [doc, currentPage]);

  return (
    <div className="relative w-full max-w-[700px] bg-[#e6dfd5] rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col items-center border border-[#d6cec2]">
      {/* Top Clip Accent */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-gradient-to-b from-stone-400 via-stone-500 to-stone-600 rounded-full shadow-md flex items-center justify-center z-20 border-t border-white/40">
        <div className="w-20 h-1.5 rounded-full bg-stone-300 shadow-inner" />
      </div>

      {/* The Sheet of Paper (A4 Metaphor) */}
      <div
        className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col text-stone-900 relative transition-transform duration-200 min-h-[640px]"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
      >
        {/* Real Uploaded PDF Canvas Render */}
        {!doc.isDemoSample && doc.arrayBuffer ? (
          <div className="relative w-full flex flex-col items-center">
            {isPdfRendering && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 rounded-xl">
                <span className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-semibold text-stone-600">
                  Rendering Page {currentPage}...
                </span>
              </div>
            )}

            {renderError ? (
              <div className="w-full p-8 text-center text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-sm font-bold text-stone-700 mb-1">{doc.fileName}</p>
                <p className="text-xs text-stone-500">
                  Page {currentPage} of {doc.pageCount} ready for signature placement.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-xl border border-stone-200 shadow-xs relative">
                <canvas ref={pdfRenderCanvasRef} className="w-full h-auto block" />

                {/* Interactive Overlay for Stamping Signature on Real PDF */}
                <div
                  className="absolute inset-0 cursor-crosshair"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    onUpdatePlacement({ x: xPercent, y: yPercent, page: currentPage });
                    if (!isSignaturePlaced) {
                      onPlaceSignature();
                    }
                  }}
                >
                  {isSignaturePlaced && signaturePlacement.page === currentPage && (
                    <div
                      style={{
                        left: `${Math.min(75, Math.max(5, signaturePlacement.x))}%`,
                        top: `${Math.min(85, Math.max(5, signaturePlacement.y))}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="absolute z-20 bg-white/95 rounded-xl p-2.5 shadow-lg border border-emerald-500/70 flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing backdrop-blur-xs animate-in fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 flex items-center font-serif text-base font-black italic tracking-wide text-stone-900 px-1"
                          style={{ color: selectedInkColor }}
                        >
                          {typedSignature || signerName}
                        </div>
                        <div className="flex flex-col text-[9px] text-stone-400">
                          <span className="font-bold text-stone-800">{signerName}</span>
                          <span>{signingDate}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSignature();
                        }}
                        className="w-5 h-5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="Remove signature"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instruction Callout */}
            <div className="w-full mt-4 p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-emerald-700 font-bold">ℹ Tip:</span> Click anywhere on the document to position your signature stamp.
              </span>
              <span className="font-semibold text-stone-800">
                Page {currentPage} of {doc.pageCount}
              </span>
            </div>
          </div>
        ) : (
          /* Sample Demo Agreement (if user chose "Try Sample Contract") */
          <>
            {/* Document Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-stone-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                  CONFIDENTIAL • SCHEDULE C
                </span>
                <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                  Standard Executive Employment Agreement
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-400 block font-semibold">
                  REF: 2026-EXE-048
                </span>
                <span className="text-[10px] font-mono text-blue-600 font-bold uppercase">
                  SAMPLE PREVIEW
                </span>
              </div>
            </div>

            {/* Document Sample Clauses */}
            <div className="flex flex-col gap-3 text-xs text-stone-600 leading-relaxed mb-6">
              <p>
                <strong className="text-stone-900 font-bold">
                  7.4 Entirety of Understanding.
                </strong>{" "}
                This Instrument supersedes all prior covenants, representations, and communications between Executive and FileLab Corporation regarding compensation, incentive equity units, and IP assignment schedules.
              </p>
              <p>
                <strong className="text-stone-900 font-bold">
                  8.1 Counterparts &amp; Electronic Execution.
                </strong>{" "}
                The parties agree that electronic signatures executed via certified browser digest comply with the Uniform Electronic Transactions Act (UETA) and the ESIGN Act of 2000.
              </p>
              <p>
                <strong className="text-stone-900 font-bold">
                  8.2 Authorization &amp; Final Acknowledgment.
                </strong>{" "}
                By affixing electronic endorsement below, the signatory confirms review of Appendix B (Option Grant Schedule) and confirms full contractual capacity.
              </p>
            </div>

            {/* Signature Block Matrix */}
            <div className="bg-[#fbf9f6] rounded-2xl p-4 sm:p-5 border border-stone-200/70 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              {/* Left Party: Employer Pre-Signed */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
                    Company Signatory
                  </span>
                  <p className="text-xs font-bold text-stone-900">
                    FileLab Systems, Inc.
                  </p>
                  <div className="h-16 flex items-center">
                    <svg className="w-36 h-12 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 160 50">
                      <path d="M10,35 Q30,5 50,30 T90,20 Q120,45 150,25" strokeLinecap="round" />
                      <path d="M40,25 Q70,40 100,10" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="w-full h-0.5 bg-stone-200 mb-1" />
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Elena Vance &bull; General Counsel</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      ✓ Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Party: Interactive Executive Droppable Zone */}
              <div className="flex flex-col justify-between relative min-h-[140px]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
                      Executive Signatory
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-[9px] font-bold uppercase">
                      Required
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-900">
                    {signerName} ({signerTitle})
                  </p>
                </div>

                {/* Recessed Signature Zone */}
                <div className="relative w-full h-24 rounded-xl bg-stone-100/80 border-2 border-dashed border-stone-300 flex items-center justify-center p-2 shadow-inner group">
                  {isSignaturePlaced ? (
                    <div className="relative z-10 w-full bg-white rounded-xl p-2.5 shadow-md border border-stone-200 flex items-center justify-between gap-2 group-hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="h-10 flex items-center font-serif text-lg font-black italic tracking-wide text-stone-900 px-2"
                          style={{ color: selectedInkColor }}
                        >
                          {typedSignature || signerName}
                        </div>
                        <div className="flex flex-col min-w-0 pl-1">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {signerName}
                          </span>
                          <span className="text-[9px] text-stone-400 truncate">
                            Date: {signingDate} &bull; Client Digest
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                        <button
                          type="button"
                          onClick={onRemoveSignature}
                          className="w-6 h-6 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                          title="Remove signature"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onPlaceSignature}
                      className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>+ Click to Stamp Signature</span>
                    </button>
                  )}
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>
                    Date: <strong className="text-stone-900">{signingDate}</strong>
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    {isSignaturePlaced ? "✓ Status: Endorsed" : "Pending Signature"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Realistic Page Stack Shadows */}
      <div className="w-[96%] h-2 bg-[#dcd4c8] rounded-b-xl shadow-xs -mt-0.5" />
      <div className="w-[92%] h-1.5 bg-[#d4cbbd] rounded-b-xl shadow-xs -mt-0.5" />
    </div>
  );
}
