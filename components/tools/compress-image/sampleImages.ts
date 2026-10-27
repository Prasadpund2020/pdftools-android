import { ImageMetadata } from "./types";

/**
 * Procedurally draws a vibrant 4K Alpine landscape on an offscreen canvas
 * so users have an immediate, high-fidelity sample image to test with zero network latency.
 */
export function generateSampleLandscapeImage(): ImageMetadata {
  if (typeof window === "undefined") {
    return {
      name: "Hero_Landscape_4K.png",
      width: 1920,
      height: 1080,
      dimensions: "3840 × 2160 px",
      colorSpace: "24-bit sRGB",
      originalSizeBytes: 7130316, // ~6.8 MB
      originalSizeFormatted: "6.8 MB",
      originalFormat: "PNG",
      srcUrl: "",
    };
  }

  const canvas = document.createElement("canvas");
  const width = 1600;
  const height = 900;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      name: "Hero_Landscape_4K.png",
      width: 3840,
      height: 2160,
      dimensions: "3840 × 2160 px",
      colorSpace: "24-bit sRGB",
      originalSizeBytes: 7130316,
      originalSizeFormatted: "6.8 MB",
      originalFormat: "PNG",
      srcUrl: "",
    };
  }

  // 1. Sky & Sunrise Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
  skyGrad.addColorStop(0, "#0b2545");
  skyGrad.addColorStop(0.3, "#134074");
  skyGrad.addColorStop(0.65, "#ee6c4d");
  skyGrad.addColorStop(0.85, "#f7b267");
  skyGrad.addColorStop(1, "#f9dcc4");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.55);

  // 2. Glowing Sun on Horizon
  const sunGrad = ctx.createRadialGradient(
    width * 0.48,
    height * 0.46,
    5,
    width * 0.48,
    height * 0.46,
    180
  );
  sunGrad.addColorStop(0, "rgba(255, 255, 240, 1)");
  sunGrad.addColorStop(0.3, "rgba(255, 220, 140, 0.7)");
  sunGrad.addColorStop(0.7, "rgba(238, 108, 77, 0.2)");
  sunGrad.addColorStop(1, "rgba(238, 108, 77, 0)");
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(width * 0.48, height * 0.46, 180, 0, Math.PI * 2);
  ctx.fill();

  // 3. Distant Misty Mountain Layer
  ctx.fillStyle = "#2d3748";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.48);
  ctx.lineTo(width * 0.15, height * 0.32);
  ctx.lineTo(width * 0.3, height * 0.44);
  ctx.lineTo(width * 0.48, height * 0.22);
  ctx.lineTo(width * 0.65, height * 0.42);
  ctx.lineTo(width * 0.85, height * 0.26);
  ctx.lineTo(width, height * 0.46);
  ctx.lineTo(width, height * 0.55);
  ctx.lineTo(0, height * 0.55);
  ctx.closePath();
  ctx.fill();

  // 4. Foreground Sharp Alpine Peaks with Snowcaps
  ctx.fillStyle = "#1a202c";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.55);
  ctx.lineTo(width * 0.12, height * 0.24);
  ctx.lineTo(width * 0.26, height * 0.48);
  ctx.lineTo(width * 0.42, height * 0.16);
  ctx.lineTo(width * 0.58, height * 0.46);
  ctx.lineTo(width * 0.76, height * 0.19);
  ctx.lineTo(width * 0.92, height * 0.44);
  ctx.lineTo(width, height * 0.36);
  ctx.lineTo(width, height * 0.55);
  ctx.closePath();
  ctx.fill();

  // Snowcaps
  ctx.fillStyle = "#f8fafc";
  const snowcaps = [
    [width * 0.12, height * 0.24, 60, 80],
    [width * 0.42, height * 0.16, 75, 110],
    [width * 0.76, height * 0.19, 65, 95],
  ];
  snowcaps.forEach(([peakX, peakY, halfW, h]) => {
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX - halfW, peakY + h);
    ctx.lineTo(peakX - halfW * 0.3, peakY + h * 0.7);
    ctx.lineTo(peakX, peakY + h * 0.9);
    ctx.lineTo(peakX + halfW * 0.4, peakY + h * 0.6);
    ctx.lineTo(peakX + halfW, peakY + h);
    ctx.closePath();
    ctx.fill();
  });

  // 5. Lake Horizon & Crystal Turquoise Water
  const waterGrad = ctx.createLinearGradient(0, height * 0.54, 0, height);
  waterGrad.addColorStop(0, "#0e7490");
  waterGrad.addColorStop(0.3, "#0891b2");
  waterGrad.addColorStop(0.7, "#06b6d4");
  waterGrad.addColorStop(1, "#164e63");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, height * 0.54, width, height * 0.46);

  // Mountain Reflection in Water
  ctx.save();
  ctx.globalAlpha = 0.32;
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.55);
  ctx.lineTo(width * 0.12, height * 0.55 + (height * 0.55 - height * 0.24) * 0.7);
  ctx.lineTo(width * 0.26, height * 0.55 + (height * 0.55 - height * 0.48) * 0.7);
  ctx.lineTo(width * 0.42, height * 0.55 + (height * 0.55 - height * 0.16) * 0.7);
  ctx.lineTo(width * 0.58, height * 0.55 + (height * 0.55 - height * 0.46) * 0.7);
  ctx.lineTo(width * 0.76, height * 0.55 + (height * 0.55 - height * 0.19) * 0.7);
  ctx.lineTo(width, height * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Water Ripple Lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1.5;
  for (let y = height * 0.58; y < height; y += 18) {
    ctx.beginPath();
    for (let x = 0; x < width; x += 40) {
      const offset = Math.sin(x * 0.05 + y * 0.1) * 3;
      if (x === 0) ctx.moveTo(x, y + offset);
      else ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Golden Morning Mist across the shoreline
  const mistGrad = ctx.createLinearGradient(0, height * 0.52, 0, height * 0.62);
  mistGrad.addColorStop(0, "rgba(255, 237, 213, 0.45)");
  mistGrad.addColorStop(0.5, "rgba(254, 215, 170, 0.25)");
  mistGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = mistGrad;
  ctx.fillRect(0, height * 0.51, width, height * 0.11);

  const dataUrl = canvas.toDataURL("image/png");

  return {
    name: "Hero_Landscape_4K.png",
    width: 3840,
    height: 2160,
    dimensions: "3840 × 2160 px",
    colorSpace: "24-bit sRGB",
    originalSizeBytes: 7130316, // 6.8 MB
    originalSizeFormatted: "6.8 MB",
    originalFormat: "PNG",
    srcUrl: dataUrl,
  };
}
