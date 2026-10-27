"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ImageMetadata,
  CompressionProfile,
  OutputFormat,
  CompressedResult,
  RecentCompressedFile,
} from "./types";
import { generateSampleLandscapeImage } from "./sampleImages";
import { compressImage } from "./imageCompressionEngine";
import CompressImageHeaderBar from "./CompressImageHeaderBar";
import CompressImageDropzone from "./CompressImageDropzone";
import CompressImageSplitSlider from "./CompressImageSplitSlider";
import CompressImageControls from "./CompressImageControls";
import CompressImageInspectionSheet from "./CompressImageInspectionSheet";
import CompressImageNextSteps from "./CompressImageNextSteps";

const RECENT_KEY = "filelab_compress_image_recent";

export default function CompressImageTool() {
  const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Settings
  const [currentProfile, setCurrentProfile] = useState<CompressionProfile>("balanced");
  const [quality, setQuality] = useState<number>(82);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");

  // Output Results & Processing
  const [compressedResult, setCompressedResult] = useState<CompressedResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Recent files
  const [recentFiles, setRecentFiles] = useState<RecentCompressedFile[]>([
    {
      id: "recent-1",
      name: "Banner_Summer.webp",
      size: "420 KB",
      reduction: "-78%",
      formatBadge: "WEBP",
      badgeBg: "bg-blue-100 text-blue-800",
      timestamp: "10m ago",
    },
    {
      id: "recent-2",
      name: "Profile_Portrait.jpg",
      size: "890 KB",
      reduction: "-64%",
      formatBadge: "JPG",
      badgeBg: "bg-orange-100 text-orange-800",
      timestamp: "1h ago",
    },
  ]);

  // Perform compression calculation
  const executeCompression = useCallback(
    async (meta: ImageMetadata, q: number, fmt: OutputFormat) => {
      try {
        const result = await compressImage(meta, q, fmt);
        setCompressedResult(result);
      } catch (err) {
        console.error("Compression error:", err);
      }
    },
    []
  );

  // Initialize with sample 4K landscape image on mount
  useEffect(() => {
    try {
      const sample = generateSampleLandscapeImage();
      setImageMeta(sample);
      executeCompression(sample, 82, "webp");

      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentFiles(parsed);
        }
      }
    } catch {
      // fallback
    }
    setIsInitialized(true);
  }, [executeCompression]);

  // Handle Profile Switch
  const handleSelectProfile = (profile: CompressionProfile, newQuality: number) => {
    setCurrentProfile(profile);
    setQuality(newQuality);
    if (imageMeta) {
      executeCompression(imageMeta, newQuality, outputFormat);
    }
  };

  // Handle Custom Quality Slider
  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    // Auto-unselect fixed profile if slider moved away from presets
    if (newQuality === 95) setCurrentProfile("lossless");
    else if (newQuality === 82) setCurrentProfile("balanced");
    else if (newQuality === 62) setCurrentProfile("ultra");
    else setCurrentProfile("balanced");

    if (imageMeta) {
      executeCompression(imageMeta, newQuality, outputFormat);
    }
  };

  // Handle Format Switch
  const handleFormatChange = (newFormat: OutputFormat) => {
    setOutputFormat(newFormat);
    if (imageMeta) {
      executeCompression(imageMeta, quality, newFormat);
    }
  };

  // Handle Reset to Default Sample
  const handleReset = () => {
    const sample = generateSampleLandscapeImage();
    setImageMeta(sample);
    setCurrentProfile("balanced");
    setQuality(82);
    setOutputFormat("webp");
    executeCompression(sample, 82, "webp");
  };

  // Handle User Uploading New Image
  const handleUploadNewImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const ext = file.name.split(".").pop()?.toUpperCase() || "IMG";
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const meta: ImageMetadata = {
        name: file.name,
        width: img.naturalWidth || 1920,
        height: img.naturalHeight || 1080,
        dimensions: `${img.naturalWidth || 1920} × ${img.naturalHeight || 1080} px`,
        colorSpace: "24-bit sRGB",
        originalSizeBytes: file.size,
        originalSizeFormatted: `${sizeMb} MB`,
        originalFormat: ext,
        srcUrl: url,
      };

      setImageMeta(meta);
      executeCompression(meta, quality, outputFormat);
    };
  };

  // Handle Download Action
  const handleDownload = () => {
    if (!compressedResult || !imageMeta) return;

    setIsDownloading(true);

    const baseName = imageMeta.name.replace(/\.[^/.]+$/, "");
    const downloadName = `${baseName}_optimized.${compressedResult.fileExtension}`;

    const link = document.createElement("a");
    link.href = compressedResult.blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Add to recent files
    const badgeColor =
      compressedResult.fileExtension === "webp"
        ? "bg-blue-100 text-blue-800"
        : compressedResult.fileExtension === "avif"
        ? "bg-purple-100 text-purple-800"
        : "bg-orange-100 text-orange-800";

    const newEntry: RecentCompressedFile = {
      id: `recent-${Date.now()}`,
      name: downloadName,
      size: compressedResult.sizeFormatted,
      reduction: `-${compressedResult.reductionPercent}%`,
      formatBadge: compressedResult.fileExtension.toUpperCase(),
      badgeBg: badgeColor,
      blobUrl: compressedResult.blobUrl,
      timestamp: "Just now",
    };

    const updated = [newEntry, ...recentFiles.slice(0, 9)];
    setRecentFiles(updated);
    try {
      const toStore = updated.map(({ blobUrl: _, ...rest }) => rest);
      localStorage.setItem(RECENT_KEY, JSON.stringify(toStore));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  // Handle Download from Recent
  const handleDownloadRecent = (item: RecentCompressedFile) => {
    if (item.blobUrl) {
      const link = document.createElement("a");
      link.href = item.blobUrl;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      handleDownload();
    }
  };

  // Handle Clear Recent
  const handleClearRecent = () => {
    setRecentFiles([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // ignore
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full min-h-[450px] flex items-center justify-center bg-stone-50 rounded-3xl border border-stone-200">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-stone-500">
            Initializing Image Optimizer Studio...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Breadcrumb & Workspace Header with Clay Tool Identity */}
      <CompressImageHeaderBar onReset={handleReset} />

      {/* Main Workspace Layout: 12-Column Responsive Metaphor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT & CENTER: Interactive Visual Comparison & Controls (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!imageMeta ? (
            <CompressImageDropzone
              onImageSelected={handleUploadNewImage}
              onLoadSample={handleReset}
            />
          ) : (
            <>
              {/* Interactive Before / After Split Slider Stage */}
              <CompressImageSplitSlider
                imageMeta={imageMeta}
                compressedResult={compressedResult}
              />

              {/* Tactile Control Station: Compression Strategies & Format Switch */}
              <CompressImageControls
                currentProfile={currentProfile}
                onSelectProfile={handleSelectProfile}
                quality={quality}
                onQualityChange={handleQualityChange}
                outputFormat={outputFormat}
                onFormatChange={handleFormatChange}
                compressedResult={compressedResult}
                onDownload={handleDownload}
                onUploadNewImage={handleUploadNewImage}
                isDownloading={isDownloading}
              />
            </>
          )}
        </div>

        {/* RIGHT SIDE: Desk Clipboard, Telemetry & Inspection Sheet (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <CompressImageInspectionSheet
            compressedResult={compressedResult}
            recentFiles={recentFiles}
            onDownloadRecent={handleDownloadRecent}
            onClearRecent={handleClearRecent}
          />
        </div>
      </div>

      {/* Bottom Tool Belt / Next Steps */}
      <CompressImageNextSteps />
    </div>
  );
}
