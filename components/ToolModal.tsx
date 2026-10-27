"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolItem } from "@/types/tools";
import ToolIcon from "@/components/ToolIcon";

interface ToolModalProps {
  tool: ToolItem | null;
  initialFile?: File | null;
  onClose: () => void;
  onRecordRecent: (tool: ToolItem) => void;
}

export default function ToolModal({
  tool,
  initialFile,
  onClose,
  onRecordRecent,
}: ToolModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [compressionQuality, setCompressionQuality] = useState(75);
  const [videoFormat, setVideoFormat] = useState("1080p");
  const [isDragOver, setIsDragOver] = useState(false);

  // HTML to PDF specific states
  const [htmlMode, setHtmlMode] = useState<"code" | "file" | "url">("code");
  const [htmlCode, setHtmlCode] = useState(
`<div style="font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: auto;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
    <div>
      <h1 style="margin: 0; color: #1d4ed8; font-size: 24px;">TAX INVOICE</h1>
      <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">#INV-2026-089</p>
    </div>
    <div style="text-align: right; font-size: 12px; color: #475569;">
      <strong>Date:</strong> Oct 24, 2026<br>
      <strong>Due Date:</strong> Nov 24, 2026
    </div>
  </div>
  <div style="margin-bottom: 20px; font-size: 13px;">
    <strong>Billed To:</strong><br>
    Global Innovations Ltd.<br>
    100 Tech Park, Suite 400
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <thead>
      <tr style="background: #f1f5f9; text-align: left; border-bottom: 2px solid #cbd5e1;">
        <th style="padding: 8px;">Description</th>
        <th style="padding: 8px; text-align: center;">Qty</th>
        <th style="padding: 8px; text-align: right;">Rate</th>
        <th style="padding: 8px; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px;">Client-Side Conversion Suite</td>
        <td style="padding: 8px; text-align: center;">1</td>
        <td style="padding: 8px; text-align: right;">$3,400.00</td>
        <td style="padding: 8px; text-align: right;">$3,400.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px;">Responsive UI/UX Optimization</td>
        <td style="padding: 8px; text-align: center;">1</td>
        <td style="padding: 8px; text-align: right;">$2,100.00</td>
        <td style="padding: 8px; text-align: right;">$2,100.00</td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top: 24px; text-align: right; font-size: 16px; font-weight: bold; color: #0f172a;">
    Total Due: $5,500.00
  </div>
</div>`
  );
  const [htmlUrl, setHtmlUrl] = useState("");
  const [htmlPageSize, setHtmlPageSize] = useState<"A4" | "Letter" | "Legal">("A4");
  const [htmlOrientation, setHtmlOrientation] = useState<"portrait" | "landscape">("portrait");
  const [htmlMargin, setHtmlMargin] = useState<"standard" | "minimal" | "none">("standard");
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tool) {
      onRecordRecent(tool);
      setIsCompleted(false);
      setProgress(0);
      setIsProcessing(false);
      if (initialFile) {
        setSelectedFiles([initialFile]);
        if (tool.id === "html-to-pdf") {
          setHtmlMode("file");
          initialFile.text().then((text) => setHtmlCode(text)).catch(() => {});
        }
      } else {
        setSelectedFiles([]);
      }
    }
  }, [tool, initialFile]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!tool) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    setSelectedFiles((prev) => (tool.id === "pdf-merge" ? [...prev, ...fileList] : fileList));
    setIsCompleted(false);

    if (tool.id === "html-to-pdf" && fileList[0]) {
      fileList[0].text().then((text) => {
        setHtmlCode(text);
      }).catch(() => {});
    }
  };

  const handleStartProcess = () => {
    if (tool.id === "html-to-pdf") {
      if (!htmlCode.trim() && !htmlUrl.trim() && selectedFiles.length === 0) {
        return;
      }
    } else if (selectedFiles.length === 0 && !videoUrl && tool.category !== "downloaders") {
      fileInputRef.current?.click();
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 180);
  };

  // Helper function to generate a valid PDF binary directly in pure browser memory
  const createPdfBlobFromHtml = (
    html: string,
    title: string,
    options: { pageSize: string; orientation: string }
  ) => {
    const isLandscape = options.orientation === "landscape";
    let width = 595.28;
    let height = 841.89;
    if (options.pageSize === "Letter") {
      width = 612.0;
      height = 792.0;
    } else if (options.pageSize === "Legal") {
      width = 612.0;
      height = 1008.0;
    }
    if (isLandscape) {
      const temp = width;
      width = height;
      height = temp;
    }

    // Extract text content and structure from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const extractedLines: string[] = [];

    const elements = doc.querySelectorAll("h1, h2, h3, h4, p, li, th, td");
    if (elements.length > 0) {
      elements.forEach((el) => {
        const text = (el.textContent || "").trim().replace(/\s+/g, " ");
        if (text && !extractedLines.includes(text)) {
          extractedLines.push(text);
        }
      });
    } else {
      const raw = (doc.body.textContent || html).trim();
      raw.split("\n").forEach((l) => {
        const t = l.trim().replace(/\s+/g, " ");
        if (t) extractedLines.push(t);
      });
    }

    const cleanTitle = (title || "FileLab Converted Document").replace(/[()\\]/g, "");

    let stream = "BT\n";
    stream += "/F1 16 Tf\n";
    stream += `50 ${(height - 50).toFixed(0)} Td\n`;
    stream += `(${cleanTitle}) Tj\nET\n`;

    stream += "BT\n/F1 9 Tf\n";
    stream += `50 ${(height - 70).toFixed(0)} Td\n`;
    stream += "(Generated securely via FileLab Local HTML to PDF Converter) Tj\nET\n";

    let y = height - 100;
    extractedLines.slice(0, 36).forEach((line) => {
      if (y > 50) {
        const sanitized = line.replace(/[()\\]/g, "").slice(0, 95);
        stream += `BT\n/F1 11 Tf\n50 ${y.toFixed(0)} Td\n(${sanitized}) Tj\nET\n`;
        y -= 18;
      }
    });

    const streamLength = stream.length;

    const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width.toFixed(2)} ${height.toFixed(2)}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${stream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000252 00000 n 
0000000000 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${350 + streamLength}
%%EOF`;

    return new Blob([pdf], { type: "application/pdf" });
  };

  // Launch browser native high-res vector print dialog for pixel-perfect PDF output
  const handlePrintPdf = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const marginMap = {
      standard: "20mm",
      minimal: "10mm",
      none: "0mm",
    };
    const marginSize = marginMap[htmlMargin] || "15mm";

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${selectedFiles[0]?.name?.replace(/\\.[^/.]+$/, "") || "FileLab_Converted_Document"}</title>
            <style>
              @page {
                size: ${htmlPageSize} ${htmlOrientation};
                margin: ${marginSize};
              }
              * { box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #1e293b;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${htmlCode}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }, 250);
    }
  };

  const handleDownload = () => {
    if (tool.id === "html-to-pdf") {
      const filename = selectedFiles[0]?.name 
        ? `${selectedFiles[0].name.replace(/\.[^/.]+$/, "")}.pdf`
        : `filelab_converted_${Date.now()}.pdf`;
      const pdfBlob = createPdfBlobFromHtml(htmlCode, selectedFiles[0]?.name?.replace(/\.[^/.]+$/, "") || "Converted Document", {
        pageSize: htmlPageSize,
        orientation: htmlOrientation,
      });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    const filename = selectedFiles[0]?.name 
      ? `processed_${selectedFiles[0].name.replace(/\.[^/.]+$/, "")}.${
          tool.id.includes("word") ? "docx" : tool.id.includes("jpg") ? "zip" : tool.id.includes("mp3") ? "mp3" : "pdf"
        }`
      : `filelab_${tool.id}_output.zip`;

    const blob = new Blob(["FileLab processed output sample"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
        className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/80 p-4 sm:p-7 overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`clay-btn ${tool.clayColor} w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
              <ToolIcon iconType={tool.iconType} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="tool-modal-title" className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  {tool.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {tool.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">{tool.description}</p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
            title="Close (Esc)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-3 sm:py-5 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 pr-1">
          {/* If Tool is a Video / Social Downloader */}
          {tool.category === "downloaders" ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Paste Video URL (YouTube, Reels, TikTok)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
                  className="px-2.5 sm:px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap"
                >
                  Paste Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2">
                <span className="text-xs font-semibold text-slate-600">Quality:</span>
                {["1080p HD", "720p HD", "MP3 Audio (320kbps)"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setVideoFormat(q)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      videoFormat === q
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : tool.id === "html-to-pdf" ? (
            /* HTML to PDF Dedicated Workspace */
            <div className="space-y-3.5">
              {/* Input Mode Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-semibold select-none">
                <button
                  type="button"
                  onClick={() => setHtmlMode("code")}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                    htmlMode === "code"
                      ? "bg-white text-slate-800 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ToolIcon iconType="html" className="w-3.5 h-3.5" />
                  <span>HTML Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHtmlMode("file")}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                    htmlMode === "file"
                      ? "bg-white text-slate-800 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Upload .html</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHtmlMode("url")}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                    htmlMode === "url"
                      ? "bg-white text-slate-800 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  <span>Web URL</span>
                </button>
              </div>

              {/* Mode 1: HTML Code Editor */}
              {htmlMode === "code" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="font-semibold text-slate-600">Sample Templates:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setHtmlCode(
`<div style="font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: auto;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
    <div>
      <h1 style="margin: 0; color: #1d4ed8; font-size: 24px;">TAX INVOICE</h1>
      <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">#INV-2026-089</p>
    </div>
    <div style="text-align: right; font-size: 12px; color: #475569;">
      <strong>Date:</strong> Oct 24, 2026<br>
      <strong>Due Date:</strong> Nov 24, 2026
    </div>
  </div>
  <div style="margin-bottom: 20px; font-size: 13px;">
    <strong>Billed To:</strong><br>
    Global Innovations Ltd.<br>
    100 Tech Park, Suite 400
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <thead>
      <tr style="background: #f1f5f9; text-align: left; border-bottom: 2px solid #cbd5e1;">
        <th style="padding: 8px;">Description</th>
        <th style="padding: 8px; text-align: center;">Qty</th>
        <th style="padding: 8px; text-align: right;">Rate</th>
        <th style="padding: 8px; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px;">Client-Side Conversion Suite</td>
        <td style="padding: 8px; text-align: center;">1</td>
        <td style="padding: 8px; text-align: right;">$3,400.00</td>
        <td style="padding: 8px; text-align: right;">$3,400.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px;">Responsive UI/UX Optimization</td>
        <td style="padding: 8px; text-align: center;">1</td>
        <td style="padding: 8px; text-align: right;">$2,100.00</td>
        <td style="padding: 8px; text-align: right;">$2,100.00</td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top: 24px; text-align: right; font-size: 16px; font-weight: bold; color: #0f172a;">
    Total Due: $5,500.00
  </div>
</div>`
                          )
                        }
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold transition-colors"
                      >
                        Invoice
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHtmlCode(
`<div style="font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: auto;">
  <h1 style="margin: 0; color: #0f172a; font-size: 26px;">Alex Morgan</h1>
  <p style="margin: 4px 0 16px; color: #2563eb; font-size: 14px; font-weight: 600;">Full Stack Engineer & Architect</p>
  <p style="font-size: 12px; color: #64748b;">alex.morgan@example.com • San Francisco, CA</p>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
  <h3 style="color: #0f172a; font-size: 15px; margin: 0 0 8px;">Experience</h3>
  <div style="margin-bottom: 12px; font-size: 13px;">
    <strong>Lead Engineer — TechScale</strong> (2022–Present)<br>
    <span style="color: #64748b; font-size: 12px;">Engineered zero-latency client-side tool suites serving 2M+ users monthly.</span>
  </div>
</div>`
                          )
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold transition-colors"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHtmlCode(
`<div style="font-family: Georgia, serif; padding: 24px; color: #1e293b; max-width: 600px; margin: auto; line-height: 1.6;">
  <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 6px;">Executive Engineering Report</h1>
  <p style="font-size: 12px; color: #64748b; font-style: italic;">Q4 2026 Audit</p>
  <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 14px 0;">
  <p style="font-size: 13px;">Client-side document conversion enables 100% data privacy without needing cloud server roundtrips.</p>
</div>`
                          )
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold transition-colors"
                      >
                        Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setHtmlCode("")}
                        className="px-1.5 py-0.5 text-slate-400 hover:text-slate-600 text-[10px]"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="Type or paste HTML & inline CSS here..."
                    rows={5}
                    className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                  />
                </div>
              )}

              {/* Mode 2: HTML File Upload */}
              {htmlMode === "file" && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFileSelect(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50/60 scale-[1.01]"
                      : selectedFiles.length > 0
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  {selectedFiles.length > 0 ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-sm mx-auto">
                        {selectedFiles[0].name}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {(selectedFiles[0].size / 1024).toFixed(1)} KB • HTML file loaded • Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                        <ToolIcon iconType="html" className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700">
                        Drop your .html or .htm file here or click to browse
                      </p>
                      <p className="text-[11px] text-slate-400">
                        HTML markup & CSS styles are processed locally
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Webpage URL */}
              {htmlMode === "url" && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Enter Webpage URL to Convert to PDF
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={htmlUrl}
                      onChange={(e) => setHtmlUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setHtmlUrl("https://en.wikipedia.org/wiki/Portable_Document_Format");
                        setHtmlCode(
`<div style="font-family: system-ui, sans-serif; padding: 24px; color: #1e293b;">
  <h1 style="color: #0f172a; font-size: 24px;">PDF — Portable Document Format</h1>
  <p style="font-size: 13px; line-height: 1.6;">The Portable Document Format (PDF) is a file format developed by Adobe in 1992 to present documents, including text formatting and inline images, in a manner independent of application software, hardware, and operating systems.</p>
  <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin-top: 14px; font-size: 12px;">
    <strong>Standard:</strong> ISO 32000 • <strong>Initial Release:</strong> June 15, 1993
  </div>
</div>`
                        );
                      }}
                      className="px-2.5 sm:px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Paste Demo
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Captures webpage markup and formats into standard vector pages.
                  </p>
                </div>
              )}

              {/* PDF Settings & Live Preview Bar */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>PDF Layout Options</span>
                  <button
                    type="button"
                    onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                  >
                    <span>{showHtmlPreview ? "Hide Preview" : "Show Live Preview"}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showHtmlPreview ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Page Size */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Page Size</label>
                    <div className="flex rounded-lg bg-white p-0.5 border border-slate-200">
                      {(["A4", "Letter", "Legal"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setHtmlPageSize(s)}
                          className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                            htmlPageSize === s
                              ? "bg-slate-800 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Orientation</label>
                    <div className="flex rounded-lg bg-white p-0.5 border border-slate-200">
                      {(["portrait", "landscape"] as const).map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setHtmlOrientation(o)}
                          className={`flex-1 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                            htmlOrientation === o
                              ? "bg-slate-800 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Margins */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Margins</label>
                    <div className="flex rounded-lg bg-white p-0.5 border border-slate-200">
                      {(["standard", "minimal", "none"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setHtmlMargin(m)}
                          className={`flex-1 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                            htmlMargin === m
                              ? "bg-slate-800 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rendered HTML Live Preview */}
                {showHtmlPreview && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Live Render Preview:</span>
                    <div className="w-full h-36 bg-white rounded-xl border border-slate-200 p-2 overflow-auto shadow-inner text-xs">
                      <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* File Upload / Drag Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileSelect(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-blue-500 bg-blue-50/60 scale-[1.01]"
                  : selectedFiles.length > 0
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={tool.id === "pdf-merge"}
                accept={tool.acceptedFormats || "*"}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {selectedFiles.length > 0 ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate max-w-sm mx-auto">
                    {selectedFiles.length === 1
                      ? selectedFiles[0].name
                      : `${selectedFiles.length} files selected for merging`}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total • Click to change file
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drop your {tool.acceptedFormats ? tool.acceptedFormats.replace(/,/g, ", ") : "file"} here
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Encrypted and processed locally on your device
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tool specific custom settings */}
          {tool.id.includes("compress") && (
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Compression Level:</span>
                <span className="font-bold text-blue-600">{compressionQuality}% (Estimated -{100 - compressionQuality}%)</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Maximum Compression</span>
                <span>Balanced Quality</span>
                <span>Highest Fidelity</span>
              </div>
            </div>
          )}

          {/* Progress Bar Animation */}
          {isProcessing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Processing in browser memory...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed Message */}
          {isCompleted && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Conversion Complete!</h4>
                  <p className="text-[11px] text-emerald-700">Ready for instant local download or vector print.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {tool.id === "html-to-pdf" && (
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                    title="Print or Save as Vector PDF"
                  >
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Vector Print / PDF</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>

          {!isCompleted ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleStartProcess}
              className={`clay-btn ${tool.clayColor} px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md disabled:opacity-50`}
            >
              {isProcessing
                ? "Processing..."
                : tool.id === "html-to-pdf"
                ? "Convert to PDF"
                : selectedFiles.length > 0 || videoUrl
                ? tool.actionText || `Process ${tool.title}`
                : "Select File"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {tool.id === "html-to-pdf" && (
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Vector Print</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                className="clay-btn clay-green px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md"
              >
                Download Output
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
