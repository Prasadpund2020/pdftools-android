export type BrushMode = "erase" | "restore";
export type ExportFormat = "png" | "webp";
export type SensitivityMode = "auto" | "high";
export type ZoomLevel = 1 | 1.25 | 1.8;

export interface BackdropConfig {
  type: "transparent" | "color" | "image";
  value: string; // "transparent", hex like "#ffffff", or data URL for image
  name?: string;
}

export interface CutoutSample {
  id: string;
  title: string;
  category: "Portrait" | "Product" | "Fashion" | "Pet";
  fileName: string;
  originalUrl: string;
  cutoutUrl: string;
  width: number;
  height: number;
  originalSize: number;
  cutoutSize: number;
  subjectBounds: string;
}

export interface RemoveBackgroundState {
  currentSampleId: string | null;
  fileName: string;
  width: number;
  height: number;
  originalFileSize: number;
  cutoutFileSize: number;
  originalUrl: string;
  cutoutUrl: string;
  backdrop: BackdropConfig;
  brushMode: BrushMode;
  brushSize: number;
  zoomLevel: ZoomLevel;
  feather: number; // 0 to 100
  sensitivity: SensitivityMode;
  retainShadows: boolean;
  exportFormat: ExportFormat;
  isComparing: boolean;
  isProcessing: boolean;
  statusMessage: string;
}
