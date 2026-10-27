"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { StagedImage, ImageToPdfSettings, RecentPdf } from "./types";
import { getSampleImages } from "./sampleImages";
import { convertImagesToPdf } from "./ImageToPdfEngine";
import ImageToPdfHeaderBar from "./ImageToPdfHeaderBar";
import ImageToPdfDropzone from "./ImageToPdfDropzone";
import ImageToPdfStagingWell from "./ImageToPdfStagingWell";
import ImageToPdfSettingsDeck from "./ImageToPdfSettingsDeck";
import ImageToPdfClipboard from "./ImageToPdfClipboard";

const RECENT_HISTORY_KEY = "filelab_image_to_pdf_recent";

export default function ImageToPdfTool() {
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const [settings, setSettings] = useState<ImageToPdfSettings>({
    orientation: "auto",
    pageSize: "a4",
    margin: "small",
    quality: 85,
  });

  const [recentHistory, setRecentHistory] = useState<RecentPdf[]>([
    {
      id: "initial-1",
      fileName: "Portfolio_Deck.pdf",
      fileCount: 8,
      fileSize: "4.2 MB",
      timestamp: "12m ago",
      themeColor: "bg-orange-100 text-orange-700",
    },
    {
      id: "initial-2",
      fileName: "Tax_Receipts_Q3.pdf",
      fileCount: 5,
      fileSize: "2.8 MB",
      timestamp: "1h ago",
      themeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "initial-3",
      fileName: "Scanned_Whiteboard.pdf",
      fileCount: 2,
      fileSize: "1.9 MB",
      timestamp: "Yesterday",
      themeColor: "bg-amber-100 text-amber-700",
    },
  ]);

  // Load sample images & saved history on initial client mount
  useEffect(() => {
    try {
      const samples = getSampleImages();
      setStagedImages(samples);

      const saved = localStorage.getItem(RECENT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentHistory(parsed);
        }
      }
    } catch {
      // fallback
    }
    setIsInitialized(true);
  }, []);

  // Save history to localStorage
  const saveRecent = useCallback((newItems: RecentPdf[]) => {
    setRecentHistory(newItems);
    try {
      // store metadata only
      const toStore = newItems.map(({ blobUrl: _, ...rest }) => rest);
      localStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(toStore));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Total size in MB and bytes
  const { totalSizeBytes, totalSizeMb } = useMemo(() => {
    const bytes = stagedImages.reduce((sum, img) => sum + (img.sizeBytes || 0), 0);
    const mb = bytes / (1024 * 1024);
    return {
      totalSizeBytes: bytes,
      totalSizeMb: `${mb.toFixed(1)} MB`,
    };
  }, [stagedImages]);

  // File processing helper
  const processRawFiles = useCallback((files: FileList | File[]) => {
    const newItems: StagedImage[] = [];

    Array.from(files).forEach((file, index) => {
      const ext = file.name.split(".").pop()?.toUpperCase() || "IMG";
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const url = URL.createObjectURL(file);

      newItems.push({
        id: `img-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
        file,
        name: file.name,
        sizeBytes: file.size,
        formattedSize: `${sizeMb} MB`,
        format: ext,
        previewUrl: url,
        rotation: 0,
        naturalWidth: 800,
        naturalHeight: 600,
      });
    });

    setStagedImages((prev) => [...prev, ...newItems]);
  }, []);

  // Action: Rotate single image
  const handleRotate = useCallback((id: string) => {
    setStagedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  }, []);

  // Action: Remove single image
  const handleRemove = useCallback((id: string) => {
    setStagedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  // Action: Reorder
  const handleReorder = useCallback((newImages: StagedImage[]) => {
    setStagedImages(newImages);
  }, []);

  // Action: Clear all
  const handleClearAll = useCallback(() => {
    setStagedImages([]);
    setStatusMessage("");
  }, []);

  // Action: Load sample set
  const handleLoadSamples = useCallback(() => {
    const samples = getSampleImages();
    setStagedImages(samples);
    setStatusMessage("");
  }, []);

  // Action: Convert to PDF
  const handleConvert = async () => {
    if (stagedImages.length === 0 || isConverting) return;

    setIsConverting(true);
    setStatusMessage("Assembling pages...");

    try {
      const pdfBlob = await convertImagesToPdf(
        stagedImages,
        settings,
        (current, total, stepMsg) => {
          setStatusMessage(stepMsg);
        }
      );

      // Trigger automatic browser download
      const fileName =
        stagedImages.length === 1
          ? `${stagedImages[0].name.replace(/\.[^/.]+$/, "")}.pdf`
          : `Merged_Document_${stagedImages.length}_Pages.pdf`;

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to recent history
      const sizeStr = `${(pdfBlob.size / (1024 * 1024)).toFixed(1)} MB`;
      const newEntry: RecentPdf = {
        id: `pdf-${Date.now()}`,
        fileName,
        fileCount: stagedImages.length,
        fileSize: sizeStr,
        timestamp: "Just now",
        blobUrl: downloadUrl,
        themeColor: "bg-orange-100 text-orange-700",
      };

      saveRecent([newEntry, ...recentHistory.slice(0, 9)]);
      setStatusMessage("Download ready! PDF saved to your device.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Conversion failed. Please verify image formats.");
    } finally {
      setIsConverting(false);
    }
  };

  // Action: Re-download from recent history
  const handleDownloadRecent = useCallback((item: RecentPdf) => {
    if (item.blobUrl) {
      const link = document.createElement("a");
      link.href = item.blobUrl;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Trigger conversion with current images if matching
      handleConvert();
    }
  }, [handleConvert]);

  if (!isInitialized) {
    return (
      <div className="w-full min-h-[450px] flex items-center justify-center bg-stone-50 rounded-3xl border border-stone-200">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-stone-500">
            Initializing Image to PDF Desk...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden">
      {/* Ambient Studio Vignette & Warm Desk Accents */}
      <div className="absolute -top-32 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Workspace Breadcrumb & Physical Flow Bar */}
      <ImageToPdfHeaderBar
        stagedCount={stagedImages.length}
        totalSizeMb={totalSizeMb}
        onClearAll={handleClearAll}
      />

      {/* Main Workspace Grid: Staging Canvas (Left 8-cols) & Clipboard Desk (Right 4-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* STAGE DESK: Center Tool Area (Cols 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {stagedImages.length === 0 ? (
            <ImageToPdfDropzone
              onFilesSelected={processRawFiles}
              onLoadSamples={handleLoadSamples}
            />
          ) : (
            <>
              {/* Recessed Clay Well: Physical Drop Zone & Arrangement Board */}
              <ImageToPdfStagingWell
                images={stagedImages}
                onRotate={handleRotate}
                onRemove={handleRemove}
                onReorder={handleReorder}
                onAppendFiles={processRawFiles}
                onConvert={handleConvert}
                isConverting={isConverting}
              />

              {/* Conversion Settings Workbench Toolbar */}
              <ImageToPdfSettingsDeck
                settings={settings}
                onSettingsChange={setSettings}
                stagedCount={stagedImages.length}
                totalSizeBytes={totalSizeBytes}
                onConvert={handleConvert}
                isConverting={isConverting}
                statusMessage={statusMessage}
              />
            </>
          )}
        </div>

        {/* RIGHT CLIPBOARD & METAPHOR ACCESSORIES (Cols 9-12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ImageToPdfClipboard
            recentHistory={recentHistory}
            onDownloadRecent={handleDownloadRecent}
          />
        </div>
      </div>
    </div>
  );
}
