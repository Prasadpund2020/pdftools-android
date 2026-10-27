export interface WebPConversionItem {
  id: string;
  name: string;
  originalSizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  status: "pending" | "converting" | "done" | "error";
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSizeBytes?: number;
  reductionPercentage?: number;
  error?: string;
}

export interface WebPOptions {
  quality: number; // 10 to 100
  lossless: boolean;
  maxWidth?: number;
}
