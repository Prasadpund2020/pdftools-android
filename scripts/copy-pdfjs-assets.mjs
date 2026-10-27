/**
 * Copies the pdf.js runtime assets that must be served over HTTP into `public/pdfjs`.
 *
 * pdf.js needs these at runtime:
 *  - pdf.worker.min.mjs : the rendering worker
 *  - cmaps/             : Adobe CMap tables (CJK / non-embedded encodings)
 *  - standard_fonts/    : fallback fonts for PDFs that do not embed their fonts
 *  - wasm/              : JBIG2 / OpenJPEG / QCMS decoders for exotic image encodings
 *  - icc/               : ICC colour profiles
 *
 * The files are generated artefacts, so `public/pdfjs` is git-ignored and rebuilt
 * on every `npm install` via the `postinstall` script.
 */
import { cp, mkdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDir, "..");
const sourceRoot = join(projectRoot, "node_modules", "pdfjs-dist");
const targetRoot = join(projectRoot, "public", "pdfjs");

const COPY_TASKS = [
  { from: join(sourceRoot, "build", "pdf.worker.min.mjs"), to: join(targetRoot, "pdf.worker.min.mjs") },
  { from: join(sourceRoot, "cmaps"), to: join(targetRoot, "cmaps") },
  { from: join(sourceRoot, "standard_fonts"), to: join(targetRoot, "standard_fonts") },
  { from: join(sourceRoot, "wasm"), to: join(targetRoot, "wasm") },
  { from: join(sourceRoot, "icc"), to: join(targetRoot, "icc") },
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(sourceRoot))) {
    console.warn("[pdfjs-assets] pdfjs-dist is not installed yet - skipping asset copy.");
    return;
  }

  await rm(targetRoot, { recursive: true, force: true });
  await mkdir(targetRoot, { recursive: true });

  for (const task of COPY_TASKS) {
    if (!(await exists(task.from))) continue;
    await cp(task.from, task.to, { recursive: true });
  }

  console.log("[pdfjs-assets] pdf.js runtime assets copied to public/pdfjs");
}

main().catch((error) => {
  console.error("[pdfjs-assets] Failed to copy pdf.js runtime assets:", error);
  process.exitCode = 1;
});
