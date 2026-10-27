import { ImageCropMeta, CropRect, CropTransformOptions, CroppedResult, CropAspectRatio } from "./types";

/**
 * Calculates initial centered crop rectangle based on aspect ratio preset.
 */
export function calculateInitialCrop(
  srcWidth: number,
  srcHeight: number,
  ratio: CropAspectRatio
): CropRect {
  if (ratio === "free") {
    // 85% centered box
    const w = Math.round(srcWidth * 0.85);
    const h = Math.round(srcHeight * 0.85);
    return {
      x: Math.round((srcWidth - w) / 2),
      y: Math.round((srcHeight - h) / 2),
      width: w,
      height: h,
    };
  }

  let targetRatio = 1;
  if (ratio === "1:1") targetRatio = 1;
  else if (ratio === "16:9") targetRatio = 16 / 9;
  else if (ratio === "9:16") targetRatio = 9 / 16;
  else if (ratio === "4:5") targetRatio = 4 / 5;
  else if (ratio === "4:3") targetRatio = 4 / 3;
  else if (ratio === "3:2") targetRatio = 3 / 2;
  else if (ratio === "2:3") targetRatio = 2 / 3;

  const currentRatio = srcWidth / srcHeight;
  let cropW = srcWidth;
  let cropH = srcHeight;

  if (currentRatio > targetRatio) {
    cropW = Math.round(srcHeight * targetRatio);
    cropH = srcHeight;
  } else {
    cropH = Math.round(srcWidth / targetRatio);
    cropW = srcWidth;
  }

  return {
    x: Math.max(0, Math.round((srcWidth - cropW) / 2)),
    y: Math.max(0, Math.round((srcHeight - cropH) / 2)),
    width: Math.min(srcWidth, Math.round(cropW)),
    height: Math.min(srcHeight, Math.round(cropH)),
  };
}

/**
 * Executes pixel-accurate crop, rotation, and export in-browser.
 */
export async function executeCrop(
  source: ImageCropMeta,
  options: CropTransformOptions
): Promise<CroppedResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const { cropRect, rotation, flipHorizontal, flipVertical, outputFormat, quality } =
          options;

        const cw = Math.max(1, Math.round(cropRect.width));
        const ch = Math.max(1, Math.round(cropRect.height));

        const canvas = document.createElement("canvas");
        const isSwapped = rotation === 90 || rotation === 270;
        canvas.width = isSwapped ? ch : cw;
        canvas.height = isSwapped ? cw : ch;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.save();
        // Translate to canvas center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        if (rotation !== 0) {
          ctx.rotate((rotation * Math.PI) / 180);
        }

        // Apply flips
        const scaleX = flipHorizontal ? -1 : 1;
        const scaleY = flipVertical ? -1 : 1;
        ctx.scale(scaleX, scaleY);

        // Draw cropped slice
        ctx.drawImage(
          img,
          Math.max(0, Math.round(cropRect.x)),
          Math.max(0, Math.round(cropRect.y)),
          cw,
          ch,
          -cw / 2,
          -ch / 2,
          cw,
          ch
        );

        ctx.restore();

        let exportMime = "image/webp";
        if (outputFormat === "original") {
          exportMime = source.mimeType || "image/jpeg";
        } else if (outputFormat === "jpeg") {
          exportMime = "image/jpeg";
        } else if (outputFormat === "png") {
          exportMime = "image/png";
        } else if (outputFormat === "webp") {
          exportMime = "image/webp";
        }

        const q = exportMime === "image/png" ? undefined : quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to generate cropped blob"));
              return;
            }

            const dataUrl = URL.createObjectURL(blob);
            resolve({
              blob,
              dataUrl,
              width: canvas.width,
              height: canvas.height,
              sizeBytes: blob.size,
              mimeType: exportMime,
            });
          },
          exportMime,
          q
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error("Failed to load source image"));
    img.src = source.dataUrl;
  });
}

/**
 * Creates high resolution demo landscape graphic.
 */
export function generateCropSampleImage(): ImageCropMeta {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 600);
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(0.5, "#38bdf8");
    skyGrad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1600, 600);

    // Warm sun
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(800, 320, 90, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountain layers
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.moveTo(0, 600);
    ctx.lineTo(350, 280);
    ctx.lineTo(750, 600);
    ctx.fill();

    ctx.fillStyle = "#0369a1";
    ctx.beginPath();
    ctx.moveTo(500, 600);
    ctx.lineTo(950, 220);
    ctx.lineTo(1400, 600);
    ctx.fill();

    ctx.fillStyle = "#0c4a6e";
    ctx.beginPath();
    ctx.moveTo(1050, 600);
    ctx.lineTo(1350, 330);
    ctx.lineTo(1600, 600);
    ctx.fill();

    // Ocean & water reflections
    const seaGrad = ctx.createLinearGradient(0, 600, 0, 1000);
    seaGrad.addColorStop(0, "#0f172a");
    seaGrad.addColorStop(0.5, "#1e293b");
    seaGrad.addColorStop(1, "#334155");
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 600, 1600, 400);

    // Grid guide lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(533, 0);
    ctx.lineTo(533, 1000);
    ctx.moveTo(1066, 0);
    ctx.lineTo(1066, 1000);
    ctx.moveTo(0, 333);
    ctx.lineTo(1600, 333);
    ctx.moveTo(0, 666);
    ctx.lineTo(1600, 666);
    ctx.stroke();

    // Typography
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("Golden Hour Mountainscape (1600 × 1000 px)", 60, 90);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.fillText("Interactive Crop Box: Drag edges or corners to reframe. Select 1:1, 16:9, or 4:5.", 60, 140);
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  return {
    name: "Golden_Hour_Mountainscape.jpg",
    originalWidth: 1600,
    originalHeight: 1000,
    originalSizeBytes: Math.round(dataUrl.length * 0.75),
    aspectRatio: 1600 / 1000,
    dataUrl,
    mimeType: "image/jpeg",
  };
}
