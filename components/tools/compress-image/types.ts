export type CompressionProfile = "lossless" | "balanced" | "ultra";
export type OutputFormat = "original" | "webp" | "avif" | "jpeg" | "png";

export interface ImageMetadata {
  name: string;
  width: number;
  height: number;
  dimensions: string;
  colorSpace: string;
  originalSizeBytes: number;
  originalSizeFormatted: string;
  originalFormat: string;
  srcUrl: string;
}

export interface CompressedResult {
  blob: Blob;
  blobUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  reductionPercent: number;
  savedBytes: number;
  savedFormatted: string;
  psnrDb: number;
  processingTimeMs: number;
  simulatedLoadOriginalSec: number;
  simulatedLoadOptimizedSec: number;
  speedMultiplier: number;
  outputFormat: OutputFormat;
  targetMimeType: string;
  fileExtension: string;
  quality: number;
}

export interface RecentCompressedFile {
  id: string;
  name: string;
  size: string;
  reduction: string;
  formatBadge: string;
  badgeBg: string;
  blobUrl?: string;
  timestamp: string;
}
