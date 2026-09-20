"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { trackSearchResultOpened } from "@/lib/analytics";
import { Play, FileText, ChevronRight, Bookmark } from "@/components/ui/icons";
import { CourseIconBadge } from "./course-icon-badge";
import type { SearchResultVideo } from "@/sanity/lib/search";

interface VideoResultCardProps {
  result: SearchResultVideo;
  query?: string;
  position?: number;
}

export function VideoResultCard({ result, query = "", position }: VideoResultCardProps) {
  const handleClick = () => {
    trackSearchResultOpened({
      query,
      resultType: "video",
      matchType: result.matchType,
      lessonSlug: result.lessonSlug,
      lessonTitle: result.lessonTitle,
      courseSlug: result.courseSlug,
      courseTitle: result.courseTitle,
      startSeconds: result.startSeconds,
      formattedTimestamp: result.formattedTimestamp,
      destinationUrl: result.watchUrl,
      position,
    });
  };

  return (
    <Link
      href={result.watchUrl}
      onClick={handleClick}
      className="group block bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-[#CBD5E1] hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Left: Video Thumbnail with Center Play & Duration Badge */}
        <div className="relative w-full sm:w-[240px] md:w-[260px] h-[150px] sm:h-[135px] rounded-xl overflow-hidden shrink-0 bg-[#0F172A] flex items-center justify-center shadow-inner">
          {result.thumbnailUrl ? (
            <Image
              src={result.thumbnailUrl}
              alt={result.lessonTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 260px"
              unoptimized={result.thumbnailUrl.includes("ytimg.com") || result.thumbnailUrl.includes("unsplash.com")}
            />
          ) : (
            // Elegant code preview fallback pattern
            <div className="w-full h-full p-3 font-mono text-[10px] text-slate-300 bg-[#0B0F17] flex flex-col justify-center leading-tight select-none">
              <div className="text-pink-400">export async function <span className="text-yellow-300">{result.lessonSlug.replace(/-/g, '_')}</span>() &#123;</div>
              <div className="pl-3 text-cyan-300">const data = await fetch(api);</div>
              <div className="pl-3 text-emerald-400">return NextResponse.json(data);</div>
              <div className="text-pink-400">&#125;</div>
            </div>
          )}

          {/* Frosted Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-11 h-11 rounded-full bg-white/95 text-[#0F172A] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play className="w-5 h-5 fill-current text-[#0F172A] ml-0.5" />
            </div>
          </div>

          {/* Bottom-right Duration / Timestamp Badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded-md shadow-sm">
            {result.formattedTimestamp !== "00:00" ? result.formattedTimestamp : result.duration}
          </div>
        </div>

        {/* Right: Metadata & Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Top row: Course Name + VIDEO Badge */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <CourseIconBadge iconType={result.courseIcon} courseTitle={result.courseTitle} size={18} />
                <span className="text-xs font-medium text-[#475569] truncate">
                  {result.courseTitle}
                </span>
              </div>
              <span className="shrink-0 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]">
                VIDEO
              </span>
            </div>

            {/* Lesson Title */}
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-snug line-clamp-1">
              {result.lessonTitle}
            </h3>

            {/* Description / Summary */}
            <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 leading-relaxed mt-1">
              {result.description}
            </p>
          </div>

          {/* Bottom Footer Row */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#F1F5F9] sm:border-0 sm:pt-0">
            {/* Module & Lesson Label */}
            <div className="flex items-center gap-2 text-xs text-[#64748B] min-w-0">
              <div className="flex items-center gap-1 shrink-0">
                <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="font-medium text-[#334155]">{result.lessonNumber}</span>
              </div>
              <span className="text-[#CBD5E1]">•</span>
              <div className="flex items-center gap-1 truncate">
                <Bookmark className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                <span className="truncate">{result.moduleTitle}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#EA580C] shrink-0 group-hover:text-[#C2410C]">
              <div className="w-4 h-4 rounded-full border border-[#EA580C] flex items-center justify-center">
                <Play className="w-2 h-2 fill-current text-[#EA580C] ml-px" />
              </div>
              <span>Watch from {result.formattedTimestamp}</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
