"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ImageCropMeta,
  CropRect,
  CropTransformOptions,
  CroppedResult,
  CropAspectRatio,
} from "./types";
import {
  calculateInitialCrop,
  executeCrop,
  generateCropSampleImage,
} from "./cropImageEngine";
import CropImageHeaderBar from "./CropImageHeaderBar";
import CropImageDropzone from "./CropImageDropzone";
import CropImageCanvasStage from "./CropImageCanvasStage";
import CropImageControls from "./CropImageControls";

export default function CropImageTool() {
  const [meta, setMeta] = useState<ImageCropMeta | null>(null);
  const [currentRatio, setCurrentRatio] = useState<CropAspectRatio>("16:9");
  const [cropRect, setCropRect] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 1600,
    height: 900,
  });

  const [options, setOptions] = useState<CropTransformOptions>({
    cropRect: { x: 0, y: 0, width: 1600, height: 900 },
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    outputFormat: "webp",
    quality: 88,
  });

  const [result, setResult] = useState<CroppedResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger crop rendering
  const triggerCropExecution = useCallback(
    async (source: ImageCropMeta, opt: CropTransformOptions) => {
      setIsProcessing(true);
      try {
        const res = await executeCrop(source, opt);
        setResult(res);
      } catch (err) {
        console.error("Crop execution failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Initialize with sample on mount
  useEffect(() => {
    const sample = generateCropSampleImage();
    setMeta(sample);
    const initialRect = calculateInitialCrop(
      sample.originalWidth,
      sample.originalHeight,
      "16:9"
    );
    setCropRect(initialRect);
    const initialOpts: CropTransformOptions = {
      cropRect: initialRect,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      outputFormat: "webp",
      quality: 88,
    };
    setOptions(initialOpts);
    triggerCropExecution(sample, initialOpts);
  }, [triggerCropExecution]);

  // Handle crop rect change
  const handleCropChange = (rect: CropRect) => {
    setCropRect(rect);
    const updated = { ...options, cropRect: rect };
    setOptions(updated);

    if (!meta) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      triggerCropExecution(meta, updated);
    }, 120);
  };

  // Handle aspect ratio selection
  const handleRatioSelect = (ratio: CropAspectRatio) => {
    setCurrentRatio(ratio);
    if (!meta) return;

    const newRect = calculateInitialCrop(
      meta.originalWidth,
      meta.originalHeight,
      ratio
    );
    setCropRect(newRect);
    const updated = { ...options, cropRect: newRect };
    setOptions(updated);
    triggerCropExecution(meta, updated);
  };

  // Handle new image upload
  const handleImageSelected = (newMeta: ImageCropMeta) => {
    setMeta(newMeta);
    const newRect = calculateInitialCrop(
      newMeta.originalWidth,
      newMeta.originalHeight,
      currentRatio
    );
    setCropRect(newRect);
    const updated = { ...options, cropRect: newRect, rotation: 0, flipHorizontal: false };
    setOptions(updated);
    triggerCropExecution(newMeta, updated);
  };

  // Reset to initial sample
  const handleReset = () => {
    const sample = generateCropSampleImage();
    setMeta(sample);
    setCurrentRatio("16:9");
    const initialRect = calculateInitialCrop(
      sample.originalWidth,
      sample.originalHeight,
      "16:9"
    );
    setCropRect(initialRect);
    const initialOpts: CropTransformOptions = {
      cropRect: initialRect,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      outputFormat: "webp",
      quality: 88,
    };
    setOptions(initialOpts);
    triggerCropExecution(sample, initialOpts);
  };

  const handleDownload = () => {
    if (!result || !meta) return;
    const ext =
      options.outputFormat === "original"
        ? meta.name.split(".").pop() || "jpg"
        : options.outputFormat;

    const baseName = meta.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}-cropped-${result.width}x${result.height}.${ext}`;

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
      <CropImageHeaderBar
        onReset={handleReset}
        onLoadSample={handleReset}
        onRotateClockwise={() => {
          const nextRot = (options.rotation + 90) % 360;
          const updated = { ...options, rotation: nextRot };
          setOptions(updated);
          if (meta) triggerCropExecution(meta, updated);
        }}
        onFlipHorizontal={() => {
          const updated = {
            ...options,
            flipHorizontal: !options.flipHorizontal,
          };
          setOptions(updated);
          if (meta) triggerCropExecution(meta, updated);
        }}
      />

      {/* Main Workspace Stage */}
      {meta ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Canvas Viewport */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            <CropImageCanvasStage
              meta={meta}
              cropRect={cropRect}
              rotation={options.rotation}
              flipHorizontal={options.flipHorizontal}
              flipVertical={options.flipVertical}
              onCropChange={handleCropChange}
            />

            {/* Quick Upload Alternate Area */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                  CROP
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 truncate max-w-xs sm:max-w-md">
                    {meta.name}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Source: {meta.originalWidth} × {meta.originalHeight} px • Ratio:{" "}
                    {currentRatio.toUpperCase()}
                  </div>
                </div>
              </div>

              <label className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer">
                Choose Image
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
            <CropImageControls
              currentRatio={currentRatio}
              options={options}
              result={result}
              isProcessing={isProcessing}
              onRatioSelect={handleRatioSelect}
              onOptionsChange={(newOpts) => {
                setOptions(newOpts);
                if (meta) triggerCropExecution(meta, newOpts);
              }}
              onDownload={handleDownload}
            />
          </div>
        </div>
      ) : (
        <CropImageDropzone
          onImageSelected={handleImageSelected}
          onUseSample={handleReset}
        />
      )}
    </div>
  );
}
