import JSZip from "jszip";
import { WebPConversionItem, WebPOptions } from "./types";

/**
 * Converts a single image to WebP format in client-side memory.
 */
export async function convertImageToWebP(
  item: WebPConversionItem,
  options: WebPOptions
): Promise<{ blob: Blob; url: string; sizeBytes: number; reduction: number }> {
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
          reject(new Error("Failed to create canvas context"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0);

        const qualityParam = options.lossless ? 1.0 : options.quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }

            const url = URL.createObjectURL(blob);
            const sizeBytes = blob.size;
            const reduction =
              item.originalSizeBytes > 0
                ? Math.round(
                    ((item.originalSizeBytes - sizeBytes) /
                      item.originalSizeBytes) *
                      100
                  )
                : 0;

            resolve({ blob, url, sizeBytes, reduction });
          },
          "image/webp",
          qualityParam
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
 * Packages multiple converted WebP blobs into a clean ZIP archive.
 */
export async function createWebPZipBundle(
  items: WebPConversionItem[]
): Promise<Blob> {
  const zip = new JSZip();

  items.forEach((item) => {
    if (item.convertedBlob) {
      const baseName = item.name.replace(/\.[^/.]+$/, "");
      zip.file(`${baseName}.webp`, item.convertedBlob);
    }
  });

  return await zip.generateAsync({ type: "blob" });
}

/**
 * Generates sample photography items for live demonstration.
 */
export function generateWebpSampleItems(): WebPConversionItem[] {
  const makeSample = (
    title: string,
    color1: string,
    color2: string,
    w: number,
    h: number
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(title, 60, h / 2 - 20);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "24px sans-serif";
      ctx.fillText(`${w} × ${h} px • High Quality Source Asset`, 60, h / 2 + 30);
    }
    const dataUrl = canvas.toDataURL("image/png");
    return {
      id: `sample-${Math.random().toString(36).substring(2, 7)}`,
      name: `${title.toLowerCase().replace(/\s+/g, "_")}.png`,
      originalWidth: w,
      originalHeight: h,
      originalSizeBytes: Math.round(dataUrl.length * 0.75),
      previewUrl: dataUrl,
      status: "pending" as const,
    };
  };

  return [
    makeSample("Product_Catalog_Photo", "#0891b2", "#0284c7", 1920, 1080),
    makeSample("Hero_Banner_Summer", "#d97706", "#dc2626", 1600, 900),
    makeSample("Studio_Portrait_Shoot", "#059669", "#0d9488", 1200, 1200),
  ];
}
