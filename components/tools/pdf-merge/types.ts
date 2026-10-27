export interface MergePdfItem {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
  thumbnailUrl?: string;
  rotation: number; // 0, 90, 180, 270
}

export interface MergeOptions {
  outputFileName: string;
  addPageNumbers: boolean;
  pageNumberPosition: "bottom-center" | "bottom-right";
  normalizePageSizes: "original" | "a4" | "letter";
}

export interface MergeResult {
  blob: Blob;
  downloadUrl: string;
  fileName: string;
  sizeBytes: number;
  totalPages: number;
  fileCount: number;
}
