"use client";

import React, { useState, useCallback, useRef } from "react";
import QRCode from "qrcode";

interface QrOptions {
  text: string;
  size: number;
  margin: number;
  color: string;
  bgColor: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  format: "png" | "svg";
}

export default function QrCodeGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [options, setOptions] = useState<QrOptions>({
    text: "",
    size: 400,
    margin: 2,
    color: "#000000",
    bgColor: "#ffffff",
    errorCorrectionLevel: "M",
    format: "png",
  });

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQr = useCallback(async () => {
    if (!options.text.trim()) {
      setError("Please enter text or URL to generate QR code.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      if (options.format === "png") {
        const dataUrl = await QRCode.toDataURL(options.text, {
          width: options.size,
          margin: options.margin,
          color: {
            dark: options.color,
            light: options.bgColor,
          },
          errorCorrectionLevel: options.errorCorrectionLevel,
        });
        setQrDataUrl(dataUrl);
        setQrSvg(null);
      } else {
        const svg = await QRCode.toString(options.text, {
          type: "svg",
          margin: options.margin,
          color: {
            dark: options.color,
            light: options.bgColor,
          },
          errorCorrectionLevel: options.errorCorrectionLevel,
          width: options.size,
        });
        setQrSvg(svg);
        setQrDataUrl(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code.");
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  const handleDownload = () => {
    if (options.format === "png" && qrDataUrl) {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `filelab-qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (options.format === "svg" && qrSvg) {
      const blob = new Blob([qrSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `filelab-qr-code-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setOptions((prev) => ({ ...prev, text: "" }));
    setQrDataUrl(null);
    setQrSvg(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Generator Controls */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                QR Content
              </label>
              <textarea
                value={options.text}
                onChange={(e) => setOptions({ ...options, text: e.target.value })}
                placeholder="Enter text, URL, WiFi, or vCard data…"
                rows={4}
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                disabled={isGenerating || !options.text.trim()}
                onClick={generateQr}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                  options.text.trim() && !isGenerating
                    ? "bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-600/25"
                    : "bg-stone-100 text-stone-500 border border-stone-200"
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate QR Code
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Appearance
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Foreground</label>
                  <input
                    type="color"
                    value={options.color}
                    onChange={(e) => setOptions({ ...options, color: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Background</label>
                  <input
                    type="color"
                    value={options.bgColor}
                    onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Size (px)</label>
                <input
                  type="number"
                  value={options.size}
                  onChange={(e) =>
                    setOptions({ ...options, size: Math.min(Math.max(Number(e.target.value) || 100, 100), 1200) })
                  }
                  min="100"
                  max="1200"
                  className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Margin</label>
                <input
                  type="number"
                  value={options.margin}
                  onChange={(e) => setOptions({ ...options, margin: Number(e.target.value) || 0 })}
                  min="0"
                  max="10"
                  className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Error Correction</label>
                <select
                  value={options.errorCorrectionLevel}
                  onChange={(e) =>
                    setOptions({ ...options, errorCorrectionLevel: e.target.value as QrOptions["errorCorrectionLevel"] })
                  }
                  className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="L">L (~7% recovery)</option>
                  <option value="M">M (~15% recovery)</option>
                  <option value="Q">Q (~25% recovery)</option>
                  <option value="H">H (~30% recovery)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Download Format</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, format: "png" })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      options.format === "png"
                        ? "bg-cyan-600 text-white"
                        : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, format: "svg" })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      options.format === "svg"
                        ? "bg-cyan-600 text-white"
                        : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
                    }`}
                  >
                    SVG
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 text-xs font-bold transition-all hover:bg-stone-100"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right: QR Code Preview */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-full max-w-[500px] aspect-square bg-white rounded-3xl border border-stone-200 shadow-sm flex items-center justify-center overflow-hidden">
              {isGenerating && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                  <span className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!isGenerating && qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-full h-full object-contain p-4"
                />
              )}
              {!isGenerating && qrSvg && (
                <div
                  className="w-full h-full p-4 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              )}
              {!qrDataUrl && !qrSvg && !isGenerating && (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 019-9" />
                  </svg>
                  <p className="text-stone-500 text-sm">Enter content above to generate your QR code</p>
                </div>
              )}
            </div>

            {(!isGenerating && (qrDataUrl || qrSvg)) && (
              <div className="mt-6 w-full max-w-[500px]">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!qrDataUrl && !qrSvg}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                    (qrDataUrl || qrSvg) && !isGenerating
                      ? "bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-600/25"
                      : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}
                >
                  {options.format === "png" ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PNG
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Download SVG
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">About QR Code Generator</h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          Generate high-quality QR codes entirely in your browser. No data is uploaded to any server —
          the QR code is rendered locally using client-side processing. Supports URLs, text, WiFi
          credentials, and vCard formats with customizable colors, size, margin, and error correction
          levels. Download as PNG or SVG for print and digital use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Zero Server Uploads</div>
            <p className="text-xs text-stone-500">
              QR codes are generated locally in your browser. Nothing leaves your device.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">PNG & SVG Export</div>
            <p className="text-xs text-stone-500">
              Download your QR code as a high-resolution PNG or scalable SVG vector file.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Customizable</div>
            <p className="text-xs text-stone-500">
              Adjust colors, size, margin, and error correction level to suit your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
