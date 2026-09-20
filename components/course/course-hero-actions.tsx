"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bookmark } from "@/components/ui/icons";
import { trackResumeUsed } from "@/lib/analytics";

interface CourseHeroActionsProps {
  courseSlug: string;
  continueHref: string;
}

export function CourseHeroActions({
  courseSlug,
  continueHref,
}: CourseHeroActionsProps) {
  const handleContinueClick = () => {
    trackResumeUsed({
      courseSlug,
      progressPercentage: 35,
      source: "course_hero",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
      <Link
        href={continueHref}
        onClick={handleContinueClick}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#D95D39] hover:bg-[#C24E2B] active:bg-[#AA3E1D] text-white text-sm md:text-base font-medium shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
      >
        <span>Continue Learning</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm md:text-base font-medium shadow-xs transition-all duration-150 cursor-pointer"
        aria-label="Bookmark this course"
      >
        <Bookmark className="w-4 h-4 text-[#0F172A]" strokeWidth={2} />
        <span>Bookmark</span>
      </button>
    </div>
  );
}
