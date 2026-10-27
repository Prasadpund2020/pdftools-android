import type { Metadata, Viewport } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FileLab — Free Online File Conversion, Compression & Download Tools",
    template: "%s | FileLab",
  },
  description:
    "Private & safe client-side file tools: PDF conversion, image compression, audio extraction, video downloads, and more. 100% in-browser processing with zero server uploads.",
  keywords: [
    "pdf to word",
    "compress image",
    "pdf merge",
    "pdf to jpg",
    "remove background",
    "video to mp3",
    "youtube downloader",
    "image to pdf",
    "free converting tools",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "FileLab — Free Online File Conversion & Editing Tools",
    description:
      "Private, client-side file tools running directly in your browser. Convert, compress, and download with zero server uploads.",
    url: SITE_URL,
    siteName: "FileLab",
    images: [
      {
        url: "/images/all-tools-hero-banner.png",
        width: 1200,
        height: 630,
        alt: "FileLab — Free Online File Conversion & Editing Tools",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileLab — Free Online File Tools",
    description:
      "Private & fast client-side file tools: PDF conversion, image compression, audio extraction, video downloads, and more.",
    images: ["/images/all-tools-hero-banner.png"],
  },
  verification: {
    google: "google12e62b428644e34e",
    other: {
      "msvalidate.01": "723CAAC4B5340BA05AC43B1EC46DF2E1",
    },
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FileLab",
  url: SITE_URL,
  description:
    "Free online conversion tools: convert PDF to Word, compress images, merge PDFs, extract audio from videos, and download media safely in your browser.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/all-tools?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const viewport: Viewport = {
  themeColor: "#edebe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context file" />
        <link rel="help" type="text/plain" href="/llms-full.txt" title="Full LLM Documentation" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="relative min-h-screen overflow-x-hidden font-sans antialiased">
        {children}
        <Analytics />
        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HG238SCTCE"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HG238SCTCE');
            `,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "z3drva11mt");
            `,
          }}
        />
      </body>
    </html>
  );
}
