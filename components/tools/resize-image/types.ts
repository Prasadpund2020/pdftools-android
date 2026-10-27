export type ResizeMode = "dimensions" | "percentage" | "preset";

export type OutputFormat = "original" | "webp" | "jpeg" | "png";

export interface SocialPreset {
  id: string;
  name: string;
  category: "Instagram" | "YouTube" | "Twitter/X" | "Facebook" | "Display";
  width: number;
  height: number;
  aspectRatio: string;
}

export interface ImageSourceMeta {
  file?: File;
  name: string;
  originalWidth: number;
  originalHeight: number;
  originalSizeBytes: number;
  aspectRatio: number;
  dataUrl: string;
  mimeType: string;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  outputFormat: OutputFormat;
  quality: number; // 1 - 100
  fillColor?: string; // For padding if aspect ratio mismatch
  fitMode: "contain" | "cover" | "stretch";
}

export interface ResizedResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
  reductionPercentage: number;
}
