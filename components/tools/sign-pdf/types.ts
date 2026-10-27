export type SignatureMode = "draw" | "type" | "upload";

export interface InkColorOption {
  label: string;
  value: string;
}

export interface DocumentInfo {
  file: File | null;
  fileName: string;
  fileSize: number;
  arrayBuffer: ArrayBuffer | null;
  pageCount: number;
  isDemoSample: boolean;
}

export interface SignaturePlacement {
  x: number; // percentage (0-100) or coordinates
  y: number; // percentage (0-100)
  page: number;
}

export interface SignPdfState {
  doc: DocumentInfo | null;
  currentPage: number;
  zoomLevel: number;
  signerName: string;
  signerTitle: string;
  signingDate: string;
  attachAuditCert: boolean;
  signatureMode: SignatureMode;
  selectedInkColor: string;
  selectedThickness: number;
  typedSignature: string;
  isSignaturePlaced: boolean;
  signaturePlacement: SignaturePlacement;
  isProcessing: boolean;
  isSuccess: boolean;
}
