"use client";

import React from "react";

interface SignerProfileCardProps {
  signerName: string;
  setSignerName: (name: string) => void;
  signerTitle: string;
  setSignerTitle: (title: string) => void;
  attachAuditCert: boolean;
  setAttachAuditCert: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  isSuccess: boolean;
  onSignAndDownload: () => void;
}

export default function SignerProfileCard({
  signerName,
  setSignerName,
  signerTitle,
  setSignerTitle,
  attachAuditCert,
  setAttachAuditCert,
  isProcessing,
  isSuccess,
  onSignAndDownload,
}: SignerProfileCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200/80 flex flex-col gap-5">
      <h3 className="text-base font-black text-stone-900 tracking-tight">
        Signer Profile &amp; Audit
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-600">Full Legal Name</label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-600">Job Title / Capacity</label>
          <input
            type="text"
            value={signerTitle}
            onChange={(e) => setSignerTitle(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Audit Toggle */}
      <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-stone-900">
            Attach Cryptographic Audit Certificate
          </div>
          <div className="text-[11px] text-stone-500">
            Embeds client digest, timestamp, and local tamper seal
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAttachAuditCert((c) => !c)}
          className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
            attachAuditCert ? "bg-[#043d2c] justify-end" : "bg-stone-300 justify-start"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white shadow-xs inline-block" />
        </button>
      </div>

      {/* Final Execution CTA Button */}
      <button
        type="button"
        onClick={onSignAndDownload}
        disabled={isProcessing}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#043d2c] hover:bg-[#032e21] active:scale-[0.99] text-white text-sm font-bold shadow-[0_10px_20px_-4px_rgba(4,61,44,0.4)] hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Stamping &amp; Sealing PDF...</span>
          </>
        ) : isSuccess ? (
          <>
            <span>✓</span>
            <span>Downloaded Successfully!</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Sign &amp; Download PDF</span>
            <span>→</span>
          </>
        )}
      </button>
    </div>
  );
}
