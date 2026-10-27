export type TwitterDownloadTab = "video" | "gif" | "audio";

export interface TwitterVideoFormat {
  quality: "1080p Full HD" | "720p HD" | "480p Standard" | "360p Compact";
  resolution: string;
  fps: number;
  extension: "mp4";
  fileSize: string;
  bitrate: string;
  isRecommended?: boolean;
}

export interface TwitterGifFormat {
  quality: "Animated GIF Loop";
  resolution: string;
  extension: "gif";
  fileSize: string;
}

export interface TwitterAudioFormat {
  quality: "MP3 Audio Track (320 kbps)";
  extension: "mp3";
  fileSize: string;
  bitrate: string;
}

export interface TwitterMediaMetadata {
  id: string;
  statusId: string;
  url: string;
  tweetText: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  isVerified: boolean;
  duration: string;
  likesCount: string;
  retweetsCount: string;
  date: string;
  thumbnail: string;
  videoFormats: TwitterVideoFormat[];
  gifFormats: TwitterGifFormat[];
  audioFormats: TwitterAudioFormat[];
}
