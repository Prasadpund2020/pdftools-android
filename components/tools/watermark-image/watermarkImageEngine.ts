import { WatermarkSourceMeta, WatermarkOptions, WatermarkResult, WatermarkPosition } from "./types";

/**
 * Calculates coordinates for a watermark on a canvas based on position anchor.
 */
function getAnchorCoordinates(
  pos: WatermarkPosition,
  canvasW: number,
  canvasH: number,
  elementW: number,
  elementH: number,
  margin = 40
): { x: number; y: number } {
  switch (pos) {
    case "top-left":
      return { x: margin, y: margin };
    case "top-center":
      return { x: (canvasW - elementW) / 2, y: margin };
    case "top-right":
      return { x: canvasW - elementW - margin, y: margin };
    case "center-left":
      return { x: margin, y: (canvasH - elementH) / 2 };
    case "center":
      return { x: (canvasW - elementW) / 2, y: (canvasH - elementH) / 2 };
    case "center-right":
      return { x: canvasW - elementW - margin, y: (canvasH - elementH) / 2 };
    case "bottom-left":
      return { x: margin, y: canvasH - elementH - margin };
    case "bottom-center":
      return { x: (canvasW - elementW) / 2, y: canvasH - elementH - margin };
    case "bottom-right":
    default:
      return { x: canvasW - elementW - margin, y: canvasH - elementH - margin };
  }
}

/**
 * Applies watermark text or logo to source image in-browser.
 */
export async function applyWatermark(
  source: WatermarkSourceMeta,
  options: WatermarkOptions
): Promise<WatermarkResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw original image
        ctx.drawImage(img, 0, 0);

        ctx.save();
        ctx.globalAlpha = Math.max(0.05, Math.min(1, options.opacity));

        if (options.type === "text" && options.text.trim()) {
          // Calculate font size relative to image height
          const fontSize = Math.max(
            16,
            Math.round(canvas.height * (options.fontSizeRatio || 0.05))
          );
          ctx.font = `bold ${fontSize}px ${options.fontFamily || "sans-serif"}`;
          ctx.fillStyle = options.color || "#ffffff";
          ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          const metrics = ctx.measureText(options.text);
          const textW = metrics.width;
          const textH = fontSize;

          if (options.position === "tile") {
            // Full-bleed diagonal repeating tile watermark
            const stepX = textW + (options.tileGap || 120);
            const stepY = textH + (options.tileGap || 100);

            for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
              for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((options.rotation * Math.PI) / 180);
                ctx.fillText(options.text, 0, 0);
                ctx.restore();
              }
            }
          } else {
            // Single anchored position
            const coords = getAnchorCoordinates(
              options.position,
              canvas.width,
              canvas.height,
              textW,
              textH,
              Math.round(canvas.width * 0.035)
            );

            ctx.save();
            ctx.translate(coords.x + textW / 2, coords.y + textH / 2);
            if (options.rotation !== 0) {
              ctx.rotate((options.rotation * Math.PI) / 180);
            }
            ctx.fillText(options.text, -textW / 2, textH / 2);
            ctx.restore();
          }
        } else if (options.type === "logo" && options.logoDataUrl) {
          const logoImg = new Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.onload = () => {
            const scale = Math.max(0.05, Math.min(1, options.logoScale || 0.25));
            const targetLogoW = Math.round(canvas.width * scale);
            const targetLogoH = Math.round((logoImg.height / logoImg.width) * targetLogoW);

            const coords = getAnchorCoordinates(
              options.position,
              canvas.width,
              canvas.height,
              targetLogoW,
              targetLogoH,
              Math.round(canvas.width * 0.035)
            );

            ctx.save();
            ctx.translate(coords.x + targetLogoW / 2, coords.y + targetLogoH / 2);
            if (options.rotation !== 0) {
              ctx.rotate((options.rotation * Math.PI) / 180);
            }
            ctx.drawImage(
              logoImg,
              -targetLogoW / 2,
              -targetLogoH / 2,
              targetLogoW,
              targetLogoH
            );
            ctx.restore();
            exportCanvas();
          };
          logoImg.src = options.logoDataUrl;
          return;
        }

        ctx.restore();
        exportCanvas();

        function exportCanvas() {
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
                reject(new Error("Watermark canvas export failed"));
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
        }
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image source"));
    img.src = source.dataUrl;
  });
}

/**
 * Generates sample photography artwork for watermark demonstration.
 */
export function generateWatermarkSampleImage(): WatermarkSourceMeta {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 1800, 1100);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.4, "#1e293b");
    grad.addColorStop(1, "#334155");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1800, 1100);

    // Architectural shapes
    ctx.fillStyle = "rgba(249, 115, 22, 0.15)";
    ctx.beginPath();
    ctx.arc(400, 550, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
    ctx.beginPath();
    ctx.arc(1300, 480, 380, 0, Math.PI * 2);
    ctx.fill();

    // Central graphic
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 100, 1600, 900);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("Urban Architecture & Commercial Asset (1800 × 1100)", 160, 220);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px sans-serif";
    ctx.fillText("Ready for custom copyright text, logo stamps, or full-coverage diagonal tiles.", 160, 280);
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  return {
    name: "Architectural_Portfolio_Asset.jpg",
    originalWidth: 1800,
    originalHeight: 1100,
    originalSizeBytes: Math.round(dataUrl.length * 0.75),
    aspectRatio: 1800 / 1100,
    dataUrl,
    mimeType: "image/jpeg",
  };
}

export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  type: "text",
  text: "CONFIDENTIAL",
  fontSizeRatio: 0.06,
  fontFamily: "sans-serif",
  color: "#ffffff",
  opacity: 0.65,
  rotation: -30,
  position: "center",
  tileGap: 140,
  logoScale: 0.25,
  outputFormat: "original",
  quality: 90,
};

export function downloadWatermarkedFile(result: WatermarkResult, originalName = "watermarked-image") {
  const ext =
    result.mimeType === "image/png"
      ? ".png"
      : result.mimeType === "image/webp"
      ? ".webp"
      : ".jpg";
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const filename = `${baseName}-watermarked${ext}`;

  const link = document.createElement("a");
  link.href = result.dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
