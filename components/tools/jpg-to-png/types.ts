export interface JpgToPngItem {
  id: string;
  name: string;
  originalSizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  status: "pending" | "converting" | "done" | "error";
  pngBlob?: Blob;
  pngUrl?: string;
  pngSizeBytes?: number;
  error?: string;
}

export interface JpgToPngOptions {
  preserveTransparency: boolean;
  maxWidth?: number;
}
