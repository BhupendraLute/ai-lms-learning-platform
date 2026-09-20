"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

const MILESTONES: (25 | 50 | 75 | 90 | 100)[] = [25, 50, 75, 90, 100];

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
  const fallbackDurationSeconds = useMemo(() => parseDurationInSeconds(duration), [duration]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hasTrackedPlay = useRef(false);
  const isPlaybackActive = useRef(false);
  const milestonesFired = useRef<Set<number>>(new Set());
  const reportedDurationRef = useRef<number>(fallbackDurationSeconds);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Helper to trigger video_played event
  const triggerVideoPlayed = useCallback(() => {
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
  }, [courseSlug, lessonSlug, title, videoUrl, startSeconds, isPlaying, provider]);

  // Helper to check milestone percentages against reported playback time and duration
  const checkMilestones = useCallback(
    (currentTime: number, videoDuration?: number) => {
      const totalDur = videoDuration && videoDuration > 0
        ? videoDuration
        : reportedDurationRef.current;

      if (totalDur <= 0 || currentTime <= 0) return;

      const percentage = Math.min(100, Math.floor((currentTime / totalDur) * 100));

      for (const milestone of MILESTONES) {
        if (percentage >= milestone && !milestonesFired.current.has(milestone)) {
          milestonesFired.current.add(milestone);
          trackVideoWatchDepth({
            courseSlug,
            lessonSlug,
            lessonTitle: title,
            depthPercentage: milestone,
            secondsWatched: Math.round(currentTime),
            videoDurationSeconds: Math.round(totalDur),
            provider,
          });
        }
      }
    },
    [courseSlug, lessonSlug, title, provider]
  );

  // Send handshake message to player iframe
  const initIframeHandshake = useCallback(() => {
    const target = iframeRef.current?.contentWindow;
    if (!target) return;

    try {
      if (provider === "youtube") {
        target.postMessage(JSON.stringify({ event: "listening" }), "*");
        target.postMessage(
          JSON.stringify({
            event: "command",
            func: "addEventListener",
            args: ["onStateChange"],
          }),
          "*"
        );
      } else if (provider === "vimeo") {
        target.postMessage(JSON.stringify({ method: "addEventListener", value: "play" }), "*");
        target.postMessage(JSON.stringify({ method: "addEventListener", value: "pause" }), "*");
        target.postMessage(JSON.stringify({ method: "addEventListener", value: "timeupdate" }), "*");
        target.postMessage(JSON.stringify({ method: "addEventListener", value: "ended" }), "*");
      } else if (provider === "bunny") {
        target.postMessage(JSON.stringify({ action: "play" }), "*");
      }
    } catch {
      // Ignore cross-origin postMessage dispatch errors
    }
  }, [provider]);

  // Handle provider message events
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (!event.data) return;

      let payload = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      if (typeof payload !== "object" || payload === null) return;

      // 1. YouTube Player Messages
      if (provider === "youtube") {
        // YouTube onStateChange: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
        if (payload.event === "onStateChange") {
          if (payload.data === 1) {
            isPlaybackActive.current = true;
            triggerVideoPlayed();
          } else if (payload.data === 2 || payload.data === 0) {
            isPlaybackActive.current = false;
          }
        }

        // YouTube infoDelivery: contains currentTime, duration, playerState
        if (payload.event === "infoDelivery" && payload.info) {
          const { currentTime, duration: ytDuration, playerState } = payload.info;

          if (playerState === 1) {
            isPlaybackActive.current = true;
            triggerVideoPlayed();
          } else if (playerState === 2 || playerState === 0) {
            isPlaybackActive.current = false;
          }

          if (typeof ytDuration === "number" && ytDuration > 0) {
            reportedDurationRef.current = ytDuration;
          }

          if (typeof currentTime === "number") {
            checkMilestones(currentTime, reportedDurationRef.current);
          }
        }
      }

      // 2. Vimeo Player Messages
      if (provider === "vimeo") {
        if (payload.event === "play") {
          isPlaybackActive.current = true;
          triggerVideoPlayed();
        } else if (payload.event === "pause" || payload.event === "ended") {
          isPlaybackActive.current = false;
        } else if (payload.event === "timeupdate" && payload.data) {
          isPlaybackActive.current = true;
          triggerVideoPlayed();

          const { seconds, duration: vimeoDuration } = payload.data;
          if (typeof vimeoDuration === "number" && vimeoDuration > 0) {
            reportedDurationRef.current = vimeoDuration;
          }
          if (typeof seconds === "number") {
            checkMilestones(seconds, reportedDurationRef.current);
          }
        }
      }

      // 3. Bunny / Generic Player Messages
      if (provider === "bunny" || provider === "generic") {
        const evt = payload.event || payload.type;
        if (evt === "play" || evt === "playing") {
          isPlaybackActive.current = true;
          triggerVideoPlayed();
        } else if (evt === "pause" || evt === "ended") {
          isPlaybackActive.current = false;
        } else if (evt === "timeupdate" || typeof payload.currentTime === "number") {
          isPlaybackActive.current = true;
          triggerVideoPlayed();

          const time = payload.currentTime ?? payload.seconds;
          const dur = payload.duration ?? reportedDurationRef.current;
          if (typeof dur === "number" && dur > 0) {
            reportedDurationRef.current = dur;
          }
          if (typeof time === "number") {
            checkMilestones(time, reportedDurationRef.current);
          }
        }
      }
    };

    window.addEventListener("message", handleWindowMessage);
    return () => {
      window.removeEventListener("message", handleWindowMessage);
    };
  }, [provider, triggerVideoPlayed, checkMilestones]);

  // Periodic polling for providers requiring command polls while active
  useEffect(() => {
    const isVisible = isPlaying || startSeconds > 0;
    if (!isVisible) return;

    triggerVideoPlayed();

    pollingIntervalRef.current = setInterval(() => {
      const target = iframeRef.current?.contentWindow;
      if (!target) return;

      try {
        if (provider === "youtube") {
          target.postMessage(
            JSON.stringify({ event: "command", func: "getCurrentTime" }),
            "*"
          );
        } else if (provider === "vimeo") {
          target.postMessage(JSON.stringify({ method: "getCurrentTime" }), "*");
        }
      } catch {
        // Ignore cross-origin postMessage errors
      }
    }, 2500);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isPlaying, startSeconds, provider, triggerVideoPlayed]);

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
    triggerVideoPlayed();
  };

  // If autoplayed or user clicked play, show the iframe embed
  return (
    <div className="w-full rounded-[16px] overflow-hidden bg-[#0F172A] aspect-video relative shadow-md group border border-[#1E293B]">
      {embedSrc && (isPlaying || startSeconds > 0) ? (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={initIframeHandshake}
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
