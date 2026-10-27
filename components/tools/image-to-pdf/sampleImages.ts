import { StagedImage } from "./types";

/**
 * Creates canvas-rendered sample images so that users can test the conversion
 * instantly without needing to find local files or depend on external CDNs.
 */
function createSampleDataUrl(type: "receipt" | "contract" | "chart" | "id"): {
  url: string;
  width: number;
  height: number;
} {
  if (typeof window === "undefined") {
    return { url: "", width: 600, height: 800 };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { url: "", width: 600, height: 800 };

  if (type === "receipt") {
    canvas.width = 600;
    canvas.height = 850;

    // Background paper
    ctx.fillStyle = "#faf7f2";
    ctx.fillRect(0, 0, 600, 850);

    // Subtle paper noise / vignette
    ctx.strokeStyle = "#e8e0d5";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 560, 810);

    // Header
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("APEX STORE #402", 300, 75);

    ctx.font = "14px monospace";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("104 MARKET STREET • SUITE 200", 300, 105);
    ctx.fillText("TAX INVOICE / RECEIPT", 300, 128);
    ctx.fillText("DATE: 2026-10-22   TIME: 14:32:08", 300, 150);

    // Divider
    ctx.strokeStyle = "#1e1b1a";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(40, 175);
    ctx.lineTo(560, 175);
    ctx.stroke();
    ctx.setLineDash([]);

    // Items
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "left";
    ctx.fillText("ITEM DESCRIPTION", 40, 210);
    ctx.textAlign = "right";
    ctx.fillText("AMOUNT", 560, 210);

    const items = [
      ["Hardware Security Token (Titan)", "$ 45.00"],
      ["Studio Headset Pro Gen 2", "$ 189.50"],
      ["USB-C Braided Hub 100W", "$ 34.00"],
      ["Ergonomic Birch Palm Rest", "$ 28.00"],
      ["Matte Document Folio Sleeve", "$ 14.50"],
    ];

    let y = 250;
    ctx.font = "14px monospace";
    items.forEach(([name, price]) => {
      ctx.textAlign = "left";
      ctx.fillStyle = "#1e1b1a";
      ctx.fillText(name, 40, y);
      ctx.textAlign = "right";
      ctx.fillText(price, 560, y);
      y += 38;
    });

    // Divider
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(40, y + 10);
    ctx.lineTo(560, y + 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Totals
    y += 50;
    ctx.font = "15px monospace";
    ctx.textAlign = "left";
    ctx.fillText("SUBTOTAL", 40, y);
    ctx.textAlign = "right";
    ctx.fillText("$ 311.00", 560, y);

    y += 30;
    ctx.fillText("TAX (8.25%)", 40, y);
    ctx.fillText("$  25.66", 560, y);

    y += 35;
    ctx.font = "bold 20px monospace";
    ctx.fillText("TOTAL PAID", 40, y);
    ctx.fillText("$ 336.66", 560, y);

    // Barcode mock
    y += 60;
    ctx.fillStyle = "#1e1b1a";
    for (let x = 80; x < 520; x += 6) {
      if ((x * 13) % 7 > 2) {
        ctx.fillRect(x, y, 3, 50);
      }
    }
  } else if (type === "contract") {
    canvas.width = 650;
    canvas.height = 900;

    // Crisp parchment background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 650, 900);

    // Top Header
    ctx.fillStyle = "#006591";
    ctx.fillRect(50, 45, 550, 4);

    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 24px serif";
    ctx.textAlign = "center";
    ctx.fillText("MUTUAL NON-DISCLOSURE AGREEMENT", 325, 95);

    ctx.font = "italic 13px serif";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("Revision 4.2 • Execution Copy • Confidential", 325, 120);

    // Body lines
    ctx.textAlign = "left";
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#333333";

    let y = 170;
    const paragraphs = [
      "This Mutual Non-Disclosure Agreement (the \"Agreement\") is entered into as of the",
      "Effective Date by and between the Participating Entities referenced below.",
      "",
      "1. DEFINITION OF CONFIDENTIAL INFORMATION",
      "\"Confidential Information\" shall include all technical, operational, design, algorithm,",
      "and business data disclosed by one Party to the other under this Sandbox Workspace.",
      "",
      "2. OBLIGATIONS & SECURITY CONTROLS",
      "Each Party covenants to maintain the secrecy of Confidential Information with the highest",
      "standard of care, ensuring no unauthorized vector transmission or server storage.",
      "",
      "3. LOCAL EXECUTION GUARANTEE",
      "All automated document operations are performed purely in client device memory via WebAssembly."
    ];

    paragraphs.forEach((line) => {
      if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#006591";
      } else {
        ctx.font = "13px sans-serif";
        ctx.fillStyle = "#3e4850";
      }
      ctx.fillText(line, 55, y);
      y += 24;
    });

    // Signature box
    y += 50;
    ctx.strokeStyle = "#bec8d2";
    ctx.strokeRect(55, y, 240, 120);
    ctx.strokeRect(365, y, 240, 120);

    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("PARTY A SIGNATURE", 65, y + 25);
    ctx.fillText("PARTY B SIGNATURE", 375, y + 25);

    // Mock stamp
    ctx.strokeStyle = "#ba1a1a";
    ctx.lineWidth = 2;
    ctx.strokeRect(400, y + 45, 150, 45);
    ctx.fillStyle = "#ba1a1a";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("VERIFIED STAMP", 420, y + 72);
  } else if (type === "chart") {
    canvas.width = 750;
    canvas.height = 550;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 750, 550);

    // Title
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Quarterly Analytics & Conversion Velocity", 45, 60);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#6e7881";
    ctx.fillText("Client-side performance benchmark • 2026 Q3 metrics", 45, 90);

    // Bar chart bars
    const bars = [
      { label: "JPG", val: 280, color: "#fd761a" },
      { label: "PNG", val: 340, color: "#0ea5e9" },
      { label: "WebP", val: 420, color: "#10b981" },
      { label: "HEIC", val: 240, color: "#8b5cf6" },
      { label: "PDF", val: 460, color: "#f59e0b" },
    ];

    const chartX = 80;
    const chartY = 440;
    const barWidth = 60;
    const gap = 65;

    // Grid lines
    ctx.strokeStyle = "#e9e1df";
    ctx.lineWidth = 1;
    for (let h = 0; h <= 400; h += 100) {
      ctx.beginPath();
      ctx.moveTo(chartX, chartY - h);
      ctx.lineTo(650, chartY - h);
      ctx.stroke();
    }

    bars.forEach((b, i) => {
      const bx = chartX + i * (barWidth + gap) + 30;
      const by = chartY - b.val;

      // Bar
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(bx, by, barWidth, b.val, [8, 8, 0, 0]);
      ctx.fill();

      // Value label
      ctx.fillStyle = "#1e1b1a";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${b.val}k`, bx + barWidth / 2, by - 10);

      // Category label
      ctx.fillStyle = "#6e7881";
      ctx.font = "13px sans-serif";
      ctx.fillText(b.label, bx + barWidth / 2, chartY + 25);
    });
  } else {
    // ID card
    canvas.width = 650;
    canvas.height = 420;

    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, 650, 420);

    // Gradient banner
    const grad = ctx.createLinearGradient(0, 0, 650, 0);
    grad.addColorStop(0, "#006591");
    grad.addColorStop(1, "#0ea5e9");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 650, 90);

    // Company text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("FILELAB SECURITY CREDENTIAL", 30, 50);

    // Avatar box
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.roundRect(40, 130, 160, 200, 12);
    ctx.fill();

    // Silhouette
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.arc(120, 200, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(120, 310, 65, Math.PI, 0);
    ctx.fill();

    // Card Details
    ctx.textAlign = "left";
    ctx.fillStyle = "#1e1b1a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("ALEX RIVERA", 240, 165);

    ctx.fillStyle = "#006591";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("VP OF PLATFORM ARCHITECTURE", 240, 195);

    ctx.fillStyle = "#64748b";
    ctx.font = "13px sans-serif";
    ctx.fillText("ID NUMBER: FL-89204-ENG", 240, 240);
    ctx.fillText("CLEARANCE: LEVEL 5 (UNRESTRICTED)", 240, 268);
    ctx.fillText("EXPIRES: 2029-12-31", 240, 296);

    // Chip
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(520, 140, 65, 45);
    ctx.strokeStyle = "#b45309";
    ctx.strokeRect(520, 140, 65, 45);
  }

  return {
    url: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
  };
}

export function getSampleImages(): StagedImage[] {
  const receipt = createSampleDataUrl("receipt");
  const contract = createSampleDataUrl("contract");
  const chart = createSampleDataUrl("chart");
  const id = createSampleDataUrl("id");

  return [
    {
      id: "sample-1",
      name: "Receipt_Nov.jpg",
      sizeBytes: 1468006,
      formattedSize: "1.4 MB",
      format: "JPG",
      previewUrl: receipt.url,
      rotation: 0,
      naturalWidth: receipt.width,
      naturalHeight: receipt.height,
    },
    {
      id: "sample-2",
      name: "Contract_Scan_p1.png",
      sizeBytes: 2726297,
      formattedSize: "2.6 MB",
      format: "PNG",
      previewUrl: contract.url,
      rotation: 0,
      naturalWidth: contract.width,
      naturalHeight: contract.height,
    },
    {
      id: "sample-3",
      name: "Chart_Asset.png",
      sizeBytes: 1153433,
      formattedSize: "1.1 MB",
      format: "PNG",
      previewUrl: chart.url,
      rotation: 0,
      naturalWidth: chart.width,
      naturalHeight: chart.height,
    },
    {
      id: "sample-4",
      name: "Photo_ID.png",
      sizeBytes: 1782579,
      formattedSize: "1.7 MB",
      format: "PNG",
      previewUrl: id.url,
      rotation: 0,
      naturalWidth: id.width,
      naturalHeight: id.height,
    },
  ];
}
