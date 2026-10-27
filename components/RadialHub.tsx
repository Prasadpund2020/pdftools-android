"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ToolItem } from "@/types/tools";
import { RADIAL_TOOLS, ALL_TOOLS } from "@/data/tools";
import { getToolUrl } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";
import {
  compressImageClient,
  removeBackgroundClient,
  mergePdfsClient,
  imagesToPdfClient,
  pdfToWordClient,
  pdfToJpgClient,
  videoToMp3Client,
  downloadYouTubeClient,
  ConversionOutput,
} from "@/lib/clientHubConverters";

interface RadialHubProps {
  activeTool?: ToolItem | null;
  onSelectTool: (tool: ToolItem) => void;
  onResetActiveTool?: () => void;
  onFileDrop?: (file: File) => void;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function RadialHub({
  activeTool: externalActiveTool,
  onSelectTool,
  onResetActiveTool,
  onFileDrop,
}: RadialHubProps) {
  // Local active tool state (synced with external prop if provided)
  const [internalActiveTool, setInternalActiveTool] = useState<ToolItem | null>(
    null
  );
  const activeTool =
    externalActiveTool !== undefined ? externalActiveTool : internalActiveTool;

  const setActiveTool = (tool: ToolItem | null) => {
    if (externalActiveTool !== undefined && onResetActiveTool && tool === null) {
      onResetActiveTool();
    }
    setInternalActiveTool(tool);
    if (tool) {
      onSelectTool(tool);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionResult, setConversionResult] =
    useState<ConversionOutput | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Tool specific options
  const [compressionQuality, setCompressionQuality] = useState(75);
  const [imageFormat, setImageFormat] = useState<"image/jpeg" | "image/webp">(
    "image/webp"
  );
  const [pdfWordFormat, setPdfWordFormat] = useState<"docx" | "rtf">("docx");
  const [youtubeQuality, setYoutubeQuality] = useState("1080p");
  const [videoAudioBitrate, setVideoAudioBitrate] = useState("320kbps");
  const [imageOrientation, setImageOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeStageRef = useRef<HTMLDivElement>(null);

  // Reset file/conversion state when active tool changes
  useEffect(() => {
    setSelectedFiles([]);
    setConversionResult(null);
    setIsProcessing(false);
    setProgress(0);
    setVideoUrl("");
    setStatusMessage("");
  }, [activeTool?.id]);

  const handleToolClick = (tool: ToolItem) => {
    setActiveTool(tool);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processIncomingFiles = (incoming: FileList | File[]) => {
    const fileList = Array.from(incoming);
    if (fileList.length === 0) return;

    if (activeTool) {
      if (activeTool.id === "pdf-merge" || activeTool.id === "image-to-pdf") {
        setSelectedFiles((prev) => [...prev, ...fileList]);
      } else {
        setSelectedFiles([fileList[0]]);
      }
      setConversionResult(null);
    } else {
      // Smart Auto-detection when idle
      const first = fileList[0];
      const ext = first.name.split(".").pop()?.toLowerCase();
      let matchedTool = RADIAL_TOOLS[0]; // PDF to Word

      if (ext === "pdf") {
        matchedTool = RADIAL_TOOLS[0]; // PDF to Word
      } else if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
        matchedTool = RADIAL_TOOLS[1]; // Compress Image
      } else if (["mp4", "mov", "mkv", "avi"].includes(ext || "")) {
        matchedTool = RADIAL_TOOLS[6]; // Video to MP3
      } else if (["html", "htm"].includes(ext || "")) {
        const htmlTool = ALL_TOOLS.find((t) => t.id === "html-to-pdf");
        matchedTool = htmlTool || RADIAL_TOOLS[0];
      }

      setActiveTool(matchedTool);
      setSelectedFiles([first]);
      if (onFileDrop) onFileDrop(first);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
    }
    // reset input value so re-selecting the same file works
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setConversionResult(null);
  };

  // Run the conversion client-side
  const handleStartConversion = async () => {
    if (!activeTool) return;
    if (activeTool.id !== "youtube-downloader" && selectedFiles.length === 0) {
      fileInputRef.current?.click();
      return;
    }
    if (activeTool.id === "youtube-downloader" && !videoUrl.trim()) {
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    setStatusMessage("Preparing sandbox...");

    try {
      // Progress simulation animation step
      const stepInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 85) {
            clearInterval(stepInterval);
            return 85;
          }
          return p + 18;
        });
      }, 120);

      let output: ConversionOutput | null = null;

      switch (activeTool.id) {
        case "compress-image":
          setStatusMessage("Compressing canvas in browser memory...");
          output = await compressImageClient(
            selectedFiles[0],
            compressionQuality / 100,
            imageFormat
          );
          break;

        case "remove-bg":
          setStatusMessage("Detecting edges & removing background...");
          output = await removeBackgroundClient(selectedFiles[0]);
          break;

        case "pdf-merge":
          setStatusMessage("Merging PDF pages with pdf-lib...");
          output = await mergePdfsClient(selectedFiles);
          break;

        case "image-to-pdf":
          setStatusMessage("Generating vector PDF from images...");
          output = await imagesToPdfClient(selectedFiles, imageOrientation);
          break;

        case "pdf-to-word":
          setStatusMessage("Extracting text and building DOCX layout...");
          output = await pdfToWordClient(selectedFiles[0]);
          break;

        case "pdf-to-jpg":
          setStatusMessage("Rasterizing PDF page to JPG...");
          output = await pdfToJpgClient(selectedFiles[0]);
          break;

        case "video-to-mp3":
          setStatusMessage("Extracting audio stream...");
          output = await videoToMp3Client(selectedFiles[0], videoAudioBitrate);
          break;

        case "youtube-downloader":
          setStatusMessage("Processing video stream...");
          output = await downloadYouTubeClient(videoUrl, youtubeQuality);
          break;

        default:
          output = await compressImageClient(selectedFiles[0]);
      }

      clearInterval(stepInterval);
      setProgress(100);
      setStatusMessage("Done!");
      setConversionResult(output);
      setIsProcessing(false);
    } catch (err) {
      console.error("Conversion error:", err);
      setIsProcessing(false);
      setProgress(0);
      setStatusMessage(
        err instanceof Error ? err.message : "Conversion encountered an error"
      );
    }
  };

  const handleDownload = () => {
    if (!conversionResult) return;
    const url = URL.createObjectURL(conversionResult.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = conversionResult.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Helper to determine accepted file types
  const getAcceptedMimeTypes = () => {
    if (!activeTool) return "*/*";
    if (activeTool.acceptedFormats) return activeTool.acceptedFormats;
    if (activeTool.id.includes("pdf")) return ".pdf,application/pdf";
    if (activeTool.id.includes("image") || activeTool.id === "remove-bg")
      return ".jpg,.jpeg,.png,.webp,image/*";
    if (activeTool.id.includes("video") || activeTool.id.includes("mp3"))
      return ".mp4,.mov,.mkv,.avi,video/*";
    return "*/*";
  };

  const allowsMultiple =
    activeTool?.id === "pdf-merge" || activeTool?.id === "image-to-pdf";

  // Render the interactive tool conversion stage inside the center hub
  const renderActiveToolStage = () => {
    if (!activeTool) return null;

    const isYouTube = activeTool.id === "youtube-downloader";
    const hasFiles = selectedFiles.length > 0;

    return (
      <div
        ref={activeStageRef}
        className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-left select-text relative"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`clay-btn ${activeTool.clayColor} w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs`}
            >
              <ToolIcon iconType={activeTool.iconType} className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight truncate flex items-center gap-1.5">
                {activeTool.title}
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Ready
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                {activeTool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href={getToolUrl(activeTool)}
              title="Open full dedicated page"
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setActiveTool(null)}
              title="Close and return to overview"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Central Working Body */}
        <div className="my-auto py-2.5 space-y-2.5">
          {/* 1. YouTube Downloader Input */}
          {isYouTube ? (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">
                Paste YouTube / Media URL:
              </label>
              <div className="relative flex items-center">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full text-xs px-3 py-2 pr-16 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) setVideoUrl(text);
                    } catch {}
                  }}
                  className="absolute right-1 text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  Paste
                </button>
              </div>

              {/* Format Select */}
              <div className="flex items-center gap-1.5 pt-1">
                {["1080p", "720p", "MP3 Audio"].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setYoutubeQuality(fmt)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                      youtubeQuality === fmt
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* 2. File-Based Tools */}
              {!hasFiles ? (
                /* Empty Dropzone for active tool */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50/70 scale-102"
                      : "border-slate-300 hover:border-slate-400 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="w-9 h-9 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {isDragOver ? "Drop file right here" : "Choose file or drop here"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {allowsMultiple ? "Select one or multiple files" : activeTool.acceptedFormats || "Supported files"}
                  </p>
                </div>
              ) : (
                /* Selected File Card(s) */
                <div className="space-y-2">
                  <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                    {selectedFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 font-bold text-[9px] uppercase">
                            {f.name.split(".").pop()?.slice(0, 3)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate text-[11px] max-w-[170px]">
                              {f.name}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {formatBytes(f.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {allowsMultiple && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      Add another file
                    </button>
                  )}

                  {/* Tool-specific sliders / controls */}
                  {activeTool.id === "compress-image" && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>Quality: {compressionQuality}%</span>
                        <span className="text-slate-400">
                          {compressionQuality > 80
                            ? "High visual fidelity"
                            : "Balanced compression"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="95"
                        value={compressionQuality}
                        onChange={(e) =>
                          setCompressionQuality(Number(e.target.value))
                        }
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setImageFormat("image/webp")}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                            imageFormat === "image/webp"
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          WebP (High Savings)
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageFormat("image/jpeg")}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                            imageFormat === "image/jpeg"
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          JPG
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTool.id === "pdf-to-word" && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Format:
                      </span>
                      <button
                        type="button"
                        onClick={() => setPdfWordFormat("docx")}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          pdfWordFormat === "docx"
                            ? "bg-rose-600 text-white border-rose-600"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        Word (.docx)
                      </button>
                    </div>
                  )}

                  {activeTool.id === "image-to-pdf" && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Page:
                      </span>
                      <button
                        type="button"
                        onClick={() => setImageOrientation("portrait")}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          imageOrientation === "portrait"
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        Portrait
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageOrientation("landscape")}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          imageOrientation === "landscape"
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        Landscape
                      </button>
                    </div>
                  )}

                  {activeTool.id === "video-to-mp3" && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Bitrate:
                      </span>
                      {["320kbps", "192kbps"].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setVideoAudioBitrate(b)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            videoAudioBitrate === b
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                <span className="animate-pulse">{statusMessage}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed Stats Callout */}
          {conversionResult && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Conversion Complete ✨
              </div>
              <p className="text-[10px] text-emerald-700 truncate">
                {conversionResult.fileName} • {formatBytes(conversionResult.resultSize || 0)}
              </p>
              {conversionResult.statsLabel && (
                <span className="inline-block text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {conversionResult.statsLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Primary Actions */}
        <div className="pt-2 border-t border-slate-200/70 flex items-center gap-2 flex-shrink-0">
          {conversionResult ? (
            <>
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download File
              </button>
              <button
                type="button"
                onClick={() => {
                  setConversionResult(null);
                  setSelectedFiles([]);
                  setVideoUrl("");
                }}
                className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Convert another"
              >
                Another
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleStartConversion}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 ${
                isProcessing
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-blue-600 active:scale-98"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isProcessing
                ? "Processing in Memory..."
                : isYouTube
                ? "Download Video"
                : activeTool.actionText || "Start Conversion"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="relative flex-1 w-full my-2" data-purpose="radial-hub">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedMimeTypes()}
        multiple={allowsMultiple}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ================================================================ */}
      {/* MOBILE & COMPACT VIEW (block md:hidden): TOUCH CARD & CLAY GRID */}
      {/* ================================================================ */}
      <div className="block md:hidden w-full max-w-lg mx-auto space-y-4">
        {/* Mobile Central Conversion Stage / Upload Hub */}
        <div
          className={`relative central-hub w-full max-w-xs sm:max-w-sm mx-auto rounded-3xl border border-slate-200/90 flex flex-col justify-center text-center shadow-lg transition-all duration-300 ${
            activeTool ? "min-h-[290px] h-auto p-1" : "h-48 sm:h-52 p-5 cursor-pointer active:scale-98 hover:shadow-xl"
          } ${
            isDragOver && !activeTool
              ? "scale-102 ring-4 ring-blue-400 ring-offset-2 bg-blue-50/70"
              : ""
          }`}
          onClick={() => {
            if (!activeTool) fileInputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {activeTool ? (
            renderActiveToolStage()
          ) : (
            <>
              {/* Dashed inner border ring */}
              <div
                className={`absolute inset-2.5 rounded-2xl border-2 border-dashed pointer-events-none transition-colors ${
                  isDragOver ? "border-blue-500" : "border-slate-300"
                }`}
              />

              {/* Upload badge */}
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 mb-2 shadow-xs mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  />
                </svg>
              </div>

              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {isDragOver ? "Drop file right here" : "Choose File or Select Tool"}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-tight mx-auto">
                Tap to browse documents or tap a tool below
              </p>

              <span className="absolute -top-3 right-3 font-handwriting text-xs font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200/80 shadow-xs rotate-2">
                Local &amp; Fast ✨
              </span>
            </>
          )}
        </div>

        {/* Mobile Tools Section Header */}
        <div className="flex items-center justify-between px-1 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Popular Tools
            </span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Direct Convert
            </span>
          </div>
          <span className="font-handwriting text-sm font-semibold text-slate-500 rotate-[-2deg]">
            Tap to activate ⚡
          </span>
        </div>

        {/* Mobile 8 Clay Tools Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {RADIAL_TOOLS.map((tool) => {
            const isActive = activeTool?.id === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleToolClick(tool)}
                className={`bg-white/90 backdrop-blur-md rounded-2xl p-3 border transition-all text-left flex flex-col justify-between group ${
                  isActive
                    ? "ring-2 ring-blue-500 border-blue-400 bg-blue-50/50 shadow-md scale-102"
                    : "border-white/90 shadow-xs hover:shadow-md active:scale-95"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`clay-btn ${tool.clayColor} w-10 h-10 rounded-xl flex items-center justify-center text-white`}
                  >
                    <ToolIcon iconType={tool.iconType} className="w-5 h-5" />
                  </div>
                  {isActive ? (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-md">
                      Active
                    </span>
                  ) : (
                    <span className="font-handwriting text-[11px] font-semibold text-slate-500">
                      {tool.badgeText || "1-Click"}
                    </span>
                  )}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block truncate transition-colors ${
                      isActive ? "text-blue-700" : "text-slate-800 group-hover:text-blue-600"
                    }`}
                  >
                    {tool.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {tool.actionText || "Convert file"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* DESKTOP VIEW (hidden md:flex): SKEUOMORPHIC RADIAL ORBIT STAGE   */}
      {/* ================================================================ */}
      <div className="hidden md:flex relative flex-1 items-center justify-center min-h-[580px] w-full max-w-4xl mx-auto">
        {/* Central Circular Hub Drop Zone / Active Conversion Stage */}
        <div
          onClick={() => {
            if (!activeTool) fileInputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`central-hub border border-slate-200/80 z-10 transition-all duration-300 ${
            activeTool
              ? "w-[340px] h-[340px] rounded-[38px] p-1 shadow-2xl flex flex-col justify-between"
              : "w-72 h-72 rounded-full flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:scale-105"
          } ${
            isDragOver && !activeTool
              ? "scale-108 ring-4 ring-blue-400 ring-offset-4 shadow-2xl bg-blue-50/50"
              : ""
          }`}
          title={activeTool ? activeTool.title : "Drop file here or choose a tool"}
        >
          {activeTool ? (
            renderActiveToolStage()
          ) : (
            <>
              {/* Dashed inner border ring */}
              <div
                className={`absolute inset-3 rounded-full border border-dashed pointer-events-none transition-colors ${
                  isDragOver ? "border-blue-500 scale-98" : "border-slate-300"
                }`}
              />

              {/* Upload Tray Icon */}
              <div className="mb-2 text-slate-700 transition-transform group-hover:-translate-y-1">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {isDragOver ? "Drop file right here" : "Choose a tool"}
              </h2>
              <p className="text-[11px] leading-tight text-slate-400 mt-1 max-w-[150px]">
                {isDragOver
                  ? "Release to start conversion"
                  : "Click any tool around or drop your file directly"}
              </p>
            </>
          )}
        </div>

        {/* RADIAL 3D BUTTONS & HANDWRITTEN ANNOTATIONS */}

        {/* 1. Top (12 o'clock): PDF to Word */}
        <div className="absolute -top-1 flex flex-col items-center z-20">
          <div className="absolute -top-7 font-handwriting text-base font-semibold text-slate-600 rotate-[-4deg] whitespace-nowrap pointer-events-none">
            PDF to Word
            <svg className="w-5 h-4 text-slate-500 inline-block -rotate-12 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[0])}
            className={`clay-btn clay-red w-16 h-16 rounded-[22px] flex flex-col items-center justify-center text-white p-2 border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[0].id
                ? "ring-4 ring-rose-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="PDF to Word"
          >
            <ToolIcon iconType="pdf-word" className="w-7 h-7" />
            <span className="text-[9px] font-black tracking-tighter mt-0.5 uppercase">PDF</span>
          </button>
        </div>

        {/* 2. Top-Right (1:30): Compress Image */}
        <div className="absolute top-12 right-24 lg:right-28 flex flex-col items-center z-20">
          <div className="absolute -top-8 -right-8 font-handwriting text-sm leading-tight font-semibold text-slate-600 rotate-6 whitespace-nowrap text-left pointer-events-none">
            Smaller size<br /><span className="ml-1">Same quality</span>
            <svg className="w-6 h-4 text-slate-500 inline-block rotate-[80deg] -ml-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[1])}
            className={`clay-btn clay-green w-16 h-16 rounded-[22px] flex items-center justify-center text-white border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[1].id
                ? "ring-4 ring-emerald-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="Compress Image"
          >
            <ToolIcon iconType="image" className="w-8 h-8" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">Compress Image</span>
        </div>

        {/* 3. Right (3 o'clock): PDF Merge */}
        <div className="absolute right-10 lg:right-14 flex flex-col items-center z-20">
          <div className="absolute -top-7 -right-14 font-handwriting text-sm font-semibold text-slate-600 rotate-[-5deg] whitespace-nowrap pointer-events-none">
            Combine<br />PDF files
            <svg className="w-5 h-4 text-slate-500 inline-block rotate-90 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[2])}
            className={`clay-btn clay-blue w-16 h-16 rounded-[22px] flex items-center justify-center text-white border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[2].id
                ? "ring-4 ring-blue-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="PDF Merge"
          >
            <ToolIcon iconType="merge" className="w-8 h-8" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">PDF Merge</span>
        </div>

        {/* 4. Bottom-Right (4:30): PDF to JPG */}
        <div className="absolute bottom-12 right-24 lg:right-28 flex flex-col items-center z-20">
          <div className="absolute -top-3 -right-20 font-handwriting text-sm font-semibold text-slate-600 rotate-6 whitespace-nowrap leading-tight pointer-events-none">
            Convert<br />pages to images
            <svg className="w-5 h-4 text-slate-500 block rotate-180 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[3])}
            className={`clay-btn clay-pink w-16 h-16 rounded-[22px] flex items-center justify-center text-white border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[3].id
                ? "ring-4 ring-pink-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="PDF to JPG"
          >
            <ToolIcon iconType="zoom-in" className="w-8 h-8" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">PDF to JPG</span>
        </div>

        {/* 5. Bottom (6 o'clock): Remove Background */}
        <div className="absolute -bottom-1 flex flex-col items-center z-20">
          <div className="absolute top-1 -right-24 font-handwriting text-sm font-semibold text-slate-600 rotate-[-4deg] whitespace-nowrap pointer-events-none">
            <svg className="w-5 h-4 text-slate-500 inline-block -rotate-90 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            AI powered<br /><span className="ml-4">Cutout</span>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[4])}
            className={`clay-btn clay-cyan w-16 h-16 rounded-[22px] flex items-center justify-center text-slate-800 border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[4].id
                ? "ring-4 ring-cyan-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="Remove Background"
          >
            <ToolIcon iconType="cutout" className="w-8 h-8" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">Remove Background</span>
        </div>

        {/* 6. Bottom-Left (7:30): YouTube Downloader */}
        <div className="absolute bottom-12 left-24 lg:left-28 flex flex-col items-center z-20">
          <div className="absolute -top-7 -left-12 font-handwriting text-sm font-semibold text-slate-600 rotate-[-12deg] whitespace-nowrap pointer-events-none">
            Download<br />videos
            <svg className="w-5 h-4 text-slate-500 block rotate-12 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[5])}
            className={`clay-btn clay-yellow w-16 h-16 rounded-[22px] flex items-center justify-center text-slate-800 border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[5].id
                ? "ring-4 ring-amber-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="YouTube Downloader"
          >
            <ToolIcon iconType="play-down" className="w-7 h-7" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">YouTube Downloader</span>
        </div>

        {/* 7. Left (9 o'clock): Video to MP3 */}
        <div className="absolute left-10 lg:left-14 flex flex-col items-center z-20">
          <div className="absolute -top-8 -left-12 font-handwriting text-sm font-semibold text-slate-600 rotate-[-10deg] whitespace-nowrap pointer-events-none">
            Extract<br />audio
            <svg className="w-5 h-4 text-slate-500 inline-block -rotate-45 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[6])}
            className={`clay-btn clay-purple w-16 h-16 rounded-[22px] flex items-center justify-center text-white border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[6].id
                ? "ring-4 ring-purple-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="Video to MP3"
          >
            <ToolIcon iconType="play" className="w-8 h-8" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">Video to MP3</span>
        </div>

        {/* 8. Top-Left (10:30): Image to PDF */}
        <div className="absolute top-12 left-24 lg:left-28 flex flex-col items-center z-20">
          <div className="absolute -top-7 -left-10 font-handwriting text-sm font-semibold text-slate-600 rotate-[-10deg] whitespace-nowrap pointer-events-none">
            Turn images<br />into PDF
            <svg className="w-5 h-4 text-slate-500 inline-block rotate-45 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => handleToolClick(RADIAL_TOOLS[7])}
            className={`clay-btn clay-orange w-16 h-16 rounded-[22px] flex items-center justify-center text-orange-500 border-none outline-none transition-all duration-200 ${
              activeTool?.id === RADIAL_TOOLS[7].id
                ? "ring-4 ring-orange-400 ring-offset-4 scale-110 shadow-2xl"
                : "hover:scale-105"
            }`}
            title="Image to PDF"
          >
            <ToolIcon iconType="photo" className="w-8 h-8" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 whitespace-nowrap">Image to PDF</span>
        </div>
      </div>
    </section>
  );
}
