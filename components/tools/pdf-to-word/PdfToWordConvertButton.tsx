"use client";

interface PdfToWordConvertButtonProps {
  onConvert: () => void;
  isDisabled?: boolean;
  format: string;
}

const FORMAT_LABELS: Record<string, string> = {
  docx: "Word (.docx)",
  rtf: "RTF Document",
  txt: "Plain Text (.txt)",
};

export default function PdfToWordConvertButton({
  onConvert,
  isDisabled = false,
  format,
}: PdfToWordConvertButtonProps) {
  const label = FORMAT_LABELS[format] ?? "Word (.docx)";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onConvert}
        disabled={isDisabled}
        className={[
          "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all duration-200",
          isDisabled
            ? "bg-stone-300 cursor-not-allowed opacity-70"
            : "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 hover:shadow-lg active:scale-[0.98]",
        ].join(" ")}
      >
        {/* Document / Word icon */}
        <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
        </svg>
        Convert to {label}
      </button>

      {/* Privacy note */}
      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your file never leaves your browser
      </p>
    </div>
  );
}
