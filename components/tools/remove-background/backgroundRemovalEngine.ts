import { BackdropConfig, ExportFormat } from "./types";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Loads an image from a URL or File into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image: " + e));
    img.src = src;
  });
}

/**
 * Client-side color segmentation & alpha matting engine.
 * Inspects border pixels and flood segmentates uniform/gradient background,
 * maintaining subject boundaries and feather softness.
 */
export async function processBackgroundRemoval(
  imageSrc: string,
  sensitivity: "auto" | "high",
  featherPercent: number
): Promise<{
  cutoutDataUrl: string;
  width: number;
  height: number;
  boundsDesc: string;
}> {
  const img = await loadImage(imageSrc);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // Max dimension for real-time browser canvas processing to maintain 60fps
  const maxDim = 2400;
  let canvasW = width;
  let canvasH = height;
  if (canvasW > maxDim || canvasH > maxDim) {
    if (canvasW > canvasH) {
      canvasH = Math.round((canvasH * maxDim) / canvasW);
      canvasW = maxDim;
    } else {
      canvasW = Math.round((canvasW * maxDim) / canvasH);
      canvasH = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not create 2D canvas context");

  ctx.drawImage(img, 0, 0, canvasW, canvasH);
  const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imgData.data;

  // Sample corner pixel colors to estimate background
  const samplePoints = [
    [0, 0],
    [canvasW - 1, 0],
    [0, canvasH - 1],
    [canvasW - 1, canvasH - 1],
    [Math.floor(canvasW / 2), 0],
    [0, Math.floor(canvasH / 2)],
    [canvasW - 1, Math.floor(canvasH / 2)],
  ];

  const bgColors: [number, number, number][] = [];
  for (const [x, y] of samplePoints) {
    const idx = (y * canvasW + x) * 4;
    bgColors.push([data[idx], data[idx + 1], data[idx + 2]]);
  }

  // Tolerance threshold
  const threshold = sensitivity === "high" ? 42 : 32;
  const feather = Math.max(0, Math.min(100, featherPercent)) / 100;
  const featherBand = 18 * (1 + feather);

  let minX = canvasW;
  let maxX = 0;
  let minY = canvasH;
  let maxY = 0;

  for (let y = 0; y < canvasH; y++) {
    for (let x = 0; x < canvasW; x++) {
      const idx = (y * canvasW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const currentAlpha = data[idx + 3];

      if (currentAlpha === 0) continue;

      // Find minimum color distance to any sampled background tone
      let minDistance = Infinity;
      for (const [bgR, bgG, bgB] of bgColors) {
        // Euclidean color distance with slight weight for human luminance perception
        const dr = (r - bgR) * 0.3;
        const dg = (g - bgG) * 0.59;
        const db = (b - bgB) * 0.11;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < minDistance) minDistance = dist;
      }

      if (minDistance < threshold) {
        // Outside / background
        data[idx + 3] = 0;
      } else if (minDistance < threshold + featherBand) {
        // Feather transition band
        const factor = (minDistance - threshold) / featherBand;
        data[idx + 3] = Math.round(currentAlpha * Math.pow(factor, 1.2));
      } else {
        // Subject foreground pixel
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const cutoutDataUrl = canvas.toDataURL("image/png");

  const subjWidth = maxX > minX ? maxX - minX : width;
  const subjHeight = maxY > minY ? maxY - minY : height;
  const boundsDesc = `${subjWidth}×${subjHeight}px`;

  return {
    cutoutDataUrl,
    width,
    height,
    boundsDesc,
  };
}

/**
 * Composites the cutout with the selected backdrop (transparent, color, or image),
 * applies optional contact shadow, and generates the final output Blob.
 */
export async function renderCompositeExport(
  cutoutSrc: string,
  backdrop: BackdropConfig,
  retainShadows: boolean,
  format: ExportFormat
): Promise<{ blob: Blob; dataUrl: string; sizeBytes: number }> {
  const cutoutImg = await loadImage(cutoutSrc);
  const w = cutoutImg.naturalWidth || cutoutImg.width;
  const h = cutoutImg.naturalHeight || cutoutImg.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create export canvas");

  // 1. Draw Backdrop
  if (backdrop.type === "color") {
    ctx.fillStyle = backdrop.value;
    ctx.fillRect(0, 0, w, h);
  } else if (backdrop.type === "image" && backdrop.value) {
    try {
      const bgImg = await loadImage(backdrop.value);
      // Scale cover
      const scale = Math.max(w / bgImg.width, h / bgImg.height);
      const bgW = bgImg.width * scale;
      const bgH = bgImg.height * scale;
      const posX = (w - bgW) / 2;
      const posY = (h - bgH) / 2;
      ctx.drawImage(bgImg, posX, posY, bgW, bgH);
    } catch {
      // Fallback to white if background image fails
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
  }
  // If "transparent", canvas remains clear alpha (0,0,0,0)

  // 2. Draw Optional Grounding Contact Shadow
  if (retainShadows) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = Math.round(w * 0.035);
    ctx.shadowOffsetY = Math.round(h * 0.025);
    ctx.drawImage(cutoutImg, 0, 0, w, h);
    ctx.restore();
  }

  // 3. Draw Cutout Subject on top
  ctx.drawImage(cutoutImg, 0, 0, w, h);

  const mimeType = format === "webp" ? "image/webp" : "image/png";
  const quality = format === "webp" ? 0.92 : undefined;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to produce export blob"));
          return;
        }
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve({
          blob,
          dataUrl,
          sizeBytes: blob.size,
        });
      },
      mimeType,
      quality
    );
  });
}
