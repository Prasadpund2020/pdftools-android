import { PDFDocument } from "pdf-lib";
import { StagedImage, ImageToPdfSettings, PageOrientation, PageFormat, PageMargin } from "./types";

// Standard page sizes in points (72 points/inch)
const PAGE_SIZES: Record<"a4" | "letter", { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612.0, height: 792.0 },
};

const MARGIN_SIZES: Record<PageMargin, number> = {
  none: 0,
  small: 20,
  wide: 40,
};

/**
 * Loads an image from a URL or data URL and returns an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image: " + e));
    img.src = src;
  });
}

/**
 * Rotates an image and compresses it to JPEG format using an offscreen canvas
 */
async function processImageCanvas(
  img: HTMLImageElement,
  rotation: number,
  qualityPercent: number
): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  const normRotation = ((rotation % 360) + 360) % 360;
  const isPerpendicular = normRotation === 90 || normRotation === 270;

  const canvas = document.createElement("canvas");
  const targetWidth = isPerpendicular ? img.naturalHeight || img.height : img.naturalWidth || img.width;
  const targetHeight = isPerpendicular ? img.naturalWidth || img.width : img.naturalHeight || img.height;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  // Fill clean white background so transparent PNGs don't turn black in JPEG
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  ctx.save();
  if (normRotation === 90) {
    ctx.translate(targetWidth, 0);
    ctx.rotate((90 * Math.PI) / 180);
  } else if (normRotation === 180) {
    ctx.translate(targetWidth, targetHeight);
    ctx.rotate((180 * Math.PI) / 180);
  } else if (normRotation === 270) {
    ctx.translate(0, targetHeight);
    ctx.rotate((270 * Math.PI) / 180);
  }

  ctx.drawImage(img, 0, 0);
  ctx.restore();

  const quality = Math.max(0.4, Math.min(1.0, qualityPercent / 100));
  const dataUrl = canvas.toDataURL("image/jpeg", quality);

  // Convert base64 dataUrl to Uint8Array
  const base64 = dataUrl.split(",")[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return {
    bytes,
    width: targetWidth,
    height: targetHeight,
  };
}

/**
 * Calculates page dimensions based on format, orientation, and image size
 */
function calculatePageDimensions(
  format: PageFormat,
  orientation: PageOrientation,
  imgWidth: number,
  imgHeight: number
): { pageWidth: number; pageHeight: number } {
  if (format === "fit") {
    return { pageWidth: imgWidth, pageHeight: imgHeight };
  }

  const base = PAGE_SIZES[format];
  const isImgLandscape = imgWidth > imgHeight;

  let isLandscape = false;
  if (orientation === "auto") {
    isLandscape = isImgLandscape;
  } else if (orientation === "landscape") {
    isLandscape = true;
  } else {
    isLandscape = false;
  }

  const width = isLandscape ? Math.max(base.width, base.height) : Math.min(base.width, base.height);
  const height = isLandscape ? Math.min(base.width, base.height) : Math.max(base.width, base.height);

  return { pageWidth: width, pageHeight: height };
}

export interface ConvertProgressCallback {
  (current: number, total: number, stepMessage: string): void;
}

/**
 * Main function to convert staged images into a compiled PDF Blob
 */
export async function convertImagesToPdf(
  images: StagedImage[],
  settings: ImageToPdfSettings,
  onProgress?: ConvertProgressCallback
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error("No images to convert");
  }

  const total = images.length;
  onProgress?.(0, total, "Initializing PDF document engine...");

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Converted Images");
  pdfDoc.setCreator("FileLab Studio Image to PDF");
  pdfDoc.setProducer("FileLab Client Engine (WASM / pdf-lib)");

  const marginPt = MARGIN_SIZES[settings.margin];

  for (let i = 0; i < total; i++) {
    const item = images[i];
    onProgress?.(i + 1, total, `Processing image ${i + 1} of ${total}: ${item.name}...`);

    // 1. Load image
    const htmlImg = await loadImage(item.previewUrl);

    // 2. Rotate & compress
    const { bytes, width: processedW, height: processedH } = await processImageCanvas(
      htmlImg,
      item.rotation,
      settings.quality
    );

    // 3. Embed into PDF
    const embeddedImage = await pdfDoc.embedJpg(bytes);

    // 4. Determine page dimensions
    const { pageWidth, pageHeight } = calculatePageDimensions(
      settings.pageSize,
      settings.orientation,
      processedW,
      processedH
    );

    // 5. Calculate drawing coordinates with margin & aspect ratio preservation
    const availWidth = Math.max(10, pageWidth - marginPt * 2);
    const availHeight = Math.max(10, pageHeight - marginPt * 2);

    const scale = Math.min(availWidth / processedW, availHeight / processedH);
    const drawWidth = processedW * scale;
    const drawHeight = processedH * scale;

    const x = marginPt + (availWidth - drawWidth) / 2;
    const y = marginPt + (availHeight - drawHeight) / 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  onProgress?.(total, total, "Compiling final PDF binary...");
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
}
