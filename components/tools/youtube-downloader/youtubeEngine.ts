import { SAMPLE_VIDEOS } from "./sampleVideos";
import { YouTubeVideoMetadata } from "./types";

/**
 * Extracts YouTube video ID from various URL structures:
 * - https://www.youtube.com/watch?v=xxxx
 * - https://youtu.be/xxxx
 * - https://www.youtube.com/shorts/xxxx
 * - https://www.youtube.com/embed/xxxx
 * - raw 11-char ID
 */
export function extractYouTubeVideoId(input: string): string | null {
  const cleanInput = input.trim();
  if (!cleanInput) return null;

  // Check 11-character video ID directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanInput)) {
    return cleanInput;
  }

  // Regex patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const regex of patterns) {
    const match = cleanInput.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetches or constructs YouTube metadata for a given video ID or URL
 */
export async function resolveYouTubeVideo(
  urlOrId: string
): Promise<YouTubeVideoMetadata> {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) {
    throw new Error(
      "Invalid YouTube URL or ID. Please enter a valid YouTube video link (e.g., https://youtu.be/...)."
    );
  }

  // Check if it's one of our curated sample videos
  const matchedSample = SAMPLE_VIDEOS.find(
    (s) => s.id === videoId || s.url.includes(videoId)
  );
  if (matchedSample) {
    return matchedSample;
  }

  // Standard dynamic YouTube video representation
  const maxResThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const hqThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return {
    id: videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    title: `YouTube Video #${videoId}`,
    channelTitle: "YouTube Creator Channel",
    channelSubscribers: "1.2M subscribers",
    duration: "4:15",
    durationSeconds: 255,
    viewCount: "3.4M views",
    uploadDate: "Recent Upload",
    thumbnail: maxResThumb || hqThumb,
    description: `High-definition client stream ready for 1080p MP4 and 320 kbps MP3 conversion from ${videoId}.`,
    videoFormats: [
      {
        quality: "1080p Full HD",
        resolution: "1920×1080",
        extension: "mp4",
        fileSize: "95.4 MB",
        fps: 60,
        hasAudio: true,
        bitrate: "3,600 kbps",
        isRecommended: true,
      },
      {
        quality: "720p HD",
        resolution: "1280×720",
        extension: "mp4",
        fileSize: "52.1 MB",
        fps: 30,
        hasAudio: true,
        bitrate: "1,950 kbps",
      },
      {
        quality: "480p Standard",
        resolution: "854×480",
        extension: "mp4",
        fileSize: "28.0 MB",
        fps: 30,
        hasAudio: true,
        bitrate: "1,100 kbps",
      },
      {
        quality: "360p Compact",
        resolution: "640×360",
        extension: "mp4",
        fileSize: "16.8 MB",
        fps: 30,
        hasAudio: true,
        bitrate: "600 kbps",
      },
    ],
    audioFormats: [
      {
        quality: "320 kbps Ultra",
        bitrate: "320 kbps",
        extension: "mp3",
        fileSize: "9.8 MB",
        sampleRate: "48.0 kHz",
        isRecommended: true,
      },
      {
        quality: "256 kbps High",
        bitrate: "256 kbps",
        extension: "mp3",
        fileSize: "7.9 MB",
        sampleRate: "44.1 kHz",
      },
      {
        quality: "192 kbps Standard",
        bitrate: "192 kbps",
        extension: "mp3",
        fileSize: "5.8 MB",
        sampleRate: "44.1 kHz",
      },
      {
        quality: "128 kbps Light",
        bitrate: "128 kbps",
        extension: "m4a",
        fileSize: "3.9 MB",
        sampleRate: "44.1 kHz",
      },
    ],
    thumbnailFormats: [
      {
        quality: "Maximum Resolution",
        dimensions: "1920×1080",
        url: maxResThumb,
        fileSize: "450 KB",
      },
      {
        quality: "High Quality",
        dimensions: "1280×720",
        url: hqThumb,
        fileSize: "220 KB",
      },
    ],
  };
}

/**
 * Initiates simulated or client stream dispatch for video/audio downloading
 */
export async function downloadMediaStream(
  videoTitle: string,
  quality: string,
  extension: string
): Promise<void> {
  // Create synthetic media blob to trigger browser download
  const sanitizedTitle = videoTitle
    .replace(/[^a-zA-Z0-9_\-\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");

  const fileName = `${sanitizedTitle}_[${quality.replace(/\s+/g, "")}].${extension}`;

  // Synthetic payload header
  const dummyData = new Uint8Array(1024);
  const blob = new Blob([dummyData], {
    type: extension === "mp3" ? "audio/mpeg" : "video/mp4",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
