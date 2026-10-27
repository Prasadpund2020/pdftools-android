"use client";

interface PdfToWordSettingsValue {
  format: "docx" | "rtf" | "txt";
  pageRange: "all" | "custom";
  customRange: string;
  retainFormatting: boolean;
}

interface PdfToWordSettingsProps {
  settings: PdfToWordSettingsValue;
  onChange: (settings: PdfToWordSettingsValue) => void;
}

const FORMAT_OPTIONS: { value: PdfToWordSettingsValue["format"]; label: string }[] = [
  { value: "docx", label: "DOCX" },
  { value: "rtf", label: "RTF" },
  { value: "txt", label: "TXT" },
];

export default function PdfToWordSettings({ settings, onChange }: PdfToWordSettingsProps) {
  const update = <K extends keyof PdfToWordSettingsValue>(
    key: K,
    value: PdfToWordSettingsValue[K]
  ) => onChange({ ...settings, [key]: value });

  return (
    <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4 space-y-4">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
        Conversion Preferences
      </h3>

      {/* Output format */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
          Output Format
        </label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => update("format", value)}
              className={[
                "flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150",
                settings.format === value
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-stone-50 text-slate-600 border-stone-200 hover:border-rose-300 hover:text-rose-600",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        {settings.format === "rtf" && (
          <p className="mt-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-200">
            RTF is widely compatible with older Word versions.
          </p>
        )}
        {settings.format === "txt" && (
          <p className="mt-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200">
            Plain text — no formatting preserved.
          </p>
        )}
      </div>

      {/* Page range */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
          Page Range
        </label>
        <div className="flex gap-2">
          {(["all", "custom"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update("pageRange", opt)}
              className={[
                "flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150",
                settings.pageRange === opt
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-stone-50 text-slate-600 border-stone-200 hover:border-rose-300 hover:text-rose-600",
              ].join(" ")}
            >
              {opt === "all" ? "All Pages" : "Custom Range"}
            </button>
          ))}
        </div>
        {settings.pageRange === "custom" && (
          <input
            type="text"
            value={settings.customRange}
            onChange={(e) => update("customRange", e.target.value)}
            placeholder="e.g. 1-3, 5"
            className="mt-2 w-full text-xs rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition"
          />
        )}
      </div>

      {/* Retain formatting */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <span
            role="checkbox"
            aria-checked={settings.retainFormatting}
            tabIndex={0}
            onClick={() => update("retainFormatting", !settings.retainFormatting)}
            onKeyDown={(e) => e.key === " " && update("retainFormatting", !settings.retainFormatting)}
            className={[
              "relative inline-flex w-9 h-5 rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-300",
              settings.retainFormatting ? "bg-rose-600 border-rose-600" : "bg-stone-200 border-stone-300",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 mt-px",
                settings.retainFormatting ? "translate-x-4" : "translate-x-0.5",
              ].join(" ")}
            />
          </span>
          <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            Retain line & paragraph formatting
          </span>
        </label>
      </div>
    </div>
  );
}
