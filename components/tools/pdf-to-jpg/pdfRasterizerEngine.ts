import { ImageFormat, DpiLevel, ColorMode } from "./types";

/**
 * Dynamically loads pdfjs-dist in the browser to prevent SSR build issues
 */
export async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  return pdfjs;
}

/**
 * Loads a PDF document from an ArrayBuffer or File
 */
export async function loadPdfDoc(data: ArrayBuffer | File) {
  const pdfjs = await getPdfjs();
  const buffer = data instanceof File ? await data.arrayBuffer() : data;

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    cMapUrl: "/pdfjs/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "/pdfjs/standard_fonts/",
  });

  return await loadingTask.promise;
}

/**
 * Converts a Canvas to Grayscale pixels in-place
 */
export function applyGrayscaleFilter(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Converts canvas to image Blob based on format
 */
export function canvasToBlob(canvas: HTMLCanvasElement, format: ImageFormat): Promise<Blob> {
  return new Promise((resolve) => {
    if (format === "png") {
      canvas.toBlob((b) => resolve(b || new Blob()), "image/png");
    } else if (format === "webp") {
      canvas.toBlob((b) => resolve(b || new Blob()), "image/webp", 0.9);
    } else {
      // JPEG default 92%
      canvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", 0.92);
    }
  });
}

/**
 * Creates a ZIP archive containing multiple image blobs using JSZip
 */
export async function createZipArchive(
  files: { name: string; blob: Blob }[]
): Promise<Blob> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JSZipModule = ((await import("jszip" as any)) as any).default || (await import("jszip" as any));
  const zip = new JSZipModule();

  for (const f of files) {
    zip.file(f.name, f.blob);
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return zipBlob;
}

/**
 * Calculates estimated ZIP size and pixel dimensions per page
 */
export function calculateEstimates(
  selectedCount: number,
  dpi: DpiLevel,
  format: ImageFormat,
  colorMode: ColorMode
): { estZipSize: string; pixelDimensions: string; progressPct: number } {
  let sizeMultiplier =
    dpi === 72 ? 0.35 : dpi === 150 ? 0.9 : dpi === 300 ? 2.4 : 5.8;

  if (format === "png") sizeMultiplier *= 1.8;
  if (format === "webp") sizeMultiplier *= 0.65;
  if (colorMode === "grayscale") sizeMultiplier *= 0.6;

  const estMb = (selectedCount * sizeMultiplier).toFixed(1);
  const progressPct = Math.min(100, Math.max(10, Math.round((selectedCount / 8) * 100)));

  // Dimensions based on A4 standard at given DPI
  const scale = dpi / 72;
  const pxW = Math.round(595 * scale);
  const pxH = Math.round(842 * scale);
  const pixelDimensions = `${pxW} × ${pxH} px / page`;

  return {
    estZipSize: `~${estMb} MB ZIP`,
    pixelDimensions,
    progressPct,
  };
}
