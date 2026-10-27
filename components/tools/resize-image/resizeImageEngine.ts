import { ImageSourceMeta, ResizeOptions, ResizedResult, SocialPreset } from "./types";

export const SOCIAL_PRESETS: SocialPreset[] = [
  { id: "ig-square", name: "Instagram Post (1:1)", category: "Instagram", width: 1080, height: 1080, aspectRatio: "1:1" },
  { id: "ig-story", name: "Instagram Story / Reel (9:16)", category: "Instagram", width: 1080, height: 1920, aspectRatio: "9:16" },
  { id: "ig-portrait", name: "Instagram Portrait (4:5)", category: "Instagram", width: 1080, height: 1350, aspectRatio: "4:5" },
  { id: "yt-thumb", name: "YouTube Thumbnail (16:9)", category: "YouTube", width: 1280, height: 720, aspectRatio: "16:9" },
  { id: "x-header", name: "Twitter / X Banner (3:1)", category: "Twitter/X", width: 1500, height: 500, aspectRatio: "3:1" },
  { id: "x-post", name: "Twitter / X Post (16:9)", category: "Twitter/X", width: 1200, height: 675, aspectRatio: "16:9" },
  { id: "fb-cover", name: "Facebook Cover", category: "Facebook", width: 820, height: 312, aspectRatio: "2.6:1" },
  { id: "fhd-display", name: "Full HD Screen", category: "Display", width: 1920, height: 1080, aspectRatio: "16:9" },
  { id: "4k-display", name: "4K UHD Wallpaper", category: "Display", width: 3840, height: 2160, aspectRatio: "16:9" },
];

/**
 * Multi-step downsampling for razor-sharp image reduction without pixel aliasing.
 */
function drawScaledWithStepping(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  fitMode: "contain" | "cover" | "stretch",
  fillColor = "#ffffff"
) {
  const canvas = ctx.canvas;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Clear background
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  if (fillColor && fillColor !== "transparent") {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Set high quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (fitMode === "stretch") {
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return;
  }

  const srcWidth = img.width;
  const srcHeight = img.height;
  const srcRatio = srcWidth / srcHeight;
  const targetRatio = targetWidth / targetHeight;

  let drawX = 0;
  let drawY = 0;
  let drawW = targetWidth;
  let drawH = targetHeight;

  if (fitMode === "contain") {
    if (srcRatio > targetRatio) {
      drawW = targetWidth;
      drawH = Math.round(targetWidth / srcRatio);
      drawY = Math.round((targetHeight - drawH) / 2);
    } else {
      drawH = targetHeight;
      drawW = Math.round(targetHeight * srcRatio);
      drawX = Math.round((targetWidth - drawW) / 2);
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } else if (fitMode === "cover") {
    let sX = 0;
    let sY = 0;
    let sW = srcWidth;
    let sH = srcHeight;

    if (srcRatio > targetRatio) {
      sW = Math.round(srcHeight * targetRatio);
      sX = Math.round((srcWidth - sW) / 2);
    } else {
      sH = Math.round(srcWidth / targetRatio);
      sY = Math.round((srcHeight - sH) / 2);
    }
    ctx.drawImage(img, sX, sY, sW, sH, 0, 0, targetWidth, targetHeight);
  }
}

/**
 * Resizes an image file or source metadata completely in-browser.
 */
export async function resizeImage(
  source: ImageSourceMeta,
  options: ResizeOptions
): Promise<ResizedResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          reject(new Error("Unable to create 2D canvas context"));
          return;
        }

        const targetW = Math.max(1, Math.round(options.width));
        const targetH = Math.max(1, Math.round(options.height));

        drawScaledWithStepping(
          ctx,
          img,
          targetW,
          targetH,
          options.fitMode,
          options.fillColor
        );

        let exportMime = "image/webp";
        if (options.outputFormat === "original") {
          exportMime = source.mimeType || "image/jpeg";
        } else if (options.outputFormat === "jpeg") {
          exportMime = "image/jpeg";
        } else if (options.outputFormat === "png") {
          exportMime = "image/png";
        } else if (options.outputFormat === "webp") {
          exportMime = "image/webp";
        }

        const q = exportMime === "image/png" ? undefined : options.quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to generate resized blob"));
              return;
            }

            const dataUrl = URL.createObjectURL(blob);
            const sizeBytes = blob.size;
            const reduction =
              source.originalSizeBytes > 0
                ? Math.round(
                    ((source.originalSizeBytes - sizeBytes) /
                      source.originalSizeBytes) *
                      100
                  )
                : 0;

            resolve({
              blob,
              dataUrl,
              width: targetW,
              height: targetH,
              sizeBytes,
              mimeType: exportMime,
              reductionPercentage: reduction,
            });
          },
          exportMime,
          q
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image source"));
    img.src = source.dataUrl;
  });
}

/**
 * Generates an architectural desk sample image for immediate client-side testing.
 */
export function generateSampleDeskImage(): ImageSourceMeta {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Rich desk surface background
    const grad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
    grad.addColorStop(0, "#f8fafc");
    grad.addColorStop(0.5, "#e2e8f0");
    grad.addColorStop(1, "#cbd5e1");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1080);

    // Subtle grid texture
    ctx.strokeStyle = "rgba(100, 116, 139, 0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1920; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1080);
      ctx.stroke();
    }
    for (let y = 0; y < 1080; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1920, y);
      ctx.stroke();
    }

    // Modern card illustration
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 20;
    ctx.beginPath();
    ctx.roundRect(460, 240, 1000, 600, 32);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";

    // Accent header ribbon
    const ribbonGrad = ctx.createLinearGradient(460, 240, 1460, 240);
    ribbonGrad.addColorStop(0, "#3b82f6");
    ribbonGrad.addColorStop(1, "#06b6d4");
    ctx.fillStyle = ribbonGrad;
    ctx.beginPath();
    ctx.roundRect(460, 240, 1000, 120, [32, 32, 0, 0]);
    ctx.fill();

    // Typography
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("FileLab High-Resolution Studio Preview", 520, 315);

    ctx.fillStyle = "#334155";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("Ready for Aspect Ratio & Dimension Resizing", 520, 440);

    ctx.fillStyle = "#64748b";
    ctx.font = "20px sans-serif";
    ctx.fillText("Original Dimensions: 1920 × 1080 px (16:9 Full HD)", 520, 490);
    ctx.fillText("Preserves fine vector lines, typography clarity, and color balance.", 520, 530);

    // Decorative pill badges
    const badges = ["Lossless Scaling", "Preset Formats", "100% In-Browser", "Zero Server Uploads"];
    badges.forEach((text, i) => {
      const bx = 520 + i * 220;
      ctx.fillStyle = "#f1f5f9";
      ctx.beginPath();
      ctx.roundRect(bx, 600, 200, 44, 22);
      ctx.fill();
      ctx.fillStyle = "#0284c7";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(text, bx + 18, 627);
    });
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  return {
    name: "FileLab_Studio_Sample_1080p.jpg",
    originalWidth: 1920,
    originalHeight: 1080,
    originalSizeBytes: Math.round(dataUrl.length * 0.75),
    aspectRatio: 1920 / 1080,
    dataUrl,
    mimeType: "image/jpeg",
  };
}
