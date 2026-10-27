"use client";

import { useState } from "react";
import PdfToWordDropzone from "./PdfToWordDropzone";
import PdfToWordFileCard from "./PdfToWordFileCard";
import PdfToWordSettings from "./PdfToWordSettings";
import PdfToWordConvertButton from "./PdfToWordConvertButton";
import PdfToWordPipeline from "./PdfToWordPipeline";
import PdfToWordSidebar from "./PdfToWordSidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageData {
  pageNum: number;
  text: string;
  lines: string[];
}

interface FileInfo {
  name: string;
  size: string;
  pages: number;
  hasText: boolean;
}

interface Settings {
  format: "docx" | "rtf" | "txt";
  pageRange: "all" | "custom";
  customRange: string;
  retainFormatting: boolean;
}

// ─── RTF generator ───────────────────────────────────────────────────────────

function generateRtf(pages: PageData[]): Blob {
  let rtf =
    "{\\rtf1\\ansi\\deff0\n" +
    "{\\fonttbl{\\f0 Times New Roman;}}\n" +
    "{\\colortbl;\\red192\\green57\\blue43;}\n" +
    "\\f0\\fs24\n";

  for (const page of pages) {
    if (page.pageNum > 1) rtf += "\\page\n";
    rtf += `{\\b\\cf1\\fs28 Page ${page.pageNum}}\\par\n`;
    for (const line of page.lines) {
      const escaped = line
        .replace(/\\/g, "\\\\")
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}");
      rtf += `${escaped}\\par\n`;
    }
  }
  rtf += "}";
  return new Blob([rtf], { type: "application/rtf" });
}

// ─── DOCX generator (JSZip) ──────────────────────────────────────────────────

async function generateDocx(pages: PageData[]): Promise<Blob> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let JSZip: any = null;
  try {
    // Dynamic import — jszip may or may not be installed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSZip = ((await import("jszip" as any)) as any).default;
  } catch {
    // JSZip not available — fall back to RTF
    return generateRtf(pages);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zip: any = new JSZip();

  // [Content_Types].xml
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
  );

  // _rels/.rels
  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // word/_rels/document.xml.rels
  zip.folder("word")!.folder("_rels")!.file(
    "document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  const escapeXml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Build body XML
  let bodyXml = "";
  for (const page of pages) {
    if (page.pageNum > 1) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
    bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t xml:space="preserve">Page ${page.pageNum}</w:t></w:r></w:p>`;
    for (const line of page.lines) {
      if (line.trim() === "") {
        bodyXml += `<w:p/>`;
      } else {
        bodyXml += `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`;
      }
    }
  }

  // word/document.xml
  zip.folder("word")!.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`
  );

  // word/styles.xml
  zip.folder("word")!.file(
    "styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:sz w:val="24"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="C0392B"/></w:rPr>
  </w:style>
</w:styles>`
  );

  const blob = await zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  return blob;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Parse custom range string like "1-3, 5" into a Set of page numbers. */
function parsePageRange(rangeStr: string, numPages: number): Set<number> {
  const result = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim());
  for (const part of parts) {
    const dash = part.indexOf("-");
    if (dash > 0) {
      const start = parseInt(part.slice(0, dash), 10);
      const end = parseInt(part.slice(dash + 1), 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(numPages, end); i++) {
          result.add(i);
        }
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= numPages) result.add(n);
    }
  }
  return result;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    format: "docx",
    pageRange: "all",
    customRange: "",
    retainFormatting: true,
  });

  // ── File selection ──────────────────────────────────────────────────────────

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("loading");
    setOutputBlob(null);
    setError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      // Quick check for text content on page 1
      const page1 = await pdf.getPage(1);
      const textContent = await page1.getTextContent();
      const hasText = textContent.items.length > 0;

      setFileInfo({
        name: selectedFile.name,
        size: formatBytes(selectedFile.size),
        pages: numPages,
        hasText,
      });
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to read PDF");
      setStatus("error");
    }
  };

  // ── Remove file ─────────────────────────────────────────────────────────────

  const handleRemove = () => {
    setFile(null);
    setFileInfo(null);
    setStatus("idle");
    setOutputBlob(null);
    setError(null);
    setProgress(0);
    setProgressStep("");
  };

  // ── Convert ─────────────────────────────────────────────────────────────────

  const handleConvert = async () => {
    if (!file) return;
    setStatus("converting");
    setProgress(0);
    setError(null);

    try {
      // Step 1: Load PDF
      setProgressStep("Reading PDF structure…");
      setProgress(15);

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      // Determine which pages to convert
      let pageNumbers: number[];
      if (settings.pageRange === "custom" && settings.customRange.trim()) {
        const rangeSet = parsePageRange(settings.customRange, numPages);
        pageNumbers =
          rangeSet.size > 0
            ? Array.from(rangeSet).sort((a, b) => a - b)
            : Array.from({ length: numPages }, (_, i) => i + 1);
      } else {
        pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);
      }

      // Step 2: Extract text from each page
      setProgressStep("Extracting text content…");
      setProgress(30);

      const pages: PageData[] = [];

      for (let idx = 0; idx < pageNumbers.length; idx++) {
        const pageNum = pageNumbers[idx];
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const items = textContent.items as Array<{ str: string; transform: number[] }>;

        if (settings.retainFormatting) {
          // Group items into lines based on Y position
          const lineMap = new Map<number, string[]>();
          for (const item of items) {
            const y = Math.round(item.transform[5]);
            if (!lineMap.has(y)) lineMap.set(y, []);
            lineMap.get(y)!.push(item.str);
          }
          const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
          const lines = sortedYs
            .map((y) => lineMap.get(y)!.join(" ").trim())
            .filter((l) => l.length > 0);
          const text = lines.join("\n");
          pages.push({ pageNum, text, lines });
        } else {
          const text = items.map((i) => i.str).join(" ");
          pages.push({ pageNum, text, lines: [text] });
        }

        setProgress(30 + Math.round(((idx + 1) / pageNumbers.length) * 40));
      }

      // Step 3: Generate output file
      setProgressStep("Generating Word document…");
      setProgress(80);

      let blob: Blob;
      if (settings.format === "rtf") {
        blob = generateRtf(pages);
      } else if (settings.format === "txt") {
        const allText = pages
          .map((p) => `--- Page ${p.pageNum} ---\n${p.text}`)
          .join("\n\n");
        blob = new Blob([allText], { type: "text/plain" });
      } else {
        blob = await generateDocx(pages);
      }

      setProgress(100);
      setProgressStep("Done!");
      setOutputBlob(blob);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Conversion failed");
      setStatus("error");
    }
  };

  // ── Download ─────────────────────────────────────────────────────────────────

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const ext =
      settings.format === "txt"
        ? "txt"
        : settings.format === "rtf"
        ? "rtf"
        : "docx";
    const baseName = file.name.replace(/\.pdf$/i, "");
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const showDropzone = status === "idle" && !file;
  const showFileCard = !!file && status !== "converting";
  const showConvertArea = !!file && status !== "converting";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left column (main) ──────────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Tool header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 border border-rose-200">
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">PDF to Word Converter</h1>
            <p className="text-xs text-slate-500">Extract text from PDF and export as a Word document</p>
          </div>
        </div>

        {/* Dropzone or pipeline */}
        {showDropzone && (
          <PdfToWordDropzone
            onFileSelect={handleFileSelect}
            isLoading={false}
          />
        )}

        {status === "loading" && !file && (
          <PdfToWordDropzone onFileSelect={handleFileSelect} isLoading />
        )}

        {status === "loading" && file && (
          <div className="flex items-center justify-center min-h-[120px] rounded-2xl bg-rose-50 border border-rose-200">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 border-[2.5px] border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-rose-600">Analysing PDF…</span>
            </div>
          </div>
        )}

        {status === "converting" && (
          <PdfToWordPipeline progress={progress} currentStep={progressStep} />
        )}

        {/* File card */}
        {showFileCard && file && (
          <PdfToWordFileCard
            file={file}
            fileInfo={fileInfo}
            onRemove={handleRemove}
          />
        )}

        {/* Done / Download */}
        {status === "done" && outputBlob && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-bold text-emerald-800">Conversion complete!</p>
            </div>
            <p className="text-xs text-emerald-700">
              Your document is ready. Click download to save it.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white text-sm font-semibold shadow hover:from-rose-700 hover:to-red-800 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download {settings.format.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-slate-600 hover:bg-stone-50 hover:border-stone-300 active:scale-95 transition-all"
              >
                Convert another file
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 space-y-2">
            <p className="text-sm font-bold text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Conversion Error
            </p>
            <p className="text-xs text-red-600">{error}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-semibold text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Settings + Convert button */}
        {showConvertArea && status !== "done" && (
          <>
            <PdfToWordSettings settings={settings} onChange={setSettings} />
            <PdfToWordConvertButton
              onConvert={handleConvert}
              isDisabled={status === "loading"}
              format={settings.format}
            />
          </>
        )}
      </div>

      {/* ── Right column (sidebar) ──────────────────────────────────────────── */}
      <div className="lg:col-span-1">
        <PdfToWordSidebar />
      </div>
    </div>
  );
}
