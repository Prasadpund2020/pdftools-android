"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ImageSourceMeta, ResizeOptions, ResizedResult } from "./types";
import { generateSampleDeskImage, resizeImage } from "./resizeImageEngine";
import ResizeImageHeaderBar from "./ResizeImageHeaderBar";
import ResizeImageDropzone from "./ResizeImageDropzone";
import ResizeImageCanvasStage from "./ResizeImageCanvasStage";
import ResizeImageControls from "./ResizeImageControls";

export default function ResizeImageTool() {
  const [meta, setMeta] = useState<ImageSourceMeta | null>(null);
  const [options, setOptions] = useState<ResizeOptions>({
    width: 1200,
    height: 675,
    maintainAspectRatio: true,
    outputFormat: "webp",
    quality: 85,
    fitMode: "contain",
    fillColor: "#ffffff",
  });

  const [result, setResult] = useState<ResizedResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Execute resizing
  const triggerResize = useCallback(
    async (source: ImageSourceMeta, opt: ResizeOptions) => {
      setIsProcessing(true);
      try {
        const res = await resizeImage(source, opt);
        setResult(res);
      } catch (err) {
        console.error("Resize failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Initialize with sample demo image on mount
  useEffect(() => {
    const sample = generateSampleDeskImage();
    setMeta(sample);
    const initialOpts: ResizeOptions = {
      width: 1200,
      height: 675,
      maintainAspectRatio: true,
      outputFormat: "webp",
      quality: 85,
      fitMode: "contain",
      fillColor: "#ffffff",
    };
    setOptions(initialOpts);
    triggerResize(sample, initialOpts);
  }, [triggerResize]);

  // Handle options change with debounce
  const handleOptionsChange = (newOptions: ResizeOptions) => {
    setOptions(newOptions);
    if (!meta) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerResize(meta, newOptions);
    }, 120);
  };

  // Handle new image upload
  const handleImageSelected = (newMeta: ImageSourceMeta) => {
    setMeta(newMeta);
    const updatedOpts: ResizeOptions = {
      ...options,
      width: newMeta.originalWidth,
      height: newMeta.originalHeight,
    };
    setOptions(updatedOpts);
    triggerResize(newMeta, updatedOpts);
  };

  // Reset to sample
  const handleReset = () => {
    const sample = generateSampleDeskImage();
    setMeta(sample);
    const initialOpts: ResizeOptions = {
      width: 1200,
      height: 675,
      maintainAspectRatio: true,
      outputFormat: "webp",
      quality: 85,
      fitMode: "contain",
      fillColor: "#ffffff",
    };
    setOptions(initialOpts);
    triggerResize(sample, initialOpts);
  };

  // Trigger browser download
  const handleDownload = () => {
    if (!result || !meta) return;

    const ext =
      options.outputFormat === "original"
        ? meta.name.split(".").pop() || "jpg"
        : options.outputFormat;

    const baseName = meta.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}-${result.width}x${result.height}.${ext}`;

    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <ResizeImageHeaderBar
        onReset={handleReset}
        onLoadSample={handleReset}
        isProcessing={isProcessing}
      />

      {/* Main Workspace Stage */}
      {meta ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Canvas Viewport */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            <ResizeImageCanvasStage
              meta={meta}
              options={options}
              result={result}
              isProcessing={isProcessing}
            />

            {/* Quick Upload Alternate Area */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                  IMG
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 truncate max-w-xs sm:max-w-md">
                    {meta.name}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Original: {meta.originalWidth} × {meta.originalHeight} px
                  </div>
                </div>
              </div>

              <label className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer">
                Change Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/bmp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      const img = new Image();
                      img.onload = () => {
                        handleImageSelected({
                          file: f,
                          name: f.name,
                          originalWidth: img.width,
                          originalHeight: img.height,
                          originalSizeBytes: f.size,
                          aspectRatio: img.width / img.height,
                          dataUrl,
                          mimeType: f.type,
                        });
                      };
                      img.src = dataUrl;
                    };
                    reader.readAsDataURL(f);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ResizeImageControls
              meta={meta}
              options={options}
              result={result}
              onOptionsChange={handleOptionsChange}
              onDownload={handleDownload}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      ) : (
        <ResizeImageDropzone
          onImageSelected={handleImageSelected}
          onUseSample={handleReset}
        />
      )}
    </div>
  );
}
