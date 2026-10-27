import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { MergePdfItem, MergeOptions, MergeResult } from "./types";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Parses an uploaded PDF file, calculates page count, and validates structure.
 */
export async function parsePdfFile(file: File): Promise<MergePdfItem> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  return {
    id: `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    size: file.size,
    pageCount,
    bytes,
    rotation: 0,
  };
}

/**
 * Combines multiple PDF documents into a unified, sanitized PDF document
 */
export async function mergePdfDocuments(
  items: MergePdfItem[],
  options: MergeOptions
): Promise<MergeResult> {
  if (items.length === 0) {
    throw new Error("At least one PDF file is required to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  // Optionally embed font for page numbering
  let helvFont = null;
  if (options.addPageNumbers) {
    helvFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  }

  let totalPages = 0;

  for (const item of items) {
    const srcDoc = await PDFDocument.load(item.bytes, {
      ignoreEncryption: true,
    });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      if (item.rotation !== 0) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + item.rotation) % 360));
      }

      // Optional normalization to A4 (595.28 × 841.89 pt) or Letter (612 × 792 pt)
      if (options.normalizePageSizes === "a4") {
        page.setSize(595.28, 841.89);
      } else if (options.normalizePageSizes === "letter") {
        page.setSize(612, 792);
      }

      mergedPdf.addPage(page);
      totalPages++;
    }
  }

  // Draw Page Numbers if enabled
  if (options.addPageNumbers && helvFont) {
    const pages = mergedPdf.getPages();
    pages.forEach((page, idx) => {
      const pageNumText = `Page ${idx + 1} of ${totalPages}`;
      const { width } = page.getSize();
      const textWidth = helvFont.widthOfTextAtSize(pageNumText, 9);

      let xPos = (width - textWidth) / 2;
      if (options.pageNumberPosition === "bottom-right") {
        xPos = width - textWidth - 36;
      }

      page.drawText(pageNumText, {
        x: xPos,
        y: 20,
        size: 9,
        font: helvFont,
        color: rgb(0.35, 0.35, 0.35),
      });
    });
  }

  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes as unknown as BlobPart], {
    type: "application/pdf",
  });
  const downloadUrl = URL.createObjectURL(blob);

  let finalFileName = options.outputFileName.trim();
  if (!finalFileName.endsWith(".pdf")) {
    finalFileName += ".pdf";
  }

  return {
    blob,
    downloadUrl,
    fileName: finalFileName,
    sizeBytes: blob.size,
    totalPages,
    fileCount: items.length,
  };
}
