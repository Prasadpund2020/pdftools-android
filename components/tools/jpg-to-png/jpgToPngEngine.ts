import JSZip from "jszip";
import { JpgToPngItem } from "./types";

/**
 * Converts a JPG/JPEG image to lossless PNG format in browser memory.
 */
export async function convertJpgToPng(
  item: JpgToPngItem
): Promise<{ blob: Blob; url: string; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve({ blob, url, sizeBytes: blob.size });
          },
          "image/png"
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image source"));
    img.src = item.previewUrl;
  });
}

/**
 * Packages multiple converted PNG files into a single ZIP archive.
 */
export async function createPngZipBundle(
  items: JpgToPngItem[]
): Promise<Blob> {
  const zip = new JSZip();

  items.forEach((item) => {
    if (item.pngBlob) {
      const baseName = item.name.replace(/\.[^/.]+$/, "");
      zip.file(`${baseName}.png`, item.pngBlob);
    }
  });

  return await zip.generateAsync({ type: "blob" });
}

/**
 * Generates sample JPG items for immediate client demonstration.
 */
export function generateJpgSampleItems(): JpgToPngItem[] {
  const makeSample = (title: string, color: string, w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(title, 50, h / 2 - 15);

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Dimensions: ${w} × ${h} px • Ready for Lossless PNG Transcoding`, 50, h / 2 + 30);
    }
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    return {
      id: `jpg-sample-${Math.random().toString(36).substring(2, 7)}`,
      name: `${title.toLowerCase().replace(/\s+/g, "_")}.jpg`,
      originalWidth: w,
      originalHeight: h,
      originalSizeBytes: Math.round(dataUrl.length * 0.75),
      previewUrl: dataUrl,
      status: "pending" as const,
    };
  };

  return [
    makeSample("Camera_Portrait_Raw", "#047857", 1400, 1400),
    makeSample("Landscape_Field_Sunset", "#b45309", 1600, 900),
    makeSample("Architectural_Blueprint", "#1e3a8a", 1920, 1080),
  ];
}
