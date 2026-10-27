export type AudioFormat = "mp3" | "wav" | "aac" | "flac" | "m4a";
export type AudioBitrate = "320" | "256" | "128";
export type GainMode = "0dB" | "+3dB" | "EBU_R128";

export interface VideoMetadata {
  name: string;
  sizeBytes: number;
  formattedSize: string;
  durationSeconds: number;
  formattedDuration: string;
  resolution: string;
  fps: number;
  hasAudio: boolean;
  videoUrl?: string;
  file?: File;
  audioBuffer?: AudioBuffer;
}

export interface ExtractionConfig {
  format: AudioFormat;
  bitrate: AudioBitrate;
  gain: GainMode;
  startTimeSec: number;
  endTimeSec: number;
  title: string;
  artist: string;
  album: string;
}

export interface ExtractedAudioResult {
  blob: Blob;
  blobUrl: string;
  fileName: string;
  format: AudioFormat;
  bitrate: AudioBitrate;
  sizeBytes: number;
  formattedSize: string;
  durationSeconds: number;
  formattedDuration: string;
}
