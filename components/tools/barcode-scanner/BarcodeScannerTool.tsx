"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import JsBarcode from "jsbarcode";

type BarcodeFormat = "CODE128" | "EAN-13" | "UPC-A" | "ISBN" | "CODE39";

interface BarcodeOptions {
  value: string;
  format: BarcodeFormat;
  width: number;
  height: number;
  color: string;
  bgColor: string;
  displayValue: boolean;
  fontSize: number;
  margin: number;
}

const BARCODE_FORMATS: BarcodeFormat[] = [
  "CODE128",
  "EAN-13",
  "UPC-A",
  "ISBN",
  "CODE39",
];

export default function BarcodeScannerTool() {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [options, setOptions] = useState<BarcodeOptions>({
    value: "",
    format: "CODE128",
    width: 2,
    height: 100,
    color: "#000000",
    bgColor: "#ffffff",
    displayValue: true,
    fontSize: 20,
    margin: 10,
  });

  const [barcodeSvg, setBarcodeSvg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      const detector = new (window as any).BarcodeDetector({});
      detector.getSupportedFormats().then((fmts: string[]) => {
        setSupportedFormats(fmts);
      });
    }
  }, []);

  const generateBarcode = useCallback(() => {
    if (!options.value.trim()) {
      setError("Please enter text or number to generate barcode.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgEl.setAttribute("id", "barcode");

      JsBarcode(svgEl, options.value, {
        format: options.format,
        width: options.width,
        height: options.height,
        displayValue: options.displayValue,
        fontSize: options.fontSize,
        margin: options.margin,
        lineColor: options.color,
        background: options.bgColor,
      });

      setBarcodeSvg(svgEl.outerHTML);
      setIsGenerating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate barcode.");
      setIsGenerating(false);
    }
  }, [options]);

  const handleDownload = () => {
    if (!barcodeSvg) return;

    const blob = new Blob([barcodeSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `filelab-barcode-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setOptions((prev) => ({ ...prev, value: "" }));
    setBarcodeSvg(null);
    setError(null);
  };

  // Scanner
  const startScanner = async () => {
    setScannerError(null);
    setScannedValue(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setScannerActive(true);
    } catch (err) {
      setScannerError(
        err instanceof Error
          ? err.message
          : "Camera access denied or camera not available."
      );
    }
  };

  const stopScanner = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScannerActive(false);
    setScannedValue(null);
    setScannerError(null);
  };

  const scanFrame = useCallback(() => {
    if (!videoRef.current || typeof window !== "undefined" && !("BarcodeDetector" in window)) return;

    const detector = new (window as any).BarcodeDetector({});
    const video = videoRef.current;

    const detect = () => {
      if (!scannerActive || !video) return;
      detector
        .detect(video)
        .then((barcodes: any[]) => {
          if (barcodes.length > 0 && !scannedValue) {
            setScannedValue(barcodes[0].rawValue);
            stopScanner();
          } else if (scannerActive) {
            requestAnimationFrame(detect);
          }
        })
        .catch(() => {
          if (scannerActive) requestAnimationFrame(detect);
        });
    };

    detect();
  }, [scannerActive, scannedValue]);

  useEffect(() => {
    if (scannerActive && stream) {
      scanFrame();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scannerActive, stream, scanFrame]);

  const useScannedValue = () => {
    if (scannedValue) {
      setOptions((prev) => ({ ...prev, value: scannedValue }));
      setScannedValue(null);
      stopScanner();
    }
  };

  const formatLabels: Record<BarcodeFormat, string> = {
    CODE128: "CODE 128",
    "EAN-13": "EAN-13",
    "UPC-A": "UPC-A",
    ISBN: "ISBN",
    CODE39: "CODE 39",
  };

  return (
    <div className="space-y-6">
      {/* Generator Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Controls */}
          <div className="lg:w-1/3 space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Barcode Content
              </label>
              <input
                value={options.value}
                onChange={(e) =>
                  setOptions({ ...options, value: e.target.value })
                }
                placeholder="Enter text, number, or ISBN…"
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                disabled={isGenerating || !options.value.trim()}
                onClick={generateBarcode}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                  options.value.trim() && !isGenerating
                    ? "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/25"
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
                    Generate Barcode
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
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BARCODE_FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setOptions({ ...options, format: fmt })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      options.format === fmt
                        ? "bg-orange-100 text-orange-800 border-orange-200"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {formatLabels[fmt]}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">
                    Bar Width
                  </label>
                  <span className="text-[11px] font-bold text-orange-600">
                    {options.width}px
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={options.width}
                  onChange={(e) =>
                    setOptions({ ...options, width: Number(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">
                    Height
                  </label>
                  <span className="text-[11px] font-bold text-orange-600">
                    {options.height}px
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={300}
                  step={10}
                  value={options.height}
                  onChange={(e) =>
                    setOptions({ ...options, height: Number(e.target.value) })
                  }
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">
                    Color
                  </label>
                  <input
                    type="color"
                    value={options.color}
                    onChange={(e) => setOptions({ ...options, color: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">
                    Background
                  </label>
                  <input
                    type="color"
                    value={options.bgColor}
                    onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.displayValue}
                  onChange={(e) =>
                    setOptions({ ...options, displayValue: e.target.checked })
                  }
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <label className="text-xs font-bold text-stone-700 cursor-pointer">
                  Display value below barcode
                </label>
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

          {/* Right: Preview */}
          <div className="lg:w-2/3 flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-full max-w-[500px] bg-white rounded-3xl border border-stone-200 shadow-sm p-4 flex items-center justify-center">
              {isGenerating && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                  <span className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!isGenerating && barcodeSvg && (
                <div className="w-full max-w-full overflow-auto">
                  <div
                    className="inline-block bg-white border border-stone-100 p-2 rounded-lg shadow-sm"
                    dangerouslySetInnerHTML={{ __html: barcodeSvg }}
                  />
                </div>
              )}
              {!barcodeSvg && !isGenerating && (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h3.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-stone-500 text-sm">Enter content above to generate your barcode</p>
                </div>
              )}
            </div>

            {barcodeSvg && !isGenerating && (
              <button
                type="button"
                onClick={handleDownload}
                className="mt-6 w-full max-w-[500px] py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download SVG
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scanner Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Barcode Scanner</h3>
          {scannerActive ? (
            <button
              type="button"
              onClick={stopScanner}
              className="py-2 px-3 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold transition-all hover:bg-rose-200"
            >
              Stop Scanner
            </button>
          ) : (
            <button
              type="button"
              onClick={startScanner}
              disabled={scannerError !== null}
              className={`py-2 px-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                !scannerError
                  ? "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/25"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              Start Camera Scanner
            </button>
          )}
        </div>
        {scannerError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-4">
            {scannerError}
            {typeof window !== "undefined" && !("BarcodeDetector" in window) && (
              <p className="text-xs text-stone-500 mt-1">
                Barcode detection API not supported in this browser. Try Chrome or Edge.
              </p>
            )}
          </div>
        )}

        {scannerActive && stream && (
          <div className="relative w-full max-w-[400px] aspect-video bg-black rounded-2xl overflow-hidden border border-stone-200 shadow-lg mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-24 h-24 border-4 border-orange-500/30 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {!scannerActive && !stream && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-20 h-20 text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-stone-500 text-sm">
              Point your camera at a barcode to scan it. Scanned values can be
              used in the generator above.
            </p>
            {typeof window !== "undefined" && !("BarcodeDetector" in window) && (
              <p className="text-xs text-stone-400 mt-2">
                Requires Chrome or Edge with Barcode Detector API.
              </p>
            )}
          </div>
        )}

        {scannedValue && (
          <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-bold text-orange-800 truncate max-w-xs">
              Scanned: {scannedValue}
            </span>
            <button
              type="button"
              onClick={useScannedValue}
              className="ml-auto py-1 px-2 rounded-lg text-orange-600 text-xs font-bold hover:bg-orange-100 transition-colors"
            >
              Use Value
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-stone-100">
          <p className="text-sm text-stone-600 leading-relaxed">
            The scanner uses your device camera to read barcodes in real time.
            All processing happens locally in your browser — no images or video
            are uploaded to any server. Camera access is only used while the
            scanner is active.
          </p>
        </div>
      </div>

      <div className="bg-white/80 rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">About Barcode Scanner & Maker</h3>
        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          Generate and scan barcodes entirely in your browser. Create CODE128,
          EAN-13, UPC-A, ISBN, and CODE39 barcodes with customizable width,
          height, colors, and margins. Download as SVG vector files for print
          and digital use. The built-in scanner reads barcodes from your camera
          feed locally without uploading any data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Zero Server Uploads</div>
            <p className="text-xs text-stone-500">
              Barcodes are generated and scanned locally in your browser. Nothing
              leaves your device.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">SVG Export</div>
            <p className="text-xs text-stone-500">
              Download your barcode as a scalable SVG vector file for print and
              digital use.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Multiple Formats</div>
            <p className="text-xs text-stone-500">
              Supports CODE128, EAN-13, UPC-A, ISBN, and CODE39 barcode formats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
