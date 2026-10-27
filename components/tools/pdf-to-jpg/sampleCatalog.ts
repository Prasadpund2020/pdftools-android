import { ProofPage, LoadedPdfInfo } from "./types";

/**
 * Creates high-detail procedural canvas thumbnail previews for the 8 pages of
 * Catalog_Spring_2025.pdf so the workspace is immediately functional and offline-ready.
 */
function createPageCanvas(pageNumber: number): string {
  if (typeof window === "undefined") return "";

  const canvas = document.createElement("canvas");
  const w = 450;
  const h = 600; // 3:4 aspect ratio
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Base background
  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(0, 0, w, h);

  if (pageNumber === 1) {
    // Page 1: Cover
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#c25e36");
    grad.addColorStop(0.6, "#e07a4f");
    grad.addColorStop(1, "#f4a261");
    ctx.fillStyle = grad;
    ctx.fillRect(20, 20, w - 40, h * 0.65);

    // Architectural arches
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, 220 + i * 20, 90 + i * 15, Math.PI, 0);
      ctx.stroke();
    }

    // Modern Typography
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SPRING 2025", w / 2, 110);
    ctx.font = "12px sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("ARCHITECTURAL INTERIORS", w / 2, 135);

    // Lower label
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("VOLUME XIV • EDITORIAL", 30, h * 0.78);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("Minimalist living in warm terracotta & sand", 30, h * 0.83);
  } else if (pageNumber === 2) {
    // Page 2: Interior catalog spread (beige vases)
    ctx.fillStyle = "#f5ecea";
    ctx.fillRect(25, 25, (w - 60) / 2, h * 0.55);
    ctx.fillRect((w + 10) / 2, 25, (w - 60) / 2, h * 0.55);

    // Ceramic vase silhouettes
    ctx.fillStyle = "#d5c867";
    ctx.beginPath();
    ctx.ellipse(w * 0.28, 180, 45, 75, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fd761a";
    ctx.beginPath();
    ctx.ellipse(w * 0.72, 195, 38, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Two-column text lines
    ctx.fillStyle = "#3e4850";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("COLLECTION NO. 04", 30, h * 0.68);
    ctx.fillText("CERAMIC VESSELS", (w + 10) / 2, h * 0.68);

    ctx.fillStyle = "#8a949e";
    for (let y = h * 0.73; y < h * 0.92; y += 16) {
      ctx.fillRect(30, y, (w - 70) / 2, 6);
      ctx.fillRect((w + 10) / 2, y, (w - 70) / 2, 6);
    }
  } else if (pageNumber === 3) {
    // Page 3: Woodworking Studio
    const woodGrad = ctx.createLinearGradient(0, 0, w, h);
    woodGrad.addColorStop(0, "#783200");
    woodGrad.addColorStop(0.5, "#9d4300");
    woodGrad.addColorStop(1, "#341100");
    ctx.fillStyle = woodGrad;
    ctx.fillRect(20, 20, w - 40, h * 0.6);

    // Woodgrain lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    for (let y = 40; y < h * 0.6; y += 22) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.bezierCurveTo(w * 0.3, y + 10, w * 0.6, y - 8, w - 30, y + 6);
      ctx.stroke();
    }

    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ARTISANAL WOODWORK", 30, h * 0.72);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("Solid cedar & brushed brass joinery", 30, h * 0.78);
  } else if (pageNumber === 4) {
    // Page 4: Product Spec Matrix
    ctx.fillStyle = "#006591";
    ctx.fillRect(30, 40, w - 60, 4);

    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("SPECIFICATION MATRIX", 30, 75);

    // Grid table
    ctx.strokeStyle = "#bec8d2";
    ctx.lineWidth = 1;
    for (let y = 110; y <= 450; y += 38) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 30, y);
      ctx.stroke();
    }

    // Columns
    ctx.beginPath();
    ctx.moveTo(170, 110);
    ctx.lineTo(170, 450);
    ctx.moveTo(310, 110);
    ctx.lineTo(310, 450);
    ctx.stroke();
  } else if (pageNumber === 5) {
    // Page 5: Textile Swatches
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("TEXTILE SWATCHES", 30, 60);

    const colors = [
      "#c25e36", "#e07a4f", "#f4a261",
      "#264653", "#2a9d8f", "#e76f51",
      "#d4a373", "#ccd5ae", "#e9edc9"
    ];

    colors.forEach((col, idx) => {
      const colX = 35 + (idx % 3) * 125;
      const colY = 90 + Math.floor(idx / 3) * 135;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.roundRect(colX, colY, 110, 95, 8);
      ctx.fill();
    });
  } else if (pageNumber === 6) {
    // Page 6: Material Finishes
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("NATURAL OILED FINISHES", 30, 60);

    const circles = [
      { col: "#e29578", name: "Warm Terracotta" },
      { col: "#83c5be", name: "Sage Mist" },
      { col: "#006d77", name: "Deep Cyan" },
      { col: "#ffddd2", name: "Linen Sand" },
    ];

    circles.forEach((c, idx) => {
      const cy = 130 + idx * 95;
      ctx.fillStyle = c.col;
      ctx.beginPath();
      ctx.arc(75, cy, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1e1b1a";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(c.name, 125, cy - 5);
      ctx.fillStyle = "#6e7881";
      ctx.font = "12px sans-serif";
      ctx.fillText("Code #FL-" + (idx + 104), 125, cy + 15);
    });
  } else if (pageNumber === 7) {
    // Page 7: Back cover lookbook preview
    ctx.fillStyle = "#efe6e4";
    ctx.fillRect(30, 40, w - 60, h * 0.55);

    ctx.strokeStyle = "#006591";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(50, 60, w - 100, h * 0.45);

    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FILELAB STUDIO EDITIONS", w / 2, h * 0.72);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("ISBN 978-0-241-52904-8", w / 2, h * 0.77);
    ctx.fillText("Printed with vegetable archival inks", w / 2, h * 0.81);
  } else {
    // Page 8: Index & QR Portal
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("INDEX & DIGITAL PORTAL", 30, 60);

    // Mock QR box
    const qrSize = 130;
    const qx = (w - qrSize) / 2;
    const qy = 120;
    ctx.strokeStyle = "#1e1b1a";
    ctx.lineWidth = 4;
    ctx.strokeRect(qx, qy, qrSize, qrSize);

    // QR corners
    ctx.fillStyle = "#1e1b1a";
    ctx.fillRect(qx + 10, qy + 10, 30, 30);
    ctx.fillRect(qx + qrSize - 40, qy + 10, 30, 30);
    ctx.fillRect(qx + 10, qy + qrSize - 40, 30, 30);

    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scan to access live 3D web model", w / 2, 300);

    ctx.fillStyle = "#8a949e";
    ctx.font = "11px sans-serif";
    ctx.fillText("FileLab High-Fidelity Client Demux 2025", w / 2, h * 0.88);
  }

  return canvas.toDataURL("image/jpeg", 0.9);
}

export function getSampleCatalogPages(): ProofPage[] {
  const p1 = createPageCanvas(1);
  const p2 = createPageCanvas(2);
  const p3 = createPageCanvas(3);
  const p4 = createPageCanvas(4);
  const p5 = createPageCanvas(5);
  const p6 = createPageCanvas(6);
  const p7 = createPageCanvas(7);
  const p8 = createPageCanvas(8);

  return [
    { pageNumber: 1, label: "Page 1", badgeLabel: "Cover", sizeFormatted: "2.4 MB", sizeBytes: 2516582, previewUrl: p1, isSelected: true },
    { pageNumber: 2, label: "Page 2", sizeFormatted: "1.9 MB", sizeBytes: 1992294, previewUrl: p2, isSelected: true },
    { pageNumber: 3, label: "Page 3", sizeFormatted: "2.1 MB", sizeBytes: 2202009, previewUrl: p3, isSelected: true },
    { pageNumber: 4, label: "Page 4", sizeFormatted: "1.3 MB", sizeBytes: 1363148, previewUrl: p4, isSelected: true },
    { pageNumber: 5, label: "Page 5", sizeFormatted: "2.8 MB", sizeBytes: 2936012, previewUrl: p5, isSelected: true },
    { pageNumber: 6, label: "Page 6", sizeFormatted: "1.7 MB", sizeBytes: 1782579, previewUrl: p6, isSelected: true },
    { pageNumber: 7, label: "Page 7", sizeFormatted: "1.8 MB", sizeBytes: 1887436, previewUrl: p7, isSelected: true },
    { pageNumber: 8, label: "Page 8", badgeLabel: "Rear", sizeFormatted: "2.3 MB", sizeBytes: 2411724, previewUrl: p8, isSelected: true },
  ];
}

export function getSamplePdfInfo(): LoadedPdfInfo {
  return {
    name: "Catalog_Spring_2025.pdf",
    pageCount: 8,
    fileSizeBytes: 17196646, // 16.4 MB
    formattedSize: "16.4 MB",
    colorProfile: "CMYK Embedded",
  };
}
