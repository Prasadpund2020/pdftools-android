export type ImageFormat = "jpg" | "png" | "webp";
export type DpiLevel = 72 | 150 | 300 | 600;
export type ColorMode = "srgb" | "grayscale";
export type ConversionMode = "entire-pages" | "extract-images";

export interface ProofPage {
  pageNumber: number;
  label: string;
  badgeLabel?: string;
  sizeFormatted: string;
  sizeBytes: number;
  previewUrl: string;
  isSelected: boolean;
  width?: number;
  height?: number;
}

export interface LoadedPdfInfo {
  name: string;
  pageCount: number;
  fileSizeBytes: number;
  formattedSize: string;
  colorProfile: string;
  file?: File;
  arrayBuffer?: ArrayBuffer;
}

export interface ExportSettings {
  format: ImageFormat;
  dpi: DpiLevel;
  colorMode: ColorMode;
  mode: ConversionMode;
}
