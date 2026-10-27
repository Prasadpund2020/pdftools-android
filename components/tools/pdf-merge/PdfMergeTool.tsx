"use client";

import React, { useState, useCallback } from "react";
import PdfMergeHeaderBar from "./PdfMergeHeaderBar";
import PdfMergeDropzone from "./PdfMergeDropzone";
import PdfMergeFileGrid from "./PdfMergeFileGrid";
import PdfMergeSettingsDeck from "./PdfMergeSettingsDeck";
import PdfMergeSuccessModal from "./PdfMergeSuccessModal";
import { MergePdfItem, MergeOptions, MergeResult } from "./types";
import { parsePdfFile, mergePdfDocuments } from "./pdfMergeEngine";
import { createSamplePdfs } from "./samplePdfs";

export default function PdfMergeTool() {
  const [items, setItems] = useState<MergePdfItem[]>([]);
  const [options, setOptions] = useState<MergeOptions>({
    outputFileName: "Merged_Document.pdf",
    addPageNumbers: false,
    pageNumberPosition: "bottom-center",
    normalizePageSizes: "original",
  });
  const [isMerging, setIsMerging] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPageCount = items.reduce((sum, item) => sum + item.pageCount, 0);

  // Add files from file picker or dropzone
  const handleAddFiles = useCallback(async (files: FileList) => {
    setErrorMessage(null);
    const newItems: MergePdfItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        try {
          const parsed = await parsePdfFile(file);
          newItems.push(parsed);
        } catch (err) {
          console.error("Could not parse PDF:", file.name, err);
        }
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setResult(null);
    }
  }, []);

  // Load in-memory sample PDFs
  const handleLoadSamples = useCallback(async () => {
    setIsLoadingSamples(true);
    setErrorMessage(null);
    try {
      const samples = await createSamplePdfs();
      setItems(samples);
      setResult(null);
    } catch (err) {
      console.error("Failed to generate samples:", err);
      setErrorMessage("Could not generate sample files. Please try uploading your own PDFs.");
    } finally {
      setIsLoadingSamples(false);
    }
  }, []);

  // Order manipulation
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleRotate = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClear = () => {
    setItems([]);
    setResult(null);
    setErrorMessage(null);
  };

  // Merge execution
  const handleMerge = async () => {
    if (items.length === 0) return;
    setIsMerging(true);
    setErrorMessage(null);
    try {
      const mergeRes = await mergePdfDocuments(items, options);
      setResult(mergeRes);
    } catch (err) {
      console.error("Merge error:", err);
      setErrorMessage("Failed to merge PDF files. Please ensure documents are not password protected.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleOptionsChange = (newOpts: Partial<MergeOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOpts }));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Workspace Top Header Bar */}
      <PdfMergeHeaderBar
        fileCount={items.length}
        totalPageCount={totalPageCount}
        onAddFiles={handleAddFiles}
        onClear={handleClear}
        isMerging={isMerging}
      />

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Stage: Dropzone or Grid + Settings or Success Modal */}
      {result ? (
        <PdfMergeSuccessModal result={result} onReset={handleClear} />
      ) : items.length === 0 ? (
        <PdfMergeDropzone
          onFilesSelect={handleAddFiles}
          onLoadSamples={handleLoadSamples}
          isLoadingSamples={isLoadingSamples}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Ordering Deck (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <PdfMergeFileGrid
              items={items}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onRotate={handleRotate}
              onRemove={handleRemove}
              isMerging={isMerging}
            />
          </div>

          {/* Merge Settings & Action Deck (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <PdfMergeSettingsDeck
              options={options}
              onChangeOptions={handleOptionsChange}
              fileCount={items.length}
              totalPageCount={totalPageCount}
              isMerging={isMerging}
              onMerge={handleMerge}
            />
          </div>
        </div>
      )}
    </div>
  );
}
