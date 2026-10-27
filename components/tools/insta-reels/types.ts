export type ReelDownloadTab = "video" | "audio" | "cover";

export interface ReelVideoFormat {
  quality: "1080p Full HD" | "720p HD";
  resolution: string;
  fps: number;
  extension: "mp4";
  fileSize: string;
  bitrate: string;
  hasAudio: boolean;
  isRecommended?: boolean;
}

export interface ReelAudioFormat {
  quality: "Original Audio (320 kbps)" | "Standard Audio (192 kbps)";
  extension: "mp3";
  fileSize: string;
  bitrate: string;
  sampleRate: string;
}

export interface ReelCoverFormat {
  quality: "High Definition Cover";
  dimensions: string;
  url: string;
  fileSize: string;
}

export interface InstagramReelMetadata {
  id: string;
  shortcode: string;
  url: string;
  caption: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  isVerified: boolean;
  duration: string;
  likesCount: string;
  commentsCount: string;
  audioTrackName: string;
  thumbnail: string;
  videoFormats: ReelVideoFormat[];
  audioFormats: ReelAudioFormat[];
  coverFormats: ReelCoverFormat[];
}
