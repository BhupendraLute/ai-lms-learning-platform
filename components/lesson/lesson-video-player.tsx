"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "@/components/ui/icons";
import { imageUrl } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

interface LessonVideoPlayerProps {
  videoUrl?: string;
  poster?: SanityImage;
  title: string;
  startSeconds?: number;
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

export function LessonVideoPlayer({
  videoUrl,
  poster,
  title,
  startSeconds = 0,
}: LessonVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Derive poster image URL
  const posterUrl = poster ? imageUrl(poster) : null;

  const embedSrc = React.useMemo(() => {
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

    // Direct / Bunny embed URL
    return trimmedUrl;
  }, [videoUrl, startSeconds]);

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
            onClick={() => setIsPlaying(true)}
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
