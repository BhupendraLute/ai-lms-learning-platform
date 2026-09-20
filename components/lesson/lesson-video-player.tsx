"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Play } from "@/components/ui/icons";
import { imageUrl } from "@/sanity/lib/image";
import { trackVideoPlayed, trackVideoWatchDepth } from "@/lib/analytics";
import type { SanityImage } from "@/sanity/types";

interface LessonVideoPlayerProps {
  courseSlug?: string;
  lessonSlug?: string;
  videoUrl?: string;
  poster?: SanityImage;
  title: string;
  startSeconds?: number;
  duration?: string | number;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

/**
 * Extracts Vimeo video ID from Vimeo URL formats
 */
function getVimeoId(url: string): string | null {
  const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Detects the video provider type from the video URL
 */
function detectProvider(url?: string): "youtube" | "vimeo" | "bunny" | "generic" {
  if (!url) return "generic";
  const trimmed = url.toLowerCase();
  if (trimmed.includes("youtu.be") || trimmed.includes("youtube.com")) return "youtube";
  if (trimmed.includes("vimeo.com")) return "vimeo";
  if (
    trimmed.includes("mediadelivery.net") ||
    trimmed.includes("bunnycdn.com") ||
    trimmed.includes("b-cdn.net")
  ) {
    return "bunny";
  }
  return "generic";
}

/**
 * Parses duration string (e.g. "12:45" or "10m") or number into total seconds.
 */
function parseDurationInSeconds(dur?: string | number): number {
  if (typeof dur === "number") return dur;
  if (!dur || typeof dur !== "string") return 600; // Default 10 minutes fallback
  const parts = dur.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const match = dur.match(/(\d+)\s*m/i);
  if (match) return parseInt(match[1], 10) * 60;
  return 600;
}

export function LessonVideoPlayer({
  courseSlug,
  lessonSlug,
  videoUrl,
  poster,
  title,
  startSeconds = 0,
  duration,
}: LessonVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const provider = useMemo(() => detectProvider(videoUrl), [videoUrl]);
  const totalDurationSeconds = useMemo(() => parseDurationInSeconds(duration), [duration]);

  const hasTrackedPlay = useRef(false);
  const milestonesFired = useRef<Set<number>>(new Set());
  const secondsWatchedRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derive poster image URL
  const posterUrl = poster ? imageUrl(poster) : null;

  const embedSrc = useMemo(() => {
    if (!videoUrl) return null;

    const trimmedUrl = videoUrl.trim();
    const ytId = getYouTubeId(trimmedUrl);
    if (ytId) {
      const startParam = startSeconds > 0 ? `&start=${Math.floor(startSeconds)}` : "";
      return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1${startParam}`;
    }

    const vimeoId = getVimeoId(trimmedUrl);
    if (vimeoId) {
      const startHash = startSeconds > 0 ? `#t=${Math.floor(startSeconds)}s` : "";
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0${startHash}`;
    }

    // Bunny Stream embed
    if (
      trimmedUrl.includes("mediadelivery.net") ||
      trimmedUrl.includes("bunnycdn.com") ||
      trimmedUrl.includes("b-cdn.net")
    ) {
      const hasQuery = trimmedUrl.includes("?");
      const sep = hasQuery ? "&" : "?";
      const startParam = startSeconds > 0 ? `${sep}t=${Math.floor(startSeconds)}` : "";
      const autoplayParam = !trimmedUrl.includes("autoplay=")
        ? `${hasQuery || startParam ? "&" : "?"}autoplay=true`
        : "";
      return `${trimmedUrl}${startParam}${autoplayParam}`;
    }

    // Direct / Generic embed URL
    if (startSeconds > 0) {
      const sep = trimmedUrl.includes("?") ? "&" : "?";
      return `${trimmedUrl}${sep}t=${Math.floor(startSeconds)}`;
    }

    return trimmedUrl;
  }, [videoUrl, startSeconds]);

  // Video playback initiation & watch depth milestone monitor
  useEffect(() => {
    const isPlaybackActive = (isPlaying || startSeconds > 0) && Boolean(embedSrc);
    if (!isPlaybackActive) return;

    // 1. Fire video_played once per session/lesson
    if (!hasTrackedPlay.current) {
      hasTrackedPlay.current = true;
      trackVideoPlayed({
        courseSlug,
        lessonSlug,
        lessonTitle: title,
        videoUrl,
        startSeconds,
        isAutoplay: startSeconds > 0 && !isPlaying,
        provider,
      });
    }

    // 2. Start watch depth tracking ticker
    const MILESTONES: (25 | 50 | 75 | 90 | 100)[] = [25, 50, 75, 90, 100];
    const TICK_INTERVAL_MS = 2000;

    intervalRef.current = setInterval(() => {
      secondsWatchedRef.current += TICK_INTERVAL_MS / 1000;
      const currentSimulatedPosition = (startSeconds || 0) + secondsWatchedRef.current;
      const currentPercentage = Math.min(
        100,
        Math.floor((currentSimulatedPosition / Math.max(totalDurationSeconds, 1)) * 100)
      );

      for (const milestone of MILESTONES) {
        if (currentPercentage >= milestone && !milestonesFired.current.has(milestone)) {
          milestonesFired.current.add(milestone);
          trackVideoWatchDepth({
            courseSlug,
            lessonSlug,
            lessonTitle: title,
            depthPercentage: milestone,
            secondsWatched: Math.round(secondsWatchedRef.current),
            videoDurationSeconds: totalDurationSeconds,
            provider,
          });
        }
      }
    }, TICK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isPlaying,
    startSeconds,
    embedSrc,
    courseSlug,
    lessonSlug,
    title,
    videoUrl,
    provider,
    totalDurationSeconds,
  ]);

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
  };

  // If autoplayed or user clicked play, show the iframe embed
  return (
    <div className="w-full rounded-[16px] overflow-hidden bg-[#0F172A] aspect-video relative shadow-md group border border-[#1E293B]">
      {embedSrc && (isPlaying || startSeconds > 0) ? (
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      ) : embedSrc ? (
        <div className="w-full h-full relative flex items-center justify-center cursor-pointer select-none">
          {/* Poster / Thumbnail backdrop */}
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              sizes="(max-width: 1280px) 100vw, 900px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center">
              {/* Decorative Brand N Logo */}
              <div className="w-32 h-32 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="font-serif text-6xl font-bold text-white tracking-tighter opacity-90">
                  N
                </span>
              </div>
            </div>
          )}

          {/* Dark Overlay gradient */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

          {/* Glowing Orange Play Button */}
          <button
            type="button"
            onClick={handlePlayButtonClick}
            className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EA580C] hover:bg-[#F97316] active:scale-95 text-white flex items-center justify-center shadow-[0_0_40px_rgba(234,88,12,0.6)] transition-all duration-200 cursor-pointer"
            aria-label={`Play video: ${title}`}
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1.5" />
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#0F172A] text-slate-300">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <Play className="w-8 h-8 text-slate-500 fill-slate-500 ml-1" />
          </div>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <p className="text-xs text-slate-500 mt-1">Video is being prepared</p>
        </div>
      )}
    </div>
  );
}
