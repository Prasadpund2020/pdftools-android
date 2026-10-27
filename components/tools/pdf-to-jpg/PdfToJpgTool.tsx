"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ProofPage,
  LoadedPdfInfo,
  ImageFormat,
  DpiLevel,
  ColorMode,
  ConversionMode,
} from "./types";
import { getSampleCatalogPages, getSamplePdfInfo } from "./sampleCatalog";
import {
  loadPdfDoc,
  canvasToBlob,
  applyGrayscaleFilter,
  createZipArchive,
} from "./pdfRasterizerEngine";
import PdfToJpgHeaderBar from "./PdfToJpgHeaderBar";
import PdfToJpgDropzone from "./PdfToJpgDropzone";
import PdfToJpgModeBar from "./PdfToJpgModeBar";
import PdfToJpgProofGrid from "./PdfToJpgProofGrid";
import PdfToJpgExportDeck from "./PdfToJpgExportDeck";
import PdfToJpgModal from "./PdfToJpgModal";

export default function PdfToJpgTool() {
  const [pdfInfo, setPdfInfo] = useState<LoadedPdfInfo | null>(null);
  const [pages, setPages] = useState<ProofPage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Settings
  const [mode, setMode] = useState<ConversionMode>("entire-pages");
  const [format, setFormat] = useState<ImageFormat>("jpg");
  const [dpi, setDpi] = useState<DpiLevel>(300);
  const [colorMode, setColorMode] = useState<ColorMode>("srgb");

  // Interaction & Processing state
  const [inspectingPage, setInspectingPage] = useState<ProofPage | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Initialize with sample catalog on mount
  useEffect(() => {
    try {
      const samplePages = getSampleCatalogPages();
      const sampleInfo = getSamplePdfInfo();
      setPages(samplePages);
      setPdfInfo(sampleInfo);
    } catch {
      // fallback
    }
    setIsInitialized(true);
  }, []);

  const selectedCount = useMemo(() => {
    return pages.filter((p) => p.isSelected).length;
  }, [pages]);

  // Page selection toggle
  const handleTogglePage = useCallback((pageNum: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageNumber === pageNum ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  }, []);

  // Selection actions
  const handleSelectAll = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, isSelected: true })));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, isSelected: false })));
  }, []);

  const handleInvertSelection = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, isSelected: !p.isSelected })));
  }, []);

  // Reset to default sample catalog
  const handleResetSample = useCallback(() => {
    const samplePages = getSampleCatalogPages();
    const sampleInfo = getSamplePdfInfo();
    setPages(samplePages);
    setPdfInfo(sampleInfo);
    setStatusMessage("");
  }, []);

  // Handle User Uploading Real PDF
  const handleChangeFile = useCallback(async (file: File) => {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setStatusMessage("Loading PDF structure via WebAssembly...");

    try {
      const pdf = await loadPdfDoc(file);
      const numPages = pdf.numPages;

      const newPages: ProofPage[] = [];

      // Render thumbnail for each page at screen scale (72 DPI)
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.6 }); // Fast preview thumbnail

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
          const url = canvas.toDataURL("image/jpeg", 0.85);

          newPages.push({
            pageNumber: i,
            label: `Page ${i}`,
            sizeFormatted: "1.8 MB",
            sizeBytes: 1887436,
            previewUrl: url,
            isSelected: true,
            width: viewport.width,
            height: viewport.height,
          });
        }
      }

      setPdfInfo({
        name: file.name,
        pageCount: numPages,
        fileSizeBytes: file.size,
        formattedSize: `${sizeMb} MB`,
        colorProfile: "sRGB Gamut",
        file,
      });

      setPages(newPages);
      setStatusMessage("");
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to render PDF pages. Please verify document integrity.");
    }
  }, []);

  // Render a specific page canvas at high resolution DPI
  const renderHighResCanvas = useCallback(
    async (pageItem: ProofPage): Promise<HTMLCanvasElement> => {
      // If we have a real uploaded PDF, render with pdfjs-dist at target DPI scale
      if (pdfInfo?.file) {
        const pdf = await loadPdfDoc(pdfInfo.file);
        const page = await pdf.getPage(pageItem.pageNumber);
        const scale = dpi / 72;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
          if (colorMode === "grayscale") {
            applyGrayscaleFilter(canvas);
          }
          return canvas;
        }
      }

      // If working with sample preview, draw onto high-res canvas with grayscale option
      const img = new Image();
      img.src = pageItem.previewUrl;
      await new Promise((res) => {
        img.onload = res;
      });

      const canvas = document.createElement("canvas");
      const scale = dpi / 72;
      canvas.width = Math.round((img.naturalWidth || 450) * Math.min(2.5, scale));
      canvas.height = Math.round((img.naturalHeight || 600) * Math.min(2.5, scale));
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (colorMode === "grayscale") {
          applyGrayscaleFilter(canvas);
        }
      }
      return canvas;
    },
    [pdfInfo?.file, dpi, colorMode]
  );

  // Download Single Page
  const handleDownloadSingle = useCallback(
    async (pageToDownload?: ProofPage) => {
      const targetPage =
        pageToDownload || pages.find((p) => p.isSelected) || pages[0];
      if (!targetPage) return;

      setStatusMessage(`Rasterizing ${targetPage.label} at ${dpi} DPI...`);
      try {
        const canvas = await renderHighResCanvas(targetPage);
        const blob = await canvasToBlob(canvas, format);

        const baseName = (pdfInfo?.name || "Document").replace(/\.[^/.]+$/, "");
        const ext = format === "png" ? "png" : format === "webp" ? "webp" : "jpg";
        const fileName = `${baseName}_Page_${targetPage.pageNumber}_${dpi}dpi.${ext}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setStatusMessage(`Downloaded ${targetPage.label}!`);
      } catch (err) {
        console.error(err);
        setStatusMessage("Failed to export page image.");
      }
    },
    [pages, dpi, format, pdfInfo?.name, renderHighResCanvas]
  );

  // Download All Selected as ZIP
  const handleDownloadZip = async () => {
    const selectedPages = pages.filter((p) => p.isSelected);
    if (selectedPages.length === 0 || isDownloadingZip) return;

    setIsDownloadingZip(true);
    setStatusMessage(`Rasterizing ${selectedPages.length} pages at ${dpi} DPI...`);

    try {
      const filesToZip: { name: string; blob: Blob }[] = [];
      const baseName = (pdfInfo?.name || "Document").replace(/\.[^/.]+$/, "");
      const ext = format === "png" ? "png" : format === "webp" ? "webp" : "jpg";

      for (let i = 0; i < selectedPages.length; i++) {
        const p = selectedPages[i];
        setStatusMessage(
          `Rasterizing page ${p.pageNumber} of ${selectedPages.length}...`
        );
        const canvas = await renderHighResCanvas(p);
        const blob = await canvasToBlob(canvas, format);
        const fileName = `${baseName}_Page_${p.pageNumber}.${ext}`;
        filesToZip.push({ name: fileName, blob });
      }

      setStatusMessage("Compressing ZIP archive in memory...");
      const zipBlob = await createZipArchive(filesToZip);

      const zipName = `${baseName}_Images_${dpi}DPI.zip`;
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatusMessage(`ZIP exported successfully (${filesToZip.length} images)!`);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to generate ZIP archive.");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full min-h-[450px] flex items-center justify-center bg-stone-50 rounded-3xl border border-stone-200">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-stone-500">
            Initializing PDF to JPG Rasterizer...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {!pdfInfo ? (
        <PdfToJpgDropzone
          onPdfSelected={handleChangeFile}
          onLoadSample={handleResetSample}
        />
      ) : (
        <>
          {/* Screen Sub-Header & Loaded File Spec Deck */}
          <PdfToJpgHeaderBar
            pdfInfo={pdfInfo}
            onChangeFile={handleChangeFile}
          />

          {/* Extraction Mode Segmented Bar & Batch Actions */}
          <PdfToJpgModeBar
            mode={mode}
            onModeChange={setMode}
            selectedCount={selectedCount}
            totalCount={pages.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onInvertSelection={handleInvertSelection}
          />

          {/* Main Workspace Split: Thumbnails Stage (Left 8 Cols) & Settings Deck (Right 4 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Proof Grid (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <PdfToJpgProofGrid
                pages={pages}
                onTogglePage={handleTogglePage}
                onInspectPage={setInspectingPage}
              />
            </div>

            {/* Right Column: Export Settings Deck (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <PdfToJpgExportDeck
                format={format}
                onFormatChange={setFormat}
                dpi={dpi}
                onDpiChange={setDpi}
                colorMode={colorMode}
                onColorModeChange={setColorMode}
                selectedCount={selectedCount}
                onDownloadZip={handleDownloadZip}
                onDownloadSingle={() => handleDownloadSingle()}
                isDownloadingZip={isDownloadingZip}
                statusMessage={statusMessage}
              />
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Page Inspection Modal */}
      <PdfToJpgModal
        page={inspectingPage}
        onClose={() => setInspectingPage(null)}
        onDownloadPage={handleDownloadSingle}
      />
    </div>
  );
}
