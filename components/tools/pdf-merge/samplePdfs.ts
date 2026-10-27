import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { MergePdfItem } from "./types";

export async function createSamplePdfs(): Promise<MergePdfItem[]> {
  const font = StandardFonts.Helvetica;
  const boldFont = StandardFonts.HelveticaBold;

  // 1. Executive Summary (2 pages)
  const doc1 = await PDFDocument.create();
  const helv = await doc1.embedFont(font);
  const helvBold = await doc1.embedFont(boldFont);

  // Page 1
  let p1 = doc1.addPage([595.28, 841.89]); // A4
  p1.drawRectangle({
    x: 40,
    y: 770,
    width: 515,
    height: 35,
    color: rgb(0.12, 0.45, 0.9),
  });
  p1.drawText("EXECUTIVE STRATEGY REPORT 2025", {
    x: 55,
    y: 782,
    size: 14,
    font: helvBold,
    color: rgb(1, 1, 1),
  });
  p1.drawText("Section 1: Organizational Growth & Strategic Objectives", {
    x: 40,
    y: 720,
    size: 13,
    font: helvBold,
    color: rgb(0.15, 0.15, 0.15),
  });
  p1.drawText(
    "This document outlines quarterly KPIs, operational expansions, and modern cloud\ninfrastructure migrations across enterprise divisions for fiscal year 2025.",
    { x: 40, y: 685, size: 10, font: helv, lineHeight: 15, color: rgb(0.3, 0.3, 0.3) }
  );

  // Page 2
  let p2 = doc1.addPage([595.28, 841.89]);
  p2.drawText("Section 2: Key Milestones Achieved", {
    x: 40,
    y: 780,
    size: 13,
    font: helvBold,
    color: rgb(0.15, 0.15, 0.15),
  });
  p2.drawText(
    "• Completed client-side zero-trust file processing architecture.\n• Decreased cloud bandwidth costs by 94% through WASM compression.\n• Enhanced PDF manipulation fidelity with strict font compliance.",
    { x: 40, y: 740, size: 10, font: helv, lineHeight: 18, color: rgb(0.3, 0.3, 0.3) }
  );

  const bytes1 = await doc1.save();

  // 2. Financial Audit Report (2 pages)
  const doc2 = await PDFDocument.create();
  const fHelv = await doc2.embedFont(font);
  const fHelvBold = await doc2.embedFont(boldFont);

  const fp1 = doc2.addPage([595.28, 841.89]);
  fp1.drawRectangle({
    x: 40,
    y: 770,
    width: 515,
    height: 35,
    color: rgb(0.05, 0.6, 0.38),
  });
  fp1.drawText("FINANCIAL AUDIT & METRICS REPORT", {
    x: 55,
    y: 782,
    size: 14,
    font: fHelvBold,
    color: rgb(1, 1, 1),
  });
  fp1.drawText("Consolidated Statement of Net Revenue (in Thousands USD)", {
    x: 40,
    y: 720,
    size: 12,
    font: fHelvBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  fp1.drawText(
    "Q1 Revenue: $2,450,000    Operating Margin: 38.4%\nQ2 Revenue: $3,120,000    Operating Margin: 41.2%\nQ3 Revenue: $3,890,000    Operating Margin: 44.8%",
    { x: 40, y: 680, size: 10, font: fHelv, lineHeight: 16, color: rgb(0.3, 0.3, 0.3) }
  );

  const fp2 = doc2.addPage([595.28, 841.89]);
  fp2.drawText("Auditor Approval & Compliance Signature", {
    x: 40,
    y: 780,
    size: 13,
    font: fHelvBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  fp2.drawText(
    "Certified as true and accurate by independent statutory advisory board.\nVerification Token: AUDIT-SEC-7749-2025-A",
    { x: 40, y: 740, size: 10, font: fHelv, lineHeight: 15, color: rgb(0.35, 0.35, 0.35) }
  );

  const bytes2 = await doc2.save();

  // 3. Corporate Appendix (1 page)
  const doc3 = await PDFDocument.create();
  const aHelv = await doc3.embedFont(font);
  const aHelvBold = await doc3.embedFont(boldFont);

  const ap1 = doc3.addPage([595.28, 841.89]);
  ap1.drawRectangle({
    x: 40,
    y: 770,
    width: 515,
    height: 35,
    color: rgb(0.85, 0.4, 0.1),
  });
  ap1.drawText("APPENDIX A: TERMS & GOVERNANCE", {
    x: 55,
    y: 782,
    size: 14,
    font: aHelvBold,
    color: rgb(1, 1, 1),
  });
  ap1.drawText(
    "Confidential and proprietary information intended solely for authorized internal stakeholders.\nUnauthorized copying or redistribution is strictly prohibited.",
    { x: 40, y: 720, size: 10, font: aHelv, lineHeight: 15, color: rgb(0.3, 0.3, 0.3) }
  );

  const bytes3 = await doc3.save();

  return [
    {
      id: "sample-1",
      name: "Executive_Strategy_2025.pdf",
      size: bytes1.byteLength,
      pageCount: 2,
      bytes: bytes1,
      rotation: 0,
    },
    {
      id: "sample-2",
      name: "Financial_Audit_Report.pdf",
      size: bytes2.byteLength,
      pageCount: 2,
      bytes: bytes2,
      rotation: 0,
    },
    {
      id: "sample-3",
      name: "Appendix_A_Governance.pdf",
      size: bytes3.byteLength,
      pageCount: 1,
      bytes: bytes3,
      rotation: 0,
    },
  ];
}
