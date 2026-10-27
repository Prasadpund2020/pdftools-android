"use client";

import React from "react";
import { SignatureMode } from "./types";

interface SignatureCreatorCardProps {
  signatureMode: SignatureMode;
  setSignatureMode: (mode: SignatureMode) => void;
  selectedInkColor: string;
  setSelectedInkColor: (color: string) => void;
  selectedThickness: number;
  setSelectedThickness: (thickness: number) => void;
  typedSignature: string;
  setTypedSignature: (sig: string) => void;
  signerName: string;
  signingDate: string;
  setSigningDate: (date: string) => void;
  setIsSignaturePlaced: (placed: boolean) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  clearCanvas: () => void;
}

export default function SignatureCreatorCard({
  signatureMode,
  setSignatureMode,
  selectedInkColor,
  setSelectedInkColor,
  selectedThickness,
  setSelectedThickness,
  typedSignature,
  setTypedSignature,
  signerName,
  signingDate,
  setSigningDate,
  setIsSignaturePlaced,
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
  clearCanvas,
}: SignatureCreatorCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200/80 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            ✍️
          </span>
          <h3 className="text-base font-black text-stone-900 tracking-tight">
            Signature Creator
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full uppercase">
          Active
        </span>
      </div>

      {/* Mode Switcher: Type, Draw, Upload */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 border border-stone-200/60 text-center text-xs font-bold">
        <button
          type="button"
          onClick={() => setSignatureMode("type")}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            signatureMode === "type"
              ? "bg-[#043d2c] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          Type
        </button>
        <button
          type="button"
          onClick={() => setSignatureMode("draw")}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            signatureMode === "draw"
              ? "bg-[#043d2c] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          Draw
        </button>
        <button
          type="button"
          onClick={() => setSignatureMode("upload")}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            signatureMode === "upload"
              ? "bg-[#043d2c] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          Upload
        </button>
      </div>

      {/* Studio Signature Pad */}
      <div className="bg-[#fcfaf7] rounded-2xl p-4 border border-stone-200/80 flex flex-col gap-3 shadow-inner">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Ink Formulation Preview</span>
          {signatureMode === "draw" && (
            <button
              type="button"
              onClick={clearCanvas}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Canvas
            </button>
          )}
        </div>

        {/* Rendering Pad based on Mode */}
        <div className="w-full h-28 bg-white rounded-xl border border-stone-200 flex items-center justify-center relative overflow-hidden shadow-2xs">
          {/* Guidelines */}
          <div className="absolute inset-x-4 top-1/2 border-b border-stone-200/60 pointer-events-none" />

          {signatureMode === "type" ? (
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => {
                setTypedSignature(e.target.value);
                setIsSignaturePlaced(true);
              }}
              placeholder="Type your signature..."
              className="w-full text-center font-serif italic text-2xl sm:text-3xl font-black bg-transparent outline-none px-4"
              style={{ color: selectedInkColor }}
            />
          ) : signatureMode === "draw" ? (
            <canvas
              ref={canvasRef}
              width={400}
              height={110}
              className="w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          ) : (
            <div className="text-center p-3">
              <p className="text-xs text-stone-500 mb-2">Upload PNG/JPG signature stamp</p>
              <label className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold cursor-pointer text-stone-700">
                Choose File
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          )}

          <span className="absolute bottom-1 right-2 text-[9px] text-stone-400 font-mono">
            High Fidelity Curve
          </span>
        </div>

        {/* Ink Colors & Stroke Controls */}
        <div className="flex items-center justify-between pt-1">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Ink:</span>
            <button
              type="button"
              onClick={() => setSelectedInkColor("#1e1b1a")}
              className={`w-5 h-5 rounded-full bg-[#1e1b1a] transition-transform cursor-pointer ${
                selectedInkColor === "#1e1b1a" ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : ""
              }`}
              title="Matte Charcoal Black"
            />
            <button
              type="button"
              onClick={() => setSelectedInkColor("#003751")}
              className={`w-5 h-5 rounded-full bg-[#003751] transition-transform cursor-pointer ${
                selectedInkColor === "#003751" ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : ""
              }`}
              title="Archival Navy"
            />
            <button
              type="button"
              onClick={() => setSelectedInkColor("#9d4300")}
              className={`w-5 h-5 rounded-full bg-[#9d4300] transition-transform cursor-pointer ${
                selectedInkColor === "#9d4300" ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : ""
              }`}
              title="Notary Crimson"
            />
          </div>

          {/* Stroke thickness */}
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-full">
            {[1, 2, 3].map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setSelectedThickness(th)}
                className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedThickness === th
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {th}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stash Pills */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          Quick Apply Stash
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setTypedSignature(signerName);
              setIsSignaturePlaced(true);
            }}
            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all active:scale-95 cursor-pointer"
          >
            <div className="text-[10px] font-bold text-stone-700 truncate">
              {signerName}
            </div>
            <div className="text-[9px] text-stone-400">Primary Signature</div>
          </button>

          <button
            type="button"
            onClick={() => {
              const initials = signerName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("");
              setTypedSignature(initials || "AR");
              setIsSignaturePlaced(true);
            }}
            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all active:scale-95 cursor-pointer"
          >
            <div className="text-[10px] font-bold text-stone-700 truncate">
              Initials ({signerName.split(" ").filter(Boolean).map((n) => n[0]).join("") || "AR"})
            </div>
            <div className="text-[9px] text-stone-400">Monogram Stamp</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSigningDate(new Date().toISOString().split("T")[0]);
            }}
            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all active:scale-95 cursor-pointer"
          >
            <div className="text-[10px] font-bold text-stone-700 truncate">
              Today
            </div>
            <div className="text-[9px] text-stone-400">{signingDate}</div>
          </button>
        </div>
      </div>
    </div>
  );
}
