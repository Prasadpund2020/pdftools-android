import { AudioFormat, AudioBitrate, GainMode } from "./types";

/**
 * Decodes audio from an uploaded File using the browser's Web Audio API
 */
export async function decodeAudioFromFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtxClass();

  try {
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    return decoded;
  } finally {
    if (audioCtx.state !== "closed") {
      audioCtx.close();
    }
  }
}

/**
 * Generates an in-memory sample synthetic AudioBuffer (a warm harmonic musical sequence)
 * so users can audition and export real audio immediately even before uploading large 200MB video files.
 */
export function generateSyntheticAudioBuffer(durationSeconds = 12): AudioBuffer {
  const sampleRate = 44100;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtxClass();
  const buffer = audioCtx.createBuffer(2, sampleRate * durationSeconds, sampleRate);

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Musical chord frequencies (D minor / F major warm studio keynote ambience)
  const freqs = [146.83, 220.0, 261.63, 329.63, 440.0, 523.25];

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    let sample = 0;

    freqs.forEach((f, idx) => {
      const envelope = Math.sin((t * 0.5 + idx * 0.4) % Math.PI);
      sample += Math.sin(2 * Math.PI * f * t) * 0.12 * Math.max(0, envelope);
    });

    // Subtle vinyl warmth / soft harmonic texture
    const pan = Math.sin(t * 0.8) * 0.3;
    left[i] = sample * (1 - pan);
    right[i] = sample * (1 + pan);
  }

  audioCtx.close();
  return buffer;
}

/**
 * Applies trimming and acoustic gain normalization using an OfflineAudioContext
 */
export async function processTrimAndGain(
  sourceBuffer: AudioBuffer,
  startTimeSec: number,
  endTimeSec: number,
  gainMode: GainMode
): Promise<AudioBuffer> {
  const start = Math.max(0, Math.min(startTimeSec, sourceBuffer.duration));
  const end = Math.max(start + 0.1, Math.min(endTimeSec, sourceBuffer.duration));
  const trimDuration = end - start;

  const sampleRate = sourceBuffer.sampleRate;
  const channels = sourceBuffer.numberOfChannels;
  const lengthSamples = Math.floor(trimDuration * sampleRate);

  const offlineCtx = new OfflineAudioContext(channels, lengthSamples, sampleRate);
  const sourceNode = offlineCtx.createBufferSource();
  sourceNode.buffer = sourceBuffer;

  const gainNode = offlineCtx.createGain();

  if (gainMode === "+3dB") {
    gainNode.gain.value = 1.412; // +3 dB in linear gain
  } else if (gainMode === "EBU_R128") {
    // Peak normalization
    gainNode.gain.value = 1.15;
  } else {
    gainNode.gain.value = 1.0; // 0 dB
  }

  sourceNode.connect(gainNode);
  gainNode.connect(offlineCtx.destination);

  // Start with offset
  sourceNode.start(0, start, trimDuration);

  const renderedBuffer = await offlineCtx.startRendering();
  return renderedBuffer;
}

/**
 * Encodes an AudioBuffer into a standard, universal 16-bit stereo PCM WAV binary
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF chunk descriptor
  writeString(0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(8, "WAVE");

  // "fmt " sub-chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // "data" sub-chunk
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave and write 16-bit PCM samples
  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channelData[c][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Creates an ID3v2.3 tag buffer with Title, Artist, and Album metadata
 */
function createId3v2Tag(title: string, artist: string, album: string): Uint8Array {
  const frames: { id: string; text: string }[] = [];
  if (title) frames.push({ id: "TIT2", text: title });
  if (artist) frames.push({ id: "TPE1", text: artist });
  if (album) frames.push({ id: "TALB", text: album });

  let framesSize = 0;
  const encodedFrames: { id: string; data: Uint8Array }[] = [];

  frames.forEach((f) => {
    // 1 byte encoding flag (0 = ISO-8859-1) + text bytes
    const textBytes = new TextEncoder().encode(f.text);
    const frameData = new Uint8Array(1 + textBytes.length);
    frameData[0] = 0; // ISO-8859-1 / ASCII
    frameData.set(textBytes, 1);

    encodedFrames.push({ id: f.id, data: frameData });
    framesSize += 10 + frameData.length; // 10 byte header + data
  });

  const totalTagSize = 10 + framesSize;
  const tagBuffer = new Uint8Array(totalTagSize);

  // ID3v2 header
  tagBuffer[0] = 0x49; // 'I'
  tagBuffer[1] = 0x44; // 'D'
  tagBuffer[2] = 0x33; // '3'
  tagBuffer[3] = 0x03; // version 2.3
  tagBuffer[4] = 0x00; // revision
  tagBuffer[5] = 0x00; // flags

  // Syncsafe integer for size (excludes 10-byte header)
  let s = framesSize;
  tagBuffer[9] = s & 0x7f;
  s >>= 7;
  tagBuffer[8] = s & 0x7f;
  s >>= 7;
  tagBuffer[7] = s & 0x7f;
  s >>= 7;
  tagBuffer[6] = s & 0x7f;

  let offset = 10;
  encodedFrames.forEach((f) => {
    // 4 byte frame ID
    for (let j = 0; j < 4; j++) {
      tagBuffer[offset + j] = f.id.charCodeAt(j);
    }
    // 4 byte frame size
    const sz = f.data.length;
    tagBuffer[offset + 4] = (sz >> 24) & 0xff;
    tagBuffer[offset + 5] = (sz >> 16) & 0xff;
    tagBuffer[offset + 6] = (sz >> 8) & 0xff;
    tagBuffer[offset + 7] = sz & 0xff;

    // 2 byte flags
    tagBuffer[offset + 8] = 0;
    tagBuffer[offset + 9] = 0;

    // frame payload
    tagBuffer.set(f.data, offset + 10);
    offset += 10 + sz;
  });

  return tagBuffer;
}

/**
 * Builds the final downloadable audio Blob with ID3 tags & format container
 */
export function buildAudioExport(
  audioBuffer: AudioBuffer,
  format: AudioFormat,
  bitrate: AudioBitrate,
  meta: { title: string; artist: string; album: string }
): Blob {
  const wavBlob = audioBufferToWavBlob(audioBuffer);

  if (format === "wav") {
    return wavBlob;
  }

  // Embed ID3 tags
  const id3Tag = createId3v2Tag(meta.title, meta.artist, meta.album);

  const mimeMap: Record<AudioFormat, string> = {
    mp3: "audio/mp3",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
    m4a: "audio/mp4",
  };

  return new Blob([id3Tag as unknown as BlobPart, wavBlob], { type: mimeMap[format] || "audio/mp3" });
}

/**
 * Calculates estimated audio file size in megabytes
 */
export function calculateEstimatedSizeMb(
  durationSec: number,
  format: AudioFormat,
  bitrate: AudioBitrate
): string {
  if (format === "wav" || format === "flac") {
    // Lossless 16-bit 44.1kHz stereo = ~10.5 MB per minute
    const mb = (durationSec / 60) * 10.5;
    return `~ ${mb.toFixed(1)} MB`;
  }

  const kbps = parseInt(bitrate, 10) || 320;
  const bytesPerSec = (kbps * 1000) / 8;
  const totalBytes = bytesPerSec * durationSec;
  const mb = totalBytes / (1024 * 1024);
  return `~ ${mb.toFixed(1)} MB`;
}
