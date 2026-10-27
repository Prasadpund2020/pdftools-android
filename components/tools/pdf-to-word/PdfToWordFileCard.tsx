"use client";

interface PdfToWordFileCardProps {
  file: File;
  fileInfo: { name: string; size: string; pages: number; hasText: boolean } | null;
  onRemove: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfToWordFileCard({
  file,
  fileInfo,
  onRemove,
}: PdfToWordFileCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
      {/* PDF Icon */}
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-14 rounded-xl bg-rose-100 border border-rose-200 relative">
        <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-tight text-white bg-rose-600 rounded px-1 leading-4">
          PDF
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
          {fileInfo && (
            <span className="text-xs text-slate-500">
              {fileInfo.pages} {fileInfo.pages === 1 ? "page" : "pages"}
            </span>
          )}
          {/* Target format badge */}
          <span className="text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-2 py-0.5 border border-blue-200">
            → .DOCX
          </span>
        </div>

        {/* Text search badge */}
        {fileInfo && (
          <div className="mt-2">
            {fileInfo.hasText ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Text searchable
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-2.5 py-1 border border-amber-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scanned — OCR not available
              </span>
            )}
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Remove file"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
