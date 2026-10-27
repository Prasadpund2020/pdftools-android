"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { JpgToPngItem } from "./types";
import {
  convertJpgToPng,
  createPngZipBundle,
  generateJpgSampleItems,
} from "./jpgToPngEngine";
import JpgToPngHeaderBar from "./JpgToPngHeaderBar";
import JpgToPngDropzone from "./JpgToPngDropzone";

export default function JpgToPngTool() {
  const [items, setItems] = useState<JpgToPngItem[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert single item
  const convertSingle = useCallback(async (item: JpgToPngItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "converting" } : i))
    );

    try {
      const res = await convertJpgToPng(item);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: "done",
                pngBlob: res.blob,
                pngUrl: res.url,
                pngSizeBytes: res.sizeBytes,
              }
            : i
        )
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Conversion error";
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "error", error: errorMsg } : i
        )
      );
    }
  }, []);

  // Initialize with sample on mount
  useEffect(() => {
    const samples = generateJpgSampleItems();
    setItems(samples);
    samples.forEach((sample) => convertSingle(sample));
  }, [convertSingle]);

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const doneItems = items.filter((i) => i.pngBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zipBlob = await createPngZipBundle(doneItems);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `filelab-png-bundle-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadSingle = (item: JpgToPngItem) => {
    if (!item.pngUrl) return;
    const baseName = item.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.href = item.pngUrl;
    link.download = `${baseName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <JpgToPngHeaderBar
        onReset={() => setItems([])}
        onLoadSample={() => {
          const samples = generateJpgSampleItems();
          setItems(samples);
          samples.forEach((s) => convertSingle(s));
        }}
        fileCount={items.length}
      />

      {items.length === 0 ? (
        <JpgToPngDropzone
          onFilesAdded={(newItems) => {
            setItems(newItems);
            newItems.forEach((i) => convertSingle(i));
          }}
          onUseSample={() => {
            const samples = generateJpgSampleItems();
            setItems(samples);
            samples.forEach((s) => convertSingle(s));
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">PNG Transcode Queue</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {items.length} Files
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    + Add More JPGs
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const newFiles = Array.from(e.target.files);
                        newFiles.forEach((file) => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            const img = new Image();
                            img.onload = () => {
                              const newItem: JpgToPngItem = {
                                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                                name: file.name,
                                originalWidth: img.width,
                                originalHeight: img.height,
                                originalSizeBytes: file.size,
                                previewUrl: dataUrl,
                                status: "pending",
                              };
                              setItems((prev) => [...prev, newItem]);
                              convertSingle(newItem);
                            };
                            img.src = dataUrl;
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-stone-100 mt-2 max-h-[500px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>{item.originalWidth} × {item.originalHeight} px</span>
                          <span>•</span>
                          <span>{formatSize(item.originalSizeBytes)}</span>
                          {item.pngSizeBytes && (
                            <>
                              <span>→</span>
                              <span className="font-bold text-emerald-700">
                                {formatSize(item.pngSizeBytes)} (PNG)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto">
                      {item.status === "converting" && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                          <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          Transcoding
                        </span>
                      )}

                      {item.status === "done" && (
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(item)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Save .PNG
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Lossless PNG Engine
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Truecolor RGBA Color Matrix
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Converts 8-bit discrete cosine transform JPEG blocks into uncompressed, 24-bit Truecolor PNG raster maps without color banding.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isZipping || items.length === 0}
                  onClick={handleDownloadAllZip}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isZipping ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating ZIP Archive…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download All as ZIP
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
