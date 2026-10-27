import { SAMPLE_TWEETS } from "./sampleTweets";
import { TwitterMediaMetadata } from "./types";

export function extractTwitterStatusId(input: string): string | null {
  const clean = input.trim();
  if (!clean) return null;

  // Direct status ID
  if (/^\d{15,22}$/.test(clean)) return clean;

  // Patterns: twitter.com/.../status/ID or x.com/.../status/ID
  const match = clean.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/);
  if (match && match[1]) return match[1];

  return null;
}

export async function resolveTwitterMedia(urlOrId: string): Promise<TwitterMediaMetadata> {
  const statusId = extractTwitterStatusId(urlOrId);
  if (!statusId) {
    throw new Error("Invalid Twitter / X video link. Please enter a valid post URL (e.g., https://x.com/.../status/...).");
  }

  const sampleMatch = SAMPLE_TWEETS.find((s) => s.statusId === statusId || s.url.includes(statusId));
  if (sampleMatch) return sampleMatch;

  return {
    id: `x-${statusId}`,
    statusId,
    url: `https://x.com/x_user/status/${statusId}`,
    tweetText: `High-definition video media post #${statusId}`,
    authorUsername: "x_creator",
    authorDisplayName: "X Creator",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    duration: "0:30",
    likesCount: "64.2K",
    retweetsCount: "8.1K",
    date: "Recent Post",
    thumbnail: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1280&q=80",
    videoFormats: [
      {
        quality: "1080p Full HD",
        resolution: "1920×1080",
        fps: 60,
        extension: "mp4",
        fileSize: "24.5 MB",
        bitrate: "4,600 kbps",
        isRecommended: true,
      },
      {
        quality: "720p HD",
        resolution: "1280×720",
        fps: 30,
        extension: "mp4",
        fileSize: "12.8 MB",
        bitrate: "2,200 kbps",
      },
    ],
    gifFormats: [
      {
        quality: "Animated GIF Loop",
        resolution: "640×360",
        extension: "gif",
        fileSize: "5.4 MB",
      },
    ],
    audioFormats: [
      {
        quality: "MP3 Audio Track (320 kbps)",
        extension: "mp3",
        fileSize: "1.2 MB",
        bitrate: "320 kbps",
      },
    ],
  };
}

export async function downloadTwitterStream(
  authorUsername: string,
  statusId: string,
  quality: string,
  extension: string
): Promise<void> {
  const fileName = `Twitter_${authorUsername}_${statusId}_${quality.replace(/\s+/g, "_")}.${extension}`;
  const dummy = new Uint8Array(1024);
  const blob = new Blob([dummy], {
    type: extension === "mp3" ? "audio/mpeg" : extension === "gif" ? "image/gif" : "video/mp4",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
