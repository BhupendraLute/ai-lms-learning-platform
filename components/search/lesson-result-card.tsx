"use client";

import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Check, ArrowUpRight, ChevronRight } from "@/components/ui/icons";
import { CourseIconBadge } from "./course-icon-badge";
import type { SearchResultLesson } from "@/sanity/lib/search";

interface LessonResultCardProps {
  result: SearchResultLesson;
  query?: string;
}

export function LessonResultCard({ result, query = "" }: LessonResultCardProps) {
  const handleClick = () => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture("search_result_clicked", {
        query,
        result_type: "lesson",
        lesson_slug: result.lessonSlug,
        course_slug: result.courseSlug,
        lesson_title: result.lessonTitle,
      });
    }
  };

  // Fallback key points if not present in content
  const keyPoints =
    result.keyPoints && result.keyPoints.length > 0
      ? result.keyPoints.slice(0, 3)
      : [
          "Core architectural concepts",
          "Best practices & patterns",
          "Hands-on implementation",
        ];

  return (
    <Link
      href={result.lessonUrl}
      onClick={handleClick}
      className="group block bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-[#CBD5E1] hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Left: Key Points Container with Dark Checkmark Badge */}
        <div className="relative w-full sm:w-[240px] md:w-[260px] h-[150px] sm:h-[135px] rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 sm:p-4 shrink-0 flex flex-col justify-between shadow-inner">
          {/* Key Points Bullet List */}
          <ul className="space-y-1.5 text-xs text-[#334155] font-medium overflow-hidden">
            {keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                <span className="text-[#94A3B8] font-bold">•</span>
                <span className="truncate">{point}</span>
              </li>
            ))}
          </ul>

          {/* Bottom-right Dark Circular Check Badge */}
          <div className="self-end flex items-center justify-center w-6 h-6 rounded-full bg-[#0F172A] text-white shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        {/* Right: Metadata & Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Top row: Course Name + LESSON Badge */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <CourseIconBadge iconType={result.courseIcon} courseTitle={result.courseTitle} size={18} />
                <span className="text-xs font-medium text-[#475569] truncate">
                  {result.courseTitle}
                </span>
              </div>
              <span className="shrink-0 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
                LESSON
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
            {/* Module label */}
            <div className="text-xs font-semibold text-[#64748B]">
              Module {result.moduleNumber}
            </div>

            {/* Action CTA */}
            <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#EA580C] shrink-0 group-hover:text-[#C2410C]">
              <span>View lesson</span>
              <ArrowUpRight className="w-4 h-4" />
              <ChevronRight className="w-3.5 h-3.5 -ml-1 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
