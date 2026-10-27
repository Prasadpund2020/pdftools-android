"use client";

interface PdfToWordPipelineProps {
  progress: number; // 0–100
  currentStep: string;
}

const STEPS = [
  { label: "Stream Read", icon: "📂", minProgress: 0, maxProgress: 25 },
  { label: "Text Extraction", icon: "🔍", minProgress: 25, maxProgress: 60 },
  { label: "Format Build", icon: "🏗️", minProgress: 60, maxProgress: 80 },
  { label: "Export Ready", icon: "✅", minProgress: 80, maxProgress: 100 },
];

type StepStatus = "pending" | "active" | "done";

function getStepStatus(stepIndex: number, progress: number): StepStatus {
  const step = STEPS[stepIndex];
  if (progress >= step.maxProgress) return "done";
  if (progress >= step.minProgress) return "active";
  return "pending";
}

export default function PdfToWordPipeline({ progress, currentStep }: PdfToWordPipelineProps) {
  return (
    <div className="w-full rounded-3xl bg-white border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 border-[2.5px] border-rose-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-slate-800">Converting…</p>
          <p className="text-xs text-slate-500">{currentStep}</p>
        </div>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-2 gap-3">
        {STEPS.map((step, i) => {
          const status = getStepStatus(i, progress);
          return (
            <div
              key={step.label}
              className={[
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 border transition-all duration-300",
                status === "done"
                  ? "bg-emerald-50 border-emerald-200"
                  : status === "active"
                  ? "bg-rose-50 border-rose-300"
                  : "bg-stone-50 border-stone-200 opacity-50",
              ].join(" ")}
            >
              {/* Status indicator */}
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                {status === "done" ? (
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : status === "active" ? (
                  <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-stone-300" />
                )}
              </span>
              <div>
                <p className={[
                  "text-xs font-semibold leading-tight",
                  status === "done" ? "text-emerald-700" : status === "active" ? "text-rose-700" : "text-slate-400",
                ].join(" ")}>
                  {step.icon} {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs font-semibold text-rose-600">{progress}%</p>
      </div>
    </div>
  );
}
