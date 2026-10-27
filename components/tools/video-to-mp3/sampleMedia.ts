import { VideoMetadata } from "./types";

/**
 * Returns procedural waveform bars (100 values between 0.15 and 0.95)
 */
export function generateWaveformBars(): number[] {
  const bars: number[] = [];
  const seed = [
    0.35, 0.45, 0.6, 0.8, 0.9, 0.4, 0.55, 0.7, 0.95, 0.5, 0.65, 0.85, 0.4,
    0.75, 0.88, 0.3, 0.5, 0.7, 0.85, 0.6, 0.72, 0.9, 0.45, 0.65, 0.8, 0.35,
    0.55, 0.75, 0.92, 0.58, 0.4, 0.68, 0.84, 0.5, 0.62, 0.78, 0.94, 0.42,
    0.6, 0.82, 0.55, 0.7, 0.88, 0.48, 0.64, 0.8, 0.96, 0.52, 0.68, 0.85,
  ];

  for (let i = 0; i < 90; i++) {
    const base = seed[i % seed.length];
    const wobble = Math.sin(i * 0.3) * 0.12;
    bars.push(Math.max(0.18, Math.min(0.98, base + wobble)));
  }
  return bars;
}

/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatTimeSeconds(seconds: number): string {
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Parses MM:SS or HH:MM:SS string into seconds
 */
export function parseTimeString(timeStr: string): number {
  const parts = timeStr.trim().split(":").map((p) => parseInt(p, 10) || 0);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/**
 * Creates sample metadata for Conference_Keynote_2025.mp4
 */
export function getSampleVideoMetadata(): VideoMetadata {
  return {
    name: "Conference_Keynote_2025.mp4",
    sizeBytes: 193146880, // 184.2 MB
    formattedSize: "184.2 MB",
    durationSeconds: 1455, // 24:15.00
    formattedDuration: "24:15",
    resolution: "1080p",
    fps: 60,
    hasAudio: true,
  };
}
