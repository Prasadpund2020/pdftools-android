export type PageOrientation = "auto" | "portrait" | "landscape";
export type PageFormat = "a4" | "letter" | "fit";
export type PageMargin = "none" | "small" | "wide";

export interface StagedImage {
  id: string;
  file?: File;
  name: string;
  sizeBytes: number;
  formattedSize: string;
  format: string;
  previewUrl: string;
  rotation: number; // 0 | 90 | 180 | 270
  naturalWidth: number;
  naturalHeight: number;
}

export interface ImageToPdfSettings {
  orientation: PageOrientation;
  pageSize: PageFormat;
  margin: PageMargin;
  quality: number; // 40 - 100
}

export interface RecentPdf {
  id: string;
  fileName: string;
  fileCount: number;
  fileSize: string;
  timestamp: string;
  blobUrl?: string;
  themeColor?: string;
}
