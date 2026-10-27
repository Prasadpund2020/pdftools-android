export type TikTokTab = "video" | "audio" | "cover";

export interface TikTokVideoFormat {
  quality: "HD No Watermark" | "Original (With Watermark)";
  resolution: string;
  fps: number;
  extension: "mp4";
  fileSize: string;
  bitrate: string;
  isRecommended?: boolean;
}

export interface TikTokAudioFormat {
  quality: "TikTok Viral Sound (320 kbps)" | "Standard Audio (192 kbps)";
  extension: "mp3";
  fileSize: string;
  bitrate: string;
  sampleRate: string;
}

export interface TikTokCoverFormat {
  quality: "Cover Poster";
  dimensions: string;
  url: string;
  fileSize: string;
}

export interface TikTokMetadata {
  id: string;
  url: string;
  caption: string;
  authorUsername: string;
  authorNickname: string;
  authorAvatar: string;
  isVerified: boolean;
  duration: string;
  playCount: string;
  likesCount: string;
  sharesCount: string;
  musicTitle: string;
  musicAuthor: string;
  thumbnail: string;
  videoFormats: TikTokVideoFormat[];
  audioFormats: TikTokAudioFormat[];
  coverFormats: TikTokCoverFormat[];
}
