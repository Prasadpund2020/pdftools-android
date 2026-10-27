"use client";

import React, { useState, useCallback } from "react";
import RemoveBackgroundHeaderBar from "./RemoveBackgroundHeaderBar";
import RemoveBackgroundCanvasStage from "./RemoveBackgroundCanvasStage";
import RemoveBackgroundSidebar from "./RemoveBackgroundSidebar";
import RemoveBackgroundTips from "./RemoveBackgroundTips";
import RemoveBackgroundDropzone from "./RemoveBackgroundDropzone";
import { SAMPLE_CUTOUTS } from "./sampleImages";
import {
  BackdropConfig,
  BrushMode,
  CutoutSample,
  ExportFormat,
  SensitivityMode,
  ZoomLevel,
} from "./types";
import {
  processBackgroundRemoval,
  renderCompositeExport,
} from "./backgroundRemovalEngine";

export default function RemoveBackgroundTool() {
  const defaultSample = SAMPLE_CUTOUTS[0];

  const [hasImage, setHasImage] = useState(true);
  const [fileName, setFileName] = useState(defaultSample.fileName);
  const [width, setWidth] = useState(defaultSample.width);
  const [height, setHeight] = useState(defaultSample.height);
  const [originalFileSize, setOriginalFileSize] = useState(defaultSample.originalSize);
  const [cutoutFileSize, setCutoutFileSize] = useState(defaultSample.cutoutSize);
  const [originalUrl, setOriginalUrl] = useState(defaultSample.originalUrl);
  const [cutoutUrl, setCutoutUrl] = useState(defaultSample.cutoutUrl);
  const [subjectBoundsDesc, setSubjectBoundsDesc] = useState(defaultSample.subjectBounds);

  const [backdrop, setBackdrop] = useState<BackdropConfig>({
    type: "transparent",
    value: "transparent",
  });
  const [brushMode, setBrushMode] = useState<BrushMode>("erase");
  const [brushSize, setBrushSize] = useState<number>(24);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [feather, setFeather] = useState<number>(12);
  const [sensitivity, setSensitivity] = useState<SensitivityMode>("high");
  const [retainShadows, setRetainShadows] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // File upload processing
  const handleFileProcess = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            const dataUrl = e.target.result as string;
            setOriginalUrl(dataUrl);
            setFileName(file.name);
            setOriginalFileSize(file.size);

            const result = await processBackgroundRemoval(
              dataUrl,
              sensitivity,
              feather
            );

            setCutoutUrl(result.cutoutDataUrl);
            setWidth(result.width);
            setHeight(result.height);
            setSubjectBoundsDesc(result.boundsDesc);
            setCutoutFileSize(Math.round(file.size * 0.35));
            setHasImage(true);
            setIsProcessing(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Error segmenting image:", err);
        setIsProcessing(false);
      }
    },
    [feather, sensitivity]
  );

  // Select pre-curated studio sample
  const handleSelectSample = (sample: CutoutSample) => {
    setIsProcessing(true);
    setFileName(sample.fileName);
    setWidth(sample.width);
    setHeight(sample.height);
    setOriginalFileSize(sample.originalSize);
    setCutoutFileSize(sample.cutoutSize);
    setOriginalUrl(sample.originalUrl);
    setCutoutUrl(sample.cutoutUrl);
    setSubjectBoundsDesc(sample.subjectBounds);
    setHasImage(true);
    setTimeout(() => setIsProcessing(false), 250);
  };

  // Reset to default sample
  const handleReset = () => {
    handleSelectSample(defaultSample);
    setBackdrop({ type: "transparent", value: "transparent" });
    setFeather(12);
    setRetainShadows(true);
    setZoomLevel(1);
    setBrushMode("erase");
  };

  // Re-process when sensitivity is toggled
  const handleSensitivityChange = async (mode: SensitivityMode) => {
    setSensitivity(mode);
    if (originalUrl && originalUrl.startsWith("data:")) {
      setIsProcessing(true);
      try {
        const result = await processBackgroundRemoval(originalUrl, mode, feather);
        setCutoutUrl(result.cutoutDataUrl);
        setSubjectBoundsDesc(result.boundsDesc);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Re-calculate export blob and trigger download
  const handleDownload = async () => {
    try {
      const { blob } = await renderCompositeExport(
        cutoutUrl,
        backdrop,
        retainShadows,
        exportFormat
      );

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const baseName = fileName.replace(/\.[^/.]+$/, "");
      link.download = `${baseName}-cutout.${exportFormat}`;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    } catch (err) {
      console.error("Download export failed:", err);
    }
  };

  // Copy Cutout to Clipboard
  const handleCopyToClipboard = async (): Promise<boolean> => {
    try {
      const { blob } = await renderCompositeExport(
        cutoutUrl,
        backdrop,
        retainShadows,
        "png"
      );

      if (typeof window !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {!hasImage ? (
        <RemoveBackgroundDropzone
          onFileSelect={handleFileProcess}
          onSelectSample={handleSelectSample}
          isProcessing={isProcessing}
        />
      ) : (
        <>
          {/* Workspace Top Header Bar */}
          <RemoveBackgroundHeaderBar
            fileName={fileName}
            width={width}
            height={height}
            onReplaceFile={handleFileProcess}
            onReset={handleReset}
            isProcessing={isProcessing}
          />

          {/* Main Bento Layout: Canvas (8 cols) + Sidebar Controls (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <RemoveBackgroundCanvasStage
                originalUrl={originalUrl}
                cutoutUrl={cutoutUrl}
                backdrop={backdrop}
                brushMode={brushMode}
                brushSize={brushSize}
                zoomLevel={zoomLevel}
                retainShadows={retainShadows}
                subjectBoundsDesc={subjectBoundsDesc}
                isProcessing={isProcessing}
                onBrushModeChange={setBrushMode}
                onBrushSizeChange={setBrushSize}
                onZoomChange={setZoomLevel}
              />
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <RemoveBackgroundSidebar
                backdrop={backdrop}
                feather={feather}
                sensitivity={sensitivity}
                retainShadows={retainShadows}
                exportFormat={exportFormat}
                originalFileSize={originalFileSize}
                cutoutFileSize={cutoutFileSize}
                isProcessing={isProcessing}
                onBackdropChange={setBackdrop}
                onFeatherChange={setFeather}
                onSensitivityChange={handleSensitivityChange}
                onRetainShadowsToggle={() => setRetainShadows(!retainShadows)}
                onExportFormatChange={setExportFormat}
                onDownload={handleDownload}
                onCopyToClipboard={handleCopyToClipboard}
              />
            </div>
          </div>

          {/* Sticky Metaphor Tips & Hotkeys Banner */}
          <div className="mt-2">
            <RemoveBackgroundTips />
          </div>
        </>
      )}
    </div>
  );
}
