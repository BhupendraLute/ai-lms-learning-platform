"use client";

import { useEffect } from "react";
import { trackCourseViewed } from "@/lib/analytics";

interface CourseViewTrackerProps {
  courseSlug: string;
  courseTitle: string;
  level?: string;
  moduleCount?: number;
  duration?: string;
  studentCount?: number;
}

export function CourseViewTracker({
  courseSlug,
  courseTitle,
  level,
  moduleCount,
  duration,
  studentCount,
}: CourseViewTrackerProps) {
  useEffect(() => {
    trackCourseViewed({
      courseSlug,
      courseTitle,
      level,
      moduleCount,
      duration,
      studentCount,
    });
  }, [courseSlug, courseTitle, level, moduleCount, duration, studentCount]);

  return null;
}
