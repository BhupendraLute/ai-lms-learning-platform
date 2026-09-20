"use client";

import React, { useState } from "react";
import { Bookmark } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { trackLessonBookmarkToggled } from "@/lib/analytics";

interface LessonBookmarkButtonProps {
  lessonSlug: string;
  lessonTitle: string;
}

export function LessonBookmarkButton({
  lessonSlug,
  lessonTitle,
}: LessonBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    trackLessonBookmarkToggled({
      lessonSlug,
      lessonTitle,
      bookmarked: nextState,
    });
  };

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={cn(
        "w-10 h-10 rounded-[12px] border flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs",
        isBookmarked
          ? "border-[#EA580C] bg-[#FFEEE5] text-[#EA580C]"
          : "border-[#E2E8F0] bg-white text-[#EA580C] hover:bg-[#FFF8F5] hover:border-[#FED7AA]"
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this lesson"}
    >
      <Bookmark
        className={cn("w-5 h-5", isBookmarked && "fill-[#EA580C]")}
        strokeWidth={2}
      />
    </button>
  );
}
