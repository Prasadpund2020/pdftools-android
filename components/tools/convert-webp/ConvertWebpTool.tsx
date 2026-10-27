"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { WebPConversionItem, WebPOptions } from "./types";
import {
  convertImageToWebP,
  createWebPZipBundle,
  generateWebpSampleItems,
} from "./convertWebpEngine";
import ConvertWebpHeaderBar from "./ConvertWebpHeaderBar";
import ConvertWebpDropzone from "./ConvertWebpDropzone";

export default function ConvertWebpTool() {
  const [items, setItems] = useState<WebPConversionItem[]>([]);
  const [options, setOptions] = useState<WebPOptions>({
    quality: 82,
    lossless: false,
  });

  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert a single item
  const convertSingle = useCallback(
    async (item: WebPConversionItem, opts: WebPOptions) => {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "converting" } : i))
      );

      try {
        const res = await convertImageToWebP(item, opts);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "done",
                  convertedBlob: res.blob,
                  convertedUrl: res.url,
                  convertedSizeBytes: res.sizeBytes,
                  reductionPercentage: res.reduction,
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
    },
    []
  );

  // Initialize with sample items on mount
  useEffect(() => {
    const samples = generateWebpSampleItems();
    setItems(samples);
    // Convert sample items
    samples.forEach((sample) => {
      convertSingle(sample, { quality: 82, lossless: false });
    });
  }, [convertSingle]);

  // Convert all pending or re-convert with new quality
  const handleConvertAll = async () => {
    setIsConvertingAll(true);
    for (const item of items) {
      await convertSingle(item, options);
    }
    setIsConvertingAll(false);
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const convertedItems = items.filter((i) => i.convertedBlob);
    if (convertedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zipBlob = await createWebPZipBundle(convertedItems);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `filelab-webp-bundle-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("ZIP creation failed:", err);
    } finally {
      setIsZipping(false);
    }
  };

  // Download individual file
  const handleDownloadSingle = (item: WebPConversionItem) => {
    if (!item.convertedUrl) return;
    const baseName = item.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.href = item.convertedUrl;
    link.download = `${baseName}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalOriginalSize = items.reduce((acc, i) => acc + i.originalSizeBytes, 0);
  const totalConvertedSize = items.reduce(
    (acc, i) => acc + (i.convertedSizeBytes || i.originalSizeBytes),
    0
  );
  const totalReduction =
    totalOriginalSize > 0
      ? Math.round(((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <ConvertWebpHeaderBar
        onReset={() => setItems([])}
        onLoadSample={() => {
          const samples = generateWebpSampleItems();
          setItems(samples);
          samples.forEach((s) => convertSingle(s, options));
        }}
        fileCount={items.length}
      />

      {items.length === 0 ? (
        <ConvertWebpDropzone
          onFilesAdded={(newItems) => {
            setItems(newItems);
            newItems.forEach((item) => convertSingle(item, options));
          }}
          onUseSample={() => {
            const samples = generateWebpSampleItems();
            setItems(samples);
            samples.forEach((s) => convertSingle(s, options));
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Batch List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">Conversion Queue</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                    {items.length} Files
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    + Add More
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
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
                              const newItem: WebPConversionItem = {
                                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                                name: file.name,
                                originalWidth: img.width,
                                originalHeight: img.height,
                                originalSizeBytes: file.size,
                                previewUrl: dataUrl,
                                status: "pending",
                              };
                              setItems((prev) => [...prev, newItem]);
                              convertSingle(newItem, options);
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

              {/* Items Table/List */}
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
                          {item.convertedSizeBytes && (
                            <>
                              <span>→</span>
                              <span className="font-bold text-cyan-700">
                                {formatSize(item.convertedSizeBytes)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto">
                      {item.status === "converting" && (
                        <span className="px-2.5 py-1 rounded-xl bg-cyan-50 text-cyan-700 text-xs font-bold flex items-center gap-1">
                          <span className="w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                          Encoding
                        </span>
                      )}

                      {item.status === "done" && (
                        <>
                          {item.reductionPercentage !== undefined && (
                            <span
                              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                                item.reductionPercentage > 0
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.reductionPercentage > 0
                                ? `-${item.reductionPercentage}%`
                                : `+${Math.abs(item.reductionPercentage)}%`}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(item)}
                            className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Save
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
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

          {/* Right Options & Summary Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                WebP Compression Settings
              </h3>

              {/* Lossless vs Lossy Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div>
                  <div className="text-xs font-bold text-stone-800">Lossless Encoding</div>
                  <div className="text-[10px] text-stone-500">Maximum quality, larger file</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.lossless}
                    onChange={(e) => {
                      const updated = { ...options, lossless: e.target.checked };
                      setOptions(updated);
                      items.forEach((item) => convertSingle(item, updated));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600" />
                </label>
              </div>

              {/* Quality Slider (only active in lossy mode) */}
              {!options.lossless && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">WebP Quality</label>
                    <span className="text-xs font-bold text-cyan-600">{options.quality}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={options.quality}
                    onChange={(e) => {
                      const updated = { ...options, quality: Number(e.target.value) };
                      setOptions(updated);
                    }}
                    onMouseUp={() => {
                      items.forEach((item) => convertSingle(item, options));
                    }}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Batch Summary Stats */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/70 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">
                  Total Bandwidth Saved
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-black text-stone-900">
                    {formatSize(totalConvertedSize)}
                  </div>
                  {totalReduction > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      Save {totalReduction}%
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-stone-500">
                  Original: {formatSize(totalOriginalSize)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isZipping || items.length === 0}
                  onClick={handleDownloadAllZip}
                  className="w-full py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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

                <button
                  type="button"
                  disabled={isConvertingAll}
                  onClick={handleConvertAll}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Re-encode All at {options.quality}% Quality
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
