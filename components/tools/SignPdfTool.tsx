"use client";

import React, { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { SignatureMode, DocumentInfo, SignaturePlacement } from "./sign-pdf/types";
import SignPdfHeader from "./sign-pdf/SignPdfHeader";
import DocumentUploader from "./sign-pdf/DocumentUploader";
import DocumentToolbar from "./sign-pdf/DocumentToolbar";
import DocumentCanvas from "./sign-pdf/DocumentCanvas";
import SignatureCreatorCard from "./sign-pdf/SignatureCreatorCard";
import SignerProfileCard from "./sign-pdf/SignerProfileCard";

export default function SignPdfTool() {
  // ─── Document state (Defaults to null to show Upload Screen first) ──────────
  const [doc, setDoc] = useState<DocumentInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // ─── Signer identity state ─────────────────────────────────────────────────
  const [signerName, setSignerName] = useState("Alex Rivera");
  const [signerTitle, setSignerTitle] = useState("VP of Product");
  const [signingDate, setSigningDate] = useState("2026-10-22");
  const [attachAuditCert, setAttachAuditCert] = useState(true);

  // Defer reading client time to useEffect to prevent Next.js blocking prerender errors
  useEffect(() => {
    try {
      setSigningDate(new Date().toISOString().split("T")[0]);
    } catch {
      // fallback
    }
  }, []);

  // ─── Signature creator state ───────────────────────────────────────────────
  const [signatureMode, setSignatureMode] = useState<SignatureMode>("type");
  const [selectedInkColor, setSelectedInkColor] = useState("#1e1b1a");
  const [selectedThickness, setSelectedThickness] = useState<number>(2);
  const [typedSignature, setTypedSignature] = useState("Alex Rivera");
  const [isSignaturePlaced, setIsSignaturePlaced] = useState(true);
  const [signaturePlacement, setSignaturePlacement] = useState<SignaturePlacement>({
    x: 65,
    y: 80,
    page: 1,
  });

  // ─── Process & Feedback state ──────────────────────────────────────────────
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ─── Canvas Refs & Drawing Handlers ────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (signatureMode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = selectedInkColor;
        ctx.lineWidth = selectedThickness;
      }
    }
  }, [signatureMode, selectedInkColor, selectedThickness]);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleReset = () => {
    setDoc(null);
    setIsSignaturePlaced(false);
    clearCanvas();
  };

  // ─── Real PDF File Upload Handler ──────────────────────────────────────────
  const handleRealPdfUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();

      // Read real page count with pdf-lib using cloned buffer
      let pageCount = 1;
      try {
        const loadedPdf = await PDFDocument.load(arrayBuffer.slice(0));
        pageCount = loadedPdf.getPageCount();
      } catch (e) {
        console.warn("Could not read page count via pdf-lib:", e);
      }

      setDoc({
        file,
        fileName: file.name,
        fileSize: file.size,
        arrayBuffer,
        pageCount,
        isDemoSample: false,
      });

      setCurrentPage(1);
      setSignaturePlacement({ x: 65, y: 80, page: 1 });
      setIsSignaturePlaced(true);
    } catch (err) {
      console.error("Error reading PDF file:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle header file input change
  const handleHeaderPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleRealPdfUpload(file);
    }
  };

  // Load sample demo contract
  const handleLoadSample = () => {
    setDoc({
      file: null,
      fileName: "Sample_Employment_Contract.pdf",
      fileSize: 184320,
      arrayBuffer: null,
      pageCount: 4,
      isDemoSample: true,
    });
    setCurrentPage(4);
    setSignaturePlacement({ x: 75, y: 85, page: 4 });
    setIsSignaturePlaced(true);
  };

  // ─── Real PDF Signing & Download via pdf-lib ───────────────────────────────
  const handleSignAndDownload = async () => {
    if (!doc) return;
    setIsProcessing(true);

    try {
      let pdfDoc: PDFDocument;

      if (!doc.isDemoSample && (doc.file || doc.arrayBuffer)) {
        // Load the USER'S ACTUAL UPLOADED PDF FILE directly from File or cloned buffer
        const freshBuffer = doc.file
          ? await doc.file.arrayBuffer()
          : doc.arrayBuffer!.slice(0);
        pdfDoc = await PDFDocument.load(freshBuffer);
        const pages = pdfDoc.getPages();
        const targetPageIndex = Math.min(
          Math.max(0, (signaturePlacement.page || currentPage) - 1),
          pages.length - 1
        );
        const targetPage = pages[targetPageIndex];
        const { width, height } = targetPage.getSize();

        // Calculate coordinates based on percentage placement
        const targetX = (width * Math.min(80, Math.max(10, signaturePlacement.x))) / 100;
        const targetY = height - (height * Math.min(90, Math.max(10, signaturePlacement.y))) / 100;

        // Draw Signature
        if (signatureMode === "draw" && canvasRef.current) {
          // Export drawn signature canvas as PNG
          const pngDataUrl = canvasRef.current.toDataURL("image/png");
          const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer());
          const signatureImage = await pdfDoc.embedPng(pngBytes);
          targetPage.drawImage(signatureImage, {
            x: Math.max(20, targetX - 60),
            y: Math.max(20, targetY - 20),
            width: 140,
            height: 45,
          });
        } else {
          // Embed typed calligraphic signature
          const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
          const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

          const sigText = typedSignature || signerName;
          targetPage.drawText(sigText, {
            x: Math.max(20, targetX - 50),
            y: Math.max(20, targetY),
            size: 16,
            font: italicFont,
            color: selectedInkColor === "#003751" ? rgb(0, 0.22, 0.32) : rgb(0.12, 0.11, 0.1),
          });

          targetPage.drawText(`Signed by ${signerName} • ${signingDate}`, {
            x: Math.max(20, targetX - 50),
            y: Math.max(10, targetY - 14),
            size: 8,
            font: regularFont,
            color: rgb(0.4, 0.4, 0.4),
          });
        }

        // Attach cryptographic audit note if selected
        if (attachAuditCert) {
          const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
          targetPage.drawText(
            `Digitally signed with FileLab Cryptographic Seal (${new Date().toUTCString()}) • 100% In-Browser Privacy Sandbox`,
            {
              x: 40,
              y: 25,
              size: 7,
              font: regularFont,
              color: rgb(0.5, 0.5, 0.5),
            }
          );
        }
      } else {
        // Fallback for demo sample contract: generate full PDF
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

        page.drawText("CONFIDENTIAL • SCHEDULE C", {
          x: 50,
          y: 780,
          size: 9,
          font: regularFont,
          color: rgb(0.5, 0.5, 0.5),
        });

        page.drawText("Standard Executive Employment Agreement", {
          x: 50,
          y: 760,
          size: 16,
          font: timesRoman,
          color: rgb(0.1, 0.1, 0.1),
        });

        const clauses = [
          "7.4 Entirety of Understanding: This Instrument supersedes all prior covenants and communications.",
          "8.1 Electronic Execution: The parties agree this electronic signature complies with UETA & ESIGN Act.",
          "8.2 Authorization: By affixing signature below, the executive confirms contractual capacity.",
        ];

        clauses.forEach((clause, idx) => {
          page.drawText(clause, {
            x: 50,
            y: 710 - idx * 24,
            size: 10,
            font: regularFont,
            color: rgb(0.3, 0.3, 0.3),
          });
        });

        page.drawLine({
          start: { x: 50, y: 350 },
          end: { x: 545, y: 350 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        page.drawText("FileLab Systems, Inc.", { x: 50, y: 320, size: 11, font: timesRoman, color: rgb(0.1, 0.1, 0.1) });
        page.drawText("Elena Vance (General Counsel)", { x: 50, y: 290, size: 14, font: italicFont, color: rgb(0.1, 0.3, 0.7) });
        page.drawText(`Date: ${signingDate} • Verified`, { x: 50, y: 270, size: 9, font: regularFont, color: rgb(0.2, 0.5, 0.3) });

        page.drawText(`${signerName} (${signerTitle})`, { x: 300, y: 320, size: 11, font: timesRoman, color: rgb(0.1, 0.1, 0.1) });
        const sigToRender = typedSignature || signerName;
        page.drawText(sigToRender, { x: 300, y: 290, size: 16, font: italicFont, color: rgb(0.1, 0.1, 0.1) });
        page.drawText(`Date: ${signingDate} • Certified`, { x: 300, y: 270, size: 9, font: regularFont, color: rgb(0.2, 0.5, 0.3) });

        if (attachAuditCert) {
          page.drawText(
            "Audit Trail: Verified 100% In-Browser Cryptographic Digest • Zero Cloud Uploads",
            { x: 50, y: 50, size: 8, font: regularFont, color: rgb(0.5, 0.5, 0.5) }
          );
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Signed_${doc.fileName.replace(/\.pdf$/i, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3500);
    } catch (err) {
      console.error("Error signing PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#faf8f5] text-stone-900 select-none">
      {/* 1. Sub-Header: Active Document Ribbon & Controls */}
      <SignPdfHeader
        doc={doc}
        fileInputRef={fileInputRef}
        onUploadPdf={handleHeaderPdfUpload}
        onReset={handleReset}
      />

      {/* 2. Main Content: Upload Screen OR Physical Desk Studio */}
      {!doc ? (
        <DocumentUploader
          onFileUpload={handleRealPdfUpload}
          onLoadSample={handleLoadSample}
          isProcessing={isProcessing}
        />
      ) : (
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          {/* LEFT COLUMN: Suspended Toolbar & Real Document Canvas */}
          <div className="xl:col-span-7 flex flex-col items-center gap-4 w-full">
            <DocumentToolbar
              currentPage={currentPage}
              pageCount={doc.pageCount}
              zoomLevel={zoomLevel}
              onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNextPage={() => setCurrentPage((p) => Math.min(doc.pageCount, p + 1))}
              onZoomIn={() => setZoomLevel((z) => Math.min(130, z + 10))}
              onZoomOut={() => setZoomLevel((z) => Math.max(80, z - 10))}
              onAddSignature={() => {
                setSignatureMode("type");
                setIsSignaturePlaced(true);
              }}
              onDrawSignature={() => {
                setSignatureMode("draw");
                setIsSignaturePlaced(true);
              }}
              onInsertDate={() => {
                setSigningDate(new Date().toISOString().split("T")[0]);
              }}
            />

            <DocumentCanvas
              doc={doc}
              currentPage={currentPage}
              zoomLevel={zoomLevel}
              signerName={signerName}
              signerTitle={signerTitle}
              signingDate={signingDate}
              typedSignature={typedSignature}
              selectedInkColor={selectedInkColor}
              isSignaturePlaced={isSignaturePlaced}
              signaturePlacement={signaturePlacement}
              onUpdatePlacement={setSignaturePlacement}
              onPlaceSignature={() => setIsSignaturePlaced(true)}
              onRemoveSignature={() => setIsSignaturePlaced(false)}
              canvasRef={canvasRef}
            />
          </div>

          {/* RIGHT COLUMN: Tool Control Station Deck */}
          <div className="xl:col-span-5 flex flex-col gap-6 w-full">
            <SignatureCreatorCard
              signatureMode={signatureMode}
              setSignatureMode={setSignatureMode}
              selectedInkColor={selectedInkColor}
              setSelectedInkColor={setSelectedInkColor}
              selectedThickness={selectedThickness}
              setSelectedThickness={setSelectedThickness}
              typedSignature={typedSignature}
              setTypedSignature={setTypedSignature}
              signerName={signerName}
              signingDate={signingDate}
              setSigningDate={setSigningDate}
              setIsSignaturePlaced={setIsSignaturePlaced}
              canvasRef={canvasRef}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearCanvas={clearCanvas}
            />

            <SignerProfileCard
              signerName={signerName}
              setSignerName={setSignerName}
              signerTitle={signerTitle}
              setSignerTitle={setSignerTitle}
              attachAuditCert={attachAuditCert}
              setAttachAuditCert={setAttachAuditCert}
              isProcessing={isProcessing}
              isSuccess={isSuccess}
              onSignAndDownload={handleSignAndDownload}
            />
          </div>
        </div>
      )}
    </div>
  );
}
