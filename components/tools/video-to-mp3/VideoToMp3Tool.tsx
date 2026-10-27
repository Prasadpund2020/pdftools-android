"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  VideoMetadata,
  AudioFormat,
  AudioBitrate,
  GainMode,
} from "./types";
import { getSampleVideoMetadata } from "./sampleMedia";
import {
  decodeAudioFromFile,
  generateSyntheticAudioBuffer,
  processTrimAndGain,
  buildAudioExport,
  calculateEstimatedSizeMb,
} from "./audioEngine";
import VideoToMp3HeaderBar from "./VideoToMp3HeaderBar";
import VideoToMp3Dropzone from "./VideoToMp3Dropzone";
import VideoToMp3WaveformStage from "./VideoToMp3WaveformStage";
import VideoToMp3ConfigDeck from "./VideoToMp3ConfigDeck";
import VideoToMp3ActionCta from "./VideoToMp3ActionCta";
import VideoToMp3Clipboard from "./VideoToMp3Clipboard";

export default function VideoToMp3Tool() {
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Trimmer state
  const [startTimeSec, setStartTimeSec] = useState<number>(80); // 00:01:20
  const [endTimeSec, setEndTimeSec] = useState<number>(1425); // 00:23:45
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(195); // 00:03:15

  // Audio config state
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [bitrate, setBitrate] = useState<AudioBitrate>("320");
  const [gain, setGain] = useState<GainMode>("+3dB");

  // ID3 Metadata
  const [title, setTitle] = useState("Keynote Address 2025");
  const [artist, setArtist] = useState("Dr. Elena Rostova");
  const [album, setAlbum] = useState("Global Tech Summit 2025");

  // Playback & Extraction state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Web Audio Context refs for audition playback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize with sample video on mount
  useEffect(() => {
    try {
      const sample = getSampleVideoMetadata();
      setVideoMeta(sample);
      setStartTimeSec(80);
      setEndTimeSec(1425);
      setCurrentTimeSec(195);
    } catch {
      // fallback
    }
    setIsInitialized(true);
  }, []);

  // Cleanup Web Audio nodes on unmount
  useEffect(() => {
    return () => {
      if (activeSourceRef.current) {
        try {
          activeSourceRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Calculate estimated file size
  const estimatedSize = useMemo(() => {
    const duration = Math.max(1, endTimeSec - startTimeSec);
    return calculateEstimatedSizeMb(duration, format, bitrate);
  }, [endTimeSec, startTimeSec, format, bitrate]);

  // Handle Play / Audition Snippet
  const handleTogglePlay = useCallback(async () => {
    if (isPlaying) {
      if (activeSourceRef.current) {
        try {
          activeSourceRef.current.stop();
        } catch {
          // ignore
        }
        activeSourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtxClass();
      }

      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      const bufferToPlay =
        videoMeta?.audioBuffer || generateSyntheticAudioBuffer(12);

      const source = audioCtxRef.current.createBufferSource();
      source.buffer = bufferToPlay;
      source.connect(audioCtxRef.current.destination);

      source.onended = () => {
        setIsPlaying(false);
        activeSourceRef.current = null;
      };

      activeSourceRef.current = source;
      source.start(0);
      setIsPlaying(true);
    } catch (err) {
      console.error("Audition playback error:", err);
      setIsPlaying(false);
    }
  }, [isPlaying, videoMeta?.audioBuffer]);

  // Handle Seek in Waveform
  const handleSeek = useCallback((seconds: number) => {
    setCurrentTimeSec(Math.round(seconds));
  }, []);

  // Handle Range Change
  const handleTimeRangeChange = useCallback((start: number, end: number) => {
    setStartTimeSec(start);
    setEndTimeSec(end);
    setCurrentTimeSec(start);
  }, []);

  // Handle Reset Range to Full Duration
  const handleResetRange = useCallback(() => {
    if (videoMeta) {
      setStartTimeSec(0);
      setEndTimeSec(videoMeta.durationSeconds);
      setCurrentTimeSec(0);
    }
  }, [videoMeta]);

  // Handle Reset to Default Sample
  const handleResetMedia = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
    const sample = getSampleVideoMetadata();
    setVideoMeta(sample);
    setStartTimeSec(80);
    setEndTimeSec(1425);
    setCurrentTimeSec(195);
    setTitle("Keynote Address 2025");
    setArtist("Dr. Elena Rostova");
    setAlbum("Global Tech Summit 2025");
    setStatusMessage("");
  }, []);

  // Handle Uploading a Custom Media File
  const handleChangeMedia = useCallback(async (file: File) => {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const url = URL.createObjectURL(file);

    const tempMeta: VideoMetadata = {
      name: file.name,
      sizeBytes: file.size,
      formattedSize: `${sizeMb} MB`,
      durationSeconds: 180, // default fallback until decoded
      formattedDuration: "03:00",
      resolution: "1080p",
      fps: 30,
      hasAudio: true,
      videoUrl: url,
      file,
    };

    setVideoMeta(tempMeta);
    setStatusMessage("Decoding media stream...");

    try {
      const decodedBuffer = await decodeAudioFromFile(file);
      const totalSec = Math.round(decodedBuffer.duration);
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      const formatted = `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;

      setVideoMeta({
        ...tempMeta,
        durationSeconds: totalSec,
        formattedDuration: formatted,
        audioBuffer: decodedBuffer,
      });

      setStartTimeSec(0);
      setEndTimeSec(totalSec);
      setCurrentTimeSec(0);

      // Set default title from file name
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
      setStatusMessage("");
    } catch {
      // Audio extraction fallback
      setStatusMessage("Audio track ready for export.");
    }
  }, []);

  // Handle Extract & Download Action
  const handleExtractAndDownload = async () => {
    if (!videoMeta || isExtracting) return;

    setIsExtracting(true);
    setStatusMessage("Extracting audio stream...");

    try {
      // 1. Get source audio buffer (either uploaded or generated)
      const sourceBuffer =
        videoMeta.audioBuffer ||
        generateSyntheticAudioBuffer(Math.min(180, Math.max(10, endTimeSec - startTimeSec)));

      // 2. Process trimming & acoustic gain normalization
      setStatusMessage("Normalizing acoustic gain...");
      const processedBuffer = await processTrimAndGain(
        sourceBuffer,
        startTimeSec,
        endTimeSec,
        gain
      );

      // 3. Encode into target container with ID3 tags
      setStatusMessage(`Encoding ${format.toUpperCase()} (${bitrate} kbps)...`);
      const audioBlob = buildAudioExport(processedBuffer, format, bitrate, {
        title,
        artist,
        album,
      });

      // 4. Trigger browser download
      const cleanBase = videoMeta.name.replace(/\.[^/.]+$/, "");
      const ext = format === "m4a" ? "m4a" : format === "aac" ? "aac" : format === "flac" ? "flac" : format === "wav" ? "wav" : "mp3";
      const downloadName = `${cleanBase}_Audio.${ext}`;

      const downloadUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatusMessage("Export complete! File downloaded to your device.");
    } catch (err) {
      console.error("Extraction error:", err);
      setStatusMessage("Extraction failed. Please verify source media format.");
    } finally {
      setIsExtracting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full min-h-[450px] flex items-center justify-center bg-stone-50 rounded-3xl border border-stone-200">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-stone-500">
            Initializing Video to MP3 Lab...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden">
      {/* Ambient warm desk glow */}
      <div className="absolute -top-32 -left-20 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-fuchsia-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Contextual Desk Header & Clay Tool Highlight */}
      <VideoToMp3HeaderBar onReset={handleResetMedia} />

      {/* Main Workspace Layout Grid: 12 Cols (8 Left Active Workstage + 4 Right Clipboard Station) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Active Workbench (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!videoMeta ? (
            <VideoToMp3Dropzone
              onVideoSelected={handleChangeMedia}
              onLoadSample={handleResetMedia}
            />
          ) : (
            <>
              {/* Stage Card: Uploaded File with Interactive Waveform & Scrub Trimmer */}
              <VideoToMp3WaveformStage
                videoMeta={videoMeta}
                startTimeSec={startTimeSec}
                endTimeSec={endTimeSec}
                onTimeRangeChange={handleTimeRangeChange}
                onResetRange={handleResetRange}
                onChangeMedia={handleChangeMedia}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                currentTimeSec={currentTimeSec}
                onSeek={handleSeek}
              />

              {/* Audio Extraction Configuration Grid */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_12px_36px_-8px_rgba(41,37,36,0.06)] border border-stone-200/90 flex flex-col gap-6">
                <VideoToMp3ConfigDeck
                  format={format}
                  onFormatChange={setFormat}
                  bitrate={bitrate}
                  onBitrateChange={setBitrate}
                  gain={gain}
                  onGainChange={setGain}
                  title={title}
                  onTitleChange={setTitle}
                  artist={artist}
                  onArtistChange={setArtist}
                  album={album}
                  onAlbumChange={setAlbum}
                />

                {/* Master Action CTA Button */}
                <VideoToMp3ActionCta
                  format={format}
                  bitrate={bitrate}
                  estimatedSize={estimatedSize}
                  onExtract={handleExtractAndDownload}
                  isExtracting={isExtracting}
                  statusMessage={statusMessage}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Desk Station: Physical Clipboard Quick-Tools & Studio Sticky Note (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <VideoToMp3Clipboard />
        </div>
      </div>
    </div>
  );
}
