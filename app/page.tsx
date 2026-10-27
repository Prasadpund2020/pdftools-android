import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Online File Conversion, Compression & Download Tools",
  description:
    "Free, 100% private client-side file tools: convert PDF to Word, compress JPG & PNG images, merge PDFs, extract MP3 audio, and download videos with zero server uploads.",
  keywords: [
    "free online tools",
    "pdf to word converter",
    "compress image online",
    "merge pdf files",
    "pdf to jpg converter",
    "remove background free",
    "video to mp3 converter",
    "youtube downloader hd",
    "image to pdf",
    "client-side file tools",
    "no upload file converter",
    "private file tools",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FileLab — Free Online File Conversion, Compression & Download Tools",
    description:
      "Private & safe client-side file tools: PDF conversion, image compression, audio extraction, video downloads, and more. 100% in-browser processing with zero server uploads.",
    url: SITE_URL,
    siteName: "FileLab",
    type: "website",
    images: [
      {
        url: "/images/all-tools-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "FileLab — Free Online File Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FileLab — Free Online File Tools",
    description:
      "Private & fast client-side file tools: PDF conversion, image compression, audio extraction, video downloads, and more.",
    images: ["/images/all-tools-hero-banner.png"],
  },
};

export default function Home() {
  return <HomeClient />;
}
