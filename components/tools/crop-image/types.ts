export type CropAspectRatio = "free" | "1:1" | "16:9" | "9:16" | "4:5" | "4:3" | "3:2" | "2:3";

export type OutputFormat = "original" | "webp" | "jpeg" | "png";

export interface CropRect {
  x: number; // In source image coordinates
  y: number;
  width: number;
  height: number;
}

export interface ImageCropMeta {
  file?: File;
  name: string;
  originalWidth: number;
  originalHeight: number;
  originalSizeBytes: number;
  aspectRatio: number;
  dataUrl: string;
  mimeType: string;
}

export interface CropTransformOptions {
  cropRect: CropRect;
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  outputFormat: OutputFormat;
  quality: number; // 1 - 100
}

export interface CroppedResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
}
