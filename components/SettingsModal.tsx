"use client";

import React, { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
}: SettingsModalProps) {
  const [offlineMode, setOfflineMode] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoDownload, setAutoDownload] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 p-4 sm:p-5 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="font-bold text-sm text-slate-800">
              FileLab Settings & Privacy
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="py-3 sm:py-4 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                100% Local In-Browser Processing
              </h4>
              <p className="text-[11px] text-slate-500">
                Files never leave your machine; zero cloud uploads.
              </p>
            </div>
            <input
              type="checkbox"
              checked={offlineMode}
              onChange={(e) => setOfflineMode(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                3D Clay Bouncy Interactions
              </h4>
              <p className="text-[11px] text-slate-500">
                Playful skeuomorphic hover & active spring dynamics.
              </p>
            </div>
            <input
              type="checkbox"
              checked={hapticFeedback}
              onChange={(e) => setHapticFeedback(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Auto-Prompt File Download
              </h4>
              <p className="text-[11px] text-slate-500">
                Trigger download right after processing completes.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoDownload}
              onChange={(e) => setAutoDownload(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">Privacy Guarantee:</span> FileLab uses
            WebAssembly and pure HTML5 APIs to convert and compress your documents
            locally. No analytics trackers or file storage servers are involved.
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
}
