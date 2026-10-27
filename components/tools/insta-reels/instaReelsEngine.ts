import { SAMPLE_REELS } from "./sampleReels";
import { InstagramReelMetadata } from "./types";

export function extractInstagramShortcode(input: string): string | null {
  const clean = input.trim();
  if (!clean) return null;

  // Raw shortcode e.g. C_abc123XYZ
  if (/^[a-zA-Z0-9_-]{8,15}$/.test(clean)) {
    return clean;
  }

  // URL patterns: /reel/CODE/, /reels/CODE/, /p/CODE/
  const match = clean.match(/(?:instagram\.com\/(?:reel|reels|p)\/)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

export async function resolveInstagramReel(urlOrCode: string): Promise<InstagramReelMetadata> {
  const shortcode = extractInstagramShortcode(urlOrCode);
  if (!shortcode) {
    throw new Error("Invalid Instagram Reel link. Please enter a valid Reel link (e.g., https://www.instagram.com/reel/...).");
  }

  const sampleMatch = SAMPLE_REELS.find((s) => s.shortcode === shortcode || s.url.includes(shortcode));
  if (sampleMatch) return sampleMatch;

  // Dynamic fallback for user custom links
  return {
    id: `reel-${shortcode}`,
    shortcode,
    url: `https://www.instagram.com/reel/${shortcode}/`,
    caption: `Instagram Reel video clip #${shortcode}`,
    authorUsername: "instagram_creator",
    authorDisplayName: "Instagram Creator",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    duration: "0:30",
    likesCount: "125.8K",
    commentsCount: "840",
    audioTrackName: "Original Audio — Instagram Audio Track",
    thumbnail: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1080&q=80",
    videoFormats: [
      {
        quality: "1080p Full HD",
        resolution: "1080×1920",
        fps: 60,
        extension: "mp4",
        fileSize: "22.4 MB",
        bitrate: "4,200 kbps",
        hasAudio: true,
        isRecommended: true,
      },
      {
        quality: "720p HD",
        resolution: "720×1280",
        fps: 30,
        extension: "mp4",
        fileSize: "11.8 MB",
        bitrate: "2,100 kbps",
        hasAudio: true,
      },
    ],
    audioFormats: [
      {
        quality: "Original Audio (320 kbps)",
        extension: "mp3",
        fileSize: "1.4 MB",
        bitrate: "320 kbps",
        sampleRate: "48.0 kHz",
      },
    ],
    coverFormats: [
      {
        quality: "High Definition Cover",
        dimensions: "1080×1920",
        url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1080&q=80",
        fileSize: "380 KB",
      },
    ],
  };
}

export async function downloadReelStream(
  authorUsername: string,
  shortcode: string,
  quality: string,
  extension: string
): Promise<void> {
  const fileName = `InstagramReel_${authorUsername}_${shortcode}_${quality.replace(/\s+/g, "")}.${extension}`;
  const dummy = new Uint8Array(1024);
  const blob = new Blob([dummy], { type: extension === "mp3" ? "audio/mpeg" : "video/mp4" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
