"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

interface CourseBottomProgressProps {
  percentage?: number;
  continueHref?: string;
  className?: string;
}

export function CourseBottomProgress({
  percentage = 35,
  continueHref = "#",
  className = "",
}: CourseBottomProgressProps) {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  return (
    <div
      className={`w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 my-6 ${className}`}
    >
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
        {/* Left Progress Info */}
        <div className="flex flex-col shrink-0 min-w-[120px] text-left w-full sm:w-auto">
          <span className="text-xs text-[#64748B] font-medium">Your Progress</span>
          <span className="text-sm text-[#334155]">
            <strong className="font-semibold text-[#0F172A]">{clamped}%</strong> complete
          </span>
        </div>

        {/* Center Progress Bar */}
        <div className="w-full flex-1">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full bg-[#D95D39] transition-all duration-500 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-[12px] bg-[#D95D39] hover:bg-[#C24E2B] active:bg-[#AA3E1D] text-white text-sm md:text-base font-medium shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
