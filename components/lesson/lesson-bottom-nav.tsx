"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "@/components/ui/icons";
import { formatLessonDuration } from "@/lib/duration";
import posthog from "posthog-js";

interface NavLessonInfo {
  title: string;
  slug: { current: string } | string;
  duration?: string | number;
}

interface LessonBottomNavProps {
  courseSlug: string;
  currentLessonSlug: string;
  prevLesson?: NavLessonInfo;
  nextLesson?: NavLessonInfo;
}

export function LessonBottomNav({
  courseSlug,
  currentLessonSlug,
  prevLesson,
  nextLesson,
}: LessonBottomNavProps) {
  const getSlugString = (slug?: { current: string } | string) => {
    if (!slug) return "";
    return typeof slug === "object" ? slug.current : slug;
  };

  const prevSlug = getSlugString(prevLesson?.slug);
  const nextSlug = getSlugString(nextLesson?.slug);

  const prevDuration = prevLesson?.duration
    ? formatLessonDuration(prevLesson.duration)
    : "";
  const nextDuration = nextLesson?.duration
    ? formatLessonDuration(nextLesson.duration)
    : "";

  const handleNavClick = (direction: "prev" | "next", targetSlug: string) => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture("lesson_navigated", {
        from_lesson_slug: currentLessonSlug,
        to_lesson_slug: targetSlug,
        direction,
        course_slug: courseSlug,
      });
    }
  };

  return (
    <div className="border-t border-[#E2E8F0] pt-6 sm:pt-8 mt-12 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Previous Lesson */}
      {prevSlug ? (
        <div className="flex items-center gap-4">
          <Link
            href={`/courses/${courseSlug}/lessons/${prevSlug}`}
            onClick={() => handleNavClick("prev", prevSlug)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </Link>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-[#0F172A] truncate max-w-[160px]">
              {prevLesson?.title}
            </p>
            {prevDuration && (
              <p className="text-[11px] text-[#64748B]">{prevDuration}</p>
            )}
          </div>
        </div>
      ) : (
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#64748B] text-sm font-medium transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Course Overview</span>
        </Link>
      )}

      {/* Next Lesson */}
      {nextSlug ? (
        <div className="flex items-center justify-end gap-4">
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-[#0F172A] truncate max-w-[160px]">
              {nextLesson?.title}
            </p>
            {nextDuration && (
              <p className="text-[11px] text-[#64748B]">{nextDuration}</p>
            )}
          </div>
          <Link
            href={`/courses/${courseSlug}/lessons/${nextSlug}`}
            onClick={() => handleNavClick("next", nextSlug)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#EA580C] hover:bg-[#C24E2B] active:bg-[#AA3E1D] text-white text-sm font-medium transition-all shadow-xs hover:shadow cursor-pointer"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#EA580C] hover:bg-[#C24E2B] text-white text-sm font-medium transition-all shadow-xs hover:shadow cursor-pointer"
        >
          <span>Complete Course</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
