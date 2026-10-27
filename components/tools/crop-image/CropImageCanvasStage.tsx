"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ImageCropMeta, CropRect } from "./types";

interface CropImageCanvasStageProps {
  meta: ImageCropMeta;
  cropRect: CropRect;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  onCropChange: (rect: CropRect) => void;
}

type DragHandle = "none" | "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

export default function CropImageCanvasStage({
  meta,
  cropRect,
  rotation,
  flipHorizontal,
  flipVertical,
  onCropChange,
}: CropImageCanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeHandle, setActiveHandle] = useState<DragHandle>("none");
  const [dragStart, setDragStart] = useState<{ x: number; y: number; rect: CropRect } | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Draw image and crop overlay
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Responsive sizing
      const containerWidth = container.clientWidth || 800;
      const containerHeight = Math.max(450, container.clientHeight || 550);

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const srcW = img.width;
      const srcH = img.height;

      // Fit image into container with padding
      const padding = 32;
      const availW = containerWidth - padding * 2;
      const availH = containerHeight - padding * 2;

      const scale = Math.min(availW / srcW, availH / srcH, 1);
      setScaleFactor(scale);

      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = (containerWidth - drawW) / 2;
      const drawY = (containerHeight - drawH) / 2;
      setOffset({ x: drawX, y: drawY });

      // Draw original transformed image
      ctx.save();
      ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
      if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Convert image crop coords to screen coords
      const screenX = drawX + cropRect.x * scale;
      const screenY = drawY + cropRect.y * scale;
      const screenW = cropRect.width * scale;
      const screenH = cropRect.height * scale;

      // Darkened backdrop outside crop box
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      // Top
      ctx.fillRect(drawX, drawY, drawW, screenY - drawY);
      // Bottom
      ctx.fillRect(drawX, screenY + screenH, drawW, drawY + drawH - (screenY + screenH));
      // Left
      ctx.fillRect(drawX, screenY, screenX - drawX, screenH);
      // Right
      ctx.fillRect(screenX + screenW, screenY, drawX + drawW - (screenX + screenW), screenH);

      // Crop box border (Pink / Rose accent)
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, screenW, screenH);

      // Rule of Thirds 3x3 Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Verticals
      ctx.moveTo(screenX + screenW / 3, screenY);
      ctx.lineTo(screenX + screenW / 3, screenY + screenH);
      ctx.moveTo(screenX + (screenW * 2) / 3, screenY);
      ctx.lineTo(screenX + (screenW * 2) / 3, screenY + screenH);
      // Horizontals
      ctx.moveTo(screenX, screenY + screenH / 3);
      ctx.lineTo(screenX + screenW, screenY + screenH / 3);
      ctx.moveTo(screenX, screenY + (screenH * 2) / 3);
      ctx.lineTo(screenX + screenW, screenY + (screenH * 2) / 3);
      ctx.stroke();

      // Draw handles
      const handleSize = 10;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;

      const handles = [
        { x: screenX, y: screenY }, // nw
        { x: screenX + screenW, y: screenY }, // ne
        { x: screenX, y: screenY + screenH }, // sw
        { x: screenX + screenW, y: screenY + screenH }, // se
        { x: screenX + screenW / 2, y: screenY }, // n
        { x: screenX + screenW / 2, y: screenY + screenH }, // s
        { x: screenX, y: screenY + screenH / 2 }, // w
        { x: screenX + screenW, y: screenY + screenH / 2 }, // e
      ];

      handles.forEach((h) => {
        ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
      });
    };

    img.src = meta.dataUrl;
  }, [meta, cropRect, rotation, flipHorizontal, flipVertical]);

  useEffect(() => {
    renderCanvas();
    const handleResize = () => renderCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderCanvas]);

  // Pointer event handlers for moving and resizing
  const getHandleAtPoint = (px: number, py: number): DragHandle => {
    const scale = scaleFactor;
    const screenX = offset.x + cropRect.x * scale;
    const screenY = offset.y + cropRect.y * scale;
    const screenW = cropRect.width * scale;
    const screenH = cropRect.height * scale;
    const threshold = 16;

    if (Math.hypot(px - screenX, py - screenY) < threshold) return "nw";
    if (Math.hypot(px - (screenX + screenW), py - screenY) < threshold) return "ne";
    if (Math.hypot(px - screenX, py - (screenY + screenH)) < threshold) return "sw";
    if (Math.hypot(px - (screenX + screenW), py - (screenY + screenH)) < threshold) return "se";
    if (Math.abs(py - screenY) < threshold && px > screenX && px < screenX + screenW) return "n";
    if (Math.abs(py - (screenY + screenH)) < threshold && px > screenX && px < screenX + screenW) return "s";
    if (Math.abs(px - screenX) < threshold && py > screenY && py < screenY + screenH) return "w";
    if (Math.abs(px - (screenX + screenW)) < threshold && py > screenY && py < screenY + screenH) return "e";

    if (px >= screenX && px <= screenX + screenW && py >= screenY && py <= screenY + screenH) {
      return "move";
    }

    return "none";
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const handle = getHandleAtPoint(px, py);

    if (handle !== "none") {
      setActiveHandle(handle);
      setDragStart({ x: px, y: py, rect: { ...cropRect } });
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeHandle === "none" || !dragStart || scaleFactor === 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const handle = getHandleAtPoint(px, py);

      const cursorMap: Record<DragHandle, string> = {
        none: "default",
        move: "grab",
        nw: "nwse-resize",
        se: "nwse-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
      };
      if (canvasRef.current) {
        canvasRef.current.style.cursor = cursorMap[handle];
      }
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const dx = (px - dragStart.x) / scaleFactor;
    const dy = (py - dragStart.y) / scaleFactor;

    const startRect = dragStart.rect;
    let nextX = startRect.x;
    let nextY = startRect.y;
    let nextW = startRect.width;
    let nextH = startRect.height;

    const minSize = 40;
    const maxW = meta.originalWidth;
    const maxH = meta.originalHeight;

    if (activeHandle === "move") {
      nextX = Math.max(0, Math.min(maxW - startRect.width, startRect.x + dx));
      nextY = Math.max(0, Math.min(maxH - startRect.height, startRect.y + dy));
    } else if (activeHandle === "se") {
      nextW = Math.max(minSize, Math.min(maxW - startRect.x, startRect.width + dx));
      nextH = Math.max(minSize, Math.min(maxH - startRect.y, startRect.height + dy));
    } else if (activeHandle === "nw") {
      const targetW = startRect.width - dx;
      const targetH = startRect.height - dy;
      if (targetW > minSize && startRect.x + dx >= 0) {
        nextX = startRect.x + dx;
        nextW = targetW;
      }
      if (targetH > minSize && startRect.y + dy >= 0) {
        nextY = startRect.y + dy;
        nextH = targetH;
      }
    } else if (activeHandle === "ne") {
      nextW = Math.max(minSize, Math.min(maxW - startRect.x, startRect.width + dx));
      const targetH = startRect.height - dy;
      if (targetH > minSize && startRect.y + dy >= 0) {
        nextY = startRect.y + dy;
        nextH = targetH;
      }
    } else if (activeHandle === "sw") {
      nextH = Math.max(minSize, Math.min(maxH - startRect.y, startRect.height + dy));
      const targetW = startRect.width - dx;
      if (targetW > minSize && startRect.x + dx >= 0) {
        nextX = startRect.x + dx;
        nextW = targetW;
      }
    } else if (activeHandle === "e") {
      nextW = Math.max(minSize, Math.min(maxW - startRect.x, startRect.width + dx));
    } else if (activeHandle === "w") {
      const targetW = startRect.width - dx;
      if (targetW > minSize && startRect.x + dx >= 0) {
        nextX = startRect.x + dx;
        nextW = targetW;
      }
    } else if (activeHandle === "s") {
      nextH = Math.max(minSize, Math.min(maxH - startRect.y, startRect.height + dy));
    } else if (activeHandle === "n") {
      const targetH = startRect.height - dy;
      if (targetH > minSize && startRect.y + dy >= 0) {
        nextY = startRect.y + dy;
        nextH = targetH;
      }
    }

    onCropChange({
      x: Math.round(nextX),
      y: Math.round(nextY),
      width: Math.round(nextW),
      height: Math.round(nextH),
    });
  };

  const handlePointerUp = () => {
    setActiveHandle("none");
    setDragStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl bg-stone-900 border border-stone-800 shadow-xl overflow-hidden flex flex-col min-h-[460px] sm:min-h-[560px]"
    >
      {/* Top Info Bar */}
      <div className="px-4 py-2.5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between text-xs text-stone-300 z-10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <span className="font-bold">Active Crop Frame:</span>
          <span className="font-mono text-pink-400 font-black">
            {cropRect.width} × {cropRect.height} px
          </span>
        </div>

        <div className="text-[11px] font-mono text-stone-500">
          Source: {meta.originalWidth} × {meta.originalHeight} px
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden select-none touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block touch-none"
        />
      </div>

      {/* Footer Instructions */}
      <div className="px-4 py-2 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between font-medium">
        <span>Click and drag inside crop box to move • Drag corners or edges to reframe</span>
        <span className="font-mono text-stone-400">Rule of Thirds Grid</span>
      </div>
    </div>
  );
}
