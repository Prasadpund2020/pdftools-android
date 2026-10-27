export type WatermarkType = "text" | "logo";

export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "tile";

export type OutputFormat = "original" | "webp" | "jpeg" | "png";

export interface WatermarkSourceMeta {
  file?: File;
  name: string;
  originalWidth: number;
  originalHeight: number;
  originalSizeBytes: number;
  aspectRatio: number;
  dataUrl: string;
  mimeType: string;
}

export interface WatermarkOptions {
  type: WatermarkType;
  text: string;
  fontSizeRatio: number; // percentage of image height (e.g. 0.05 = 5%)
  fontFamily: string;
  color: string;
  opacity: number; // 0 to 1
  rotation: number; // -90 to +90 degrees
  position: WatermarkPosition;
  tileGap: number; // For tile mode
  logoDataUrl?: string;
  logoScale: number; // 0.1 to 1.0
  outputFormat: OutputFormat;
  quality: number; // 1 to 100
}

export interface WatermarkResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
}
