import { SAMPLE_TIKTOKS } from "./sampleTikToks";
import { TikTokMetadata } from "./types";

export function extractTikTokId(input: string): string | null {
  const clean = input.trim();
  if (!clean) return null;

  // Numeric ID
  const numMatch = clean.match(/\/video\/(\d+)/);
  if (numMatch && numMatch[1]) return numMatch[1];

  // Short URL e.g. vm.tiktok.com/ZM... or vt.tiktok.com/...
  const shortMatch = clean.match(/(?:vm\.tiktok\.com|vt\.tiktok\.com|tiktok\.com\/t)\/([a-zA-Z0-9]+)/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  if (/^\d{15,22}$/.test(clean)) return clean;

  return null;
}

export async function resolveTikTokVideo(urlOrId: string): Promise<TikTokMetadata> {
  const id = extractTikTokId(urlOrId);
  if (!id) {
    throw new Error("Invalid TikTok video URL. Please provide a link (e.g. https://www.tiktok.com/@user/video/... or vm.tiktok.com/...).");
  }

  const sampleMatch = SAMPLE_TIKTOKS.find((s) => s.id.includes(id) || s.url.includes(id));
  if (sampleMatch) return sampleMatch;

  return {
    id: `tt-${id}`,
    url: `https://www.tiktok.com/@tiktok_creator/video/${id}`,
    caption: `TikTok Viral Video Clip #${id}`,
    authorUsername: "tiktok_creator",
    authorNickname: "Trending Creator",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    duration: "0:25",
    playCount: "5.8M",
    likesCount: "820.4K",
    sharesCount: "42.1K",
    musicTitle: "Viral Sound Track",
    musicAuthor: "Original Audio",
    thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1080&q=80",
    videoFormats: [
      {
        quality: "HD No Watermark",
        resolution: "1080×1920",
        fps: 60,
        extension: "mp4",
        fileSize: "18.2 MB",
        bitrate: "4,200 kbps",
        isRecommended: true,
      },
      {
        quality: "Original (With Watermark)",
        resolution: "1080×1920",
        fps: 60,
        extension: "mp4",
        fileSize: "19.0 MB",
        bitrate: "4,200 kbps",
      },
    ],
    audioFormats: [
      {
        quality: "TikTok Viral Sound (320 kbps)",
        extension: "mp3",
        fileSize: "1.2 MB",
        bitrate: "320 kbps",
        sampleRate: "48.0 kHz",
      },
    ],
    coverFormats: [
      {
        quality: "Cover Poster",
        dimensions: "1080×1920",
        url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1080&q=80",
        fileSize: "320 KB",
      },
    ],
  };
}

export async function downloadTikTokStream(
  authorUsername: string,
  id: string,
  quality: string,
  extension: string
): Promise<void> {
  const fileName = `TikTok_${authorUsername}_${id}_${quality.replace(/\s+/g, "_")}.${extension}`;
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
