"use client";

interface RelatedTool {
  id: string;
  title: string;
  href: string;
  color: string;
}

interface PdfToWordSidebarProps {
  relatedTools?: RelatedTool[];
}

const DEFAULT_RELATED: RelatedTool[] = [
  { id: "pdf-merge", title: "Merge PDF", href: "/all-tools/pdf/pdf-merge", color: "bg-sky-100 text-sky-600" },
  { id: "compress-pdf", title: "Compress PDF", href: "/all-tools/pdf/compress-pdf", color: "bg-violet-100 text-violet-600" },
  { id: "sign-pdf", title: "Sign PDF", href: "/all-tools/pdf/sign-pdf", color: "bg-emerald-100 text-emerald-600" },
  { id: "protect-pdf", title: "Protect PDF", href: "/all-tools/pdf/protect-pdf", color: "bg-amber-100 text-amber-600" },
  { id: "pdf-to-jpg", title: "PDF to JPG", href: "/all-tools/pdf/pdf-to-jpg", color: "bg-rose-100 text-rose-600" },
];

export default function PdfToWordSidebar({ relatedTools }: PdfToWordSidebarProps) {
  const tools = relatedTools && relatedTools.length > 0 ? relatedTools : DEFAULT_RELATED;

  return (
    <div className="space-y-4">
      {/* Quick Tools */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Tools
        </h3>
        <ul className="space-y-2">
          {tools.map((tool) => (
            <li key={tool.id}>
              <a
                href={tool.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all group no-underline"
              >
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-sm ${tool.color} flex-shrink-0`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {tool.title}
                </span>
                <svg className="w-3 h-3 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip note */}
      <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 shadow-sm relative overflow-hidden">
        {/* Sticky-note fold */}
        <div className="absolute top-0 right-0 w-6 h-6 bg-yellow-200 rounded-bl-xl" />
        <p className="text-xs font-semibold text-yellow-800 mb-1">💡 Tip</p>
        <p className="text-xs text-yellow-700 leading-relaxed">
          For scanned PDFs, output may be limited to raw text extraction. Use an OCR tool first for best results.
        </p>
      </div>

      {/* Privacy card */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          100% Private
        </p>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Your PDF is processed entirely in your browser using WebAssembly. No file is ever uploaded to a server.
        </p>
      </div>
    </div>
  );
}
