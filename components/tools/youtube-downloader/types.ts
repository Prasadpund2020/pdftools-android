export type DownloadTab = "video" | "audio" | "thumbnail";

export interface VideoFormatOption {
  quality: "1080p Full HD" | "720p HD" | "480p Standard" | "360p Compact";
  resolution: string;
  extension: "mp4" | "webm";
  fileSize: string;
  fps: number;
  hasAudio: boolean;
  bitrate: string;
  isRecommended?: boolean;
}

export interface AudioFormatOption {
  quality: "320 kbps Ultra" | "256 kbps High" | "192 kbps Standard" | "128 kbps Light";
  bitrate: string;
  extension: "mp3" | "m4a" | "wav";
  fileSize: string;
  sampleRate: string;
  isRecommended?: boolean;
}

export interface ThumbnailOption {
  quality: "Maximum Resolution" | "High Quality" | "Standard Quality";
  dimensions: string;
  url: string;
  fileSize: string;
}

export interface YouTubeVideoMetadata {
  id: string;
  url: string;
  title: string;
  channelTitle: string;
  channelSubscribers?: string;
  duration: string;
  durationSeconds: number;
  viewCount: string;
  uploadDate: string;
  thumbnail: string;
  description: string;
  videoFormats: VideoFormatOption[];
  audioFormats: AudioFormatOption[];
  thumbnailFormats: ThumbnailOption[];
}
