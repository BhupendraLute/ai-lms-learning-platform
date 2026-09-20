"use client";

import { useEffect } from "react";
import { trackLessonViewed } from "@/lib/analytics";

interface LessonViewTrackerProps {
  courseSlug?: string;
  lessonSlug: string;
  lessonTitle: string;
  moduleIndex?: number;
  lessonIndex?: number;
  startSeconds?: number;
}

export function LessonViewTracker({
  courseSlug,
  lessonSlug,
  lessonTitle,
  moduleIndex,
  lessonIndex,
  startSeconds,
}: LessonViewTrackerProps) {
  useEffect(() => {
    trackLessonViewed({
      courseSlug,
      lessonSlug,
      lessonTitle,
      moduleIndex,
      lessonIndex,
      startSeconds,
    });
  }, [courseSlug, lessonSlug, lessonTitle, moduleIndex, lessonIndex, startSeconds]);

  return null;
}
