"use client";

import { useEffect } from "react";
import { trackCatalogViewed } from "@/lib/analytics";

interface CatalogViewTrackerProps {
  totalCoursesCount?: number;
}

export function CatalogViewTracker({ totalCoursesCount }: CatalogViewTrackerProps) {
  useEffect(() => {
    trackCatalogViewed({ totalCoursesCount });
  }, [totalCoursesCount]);

  return null;
}
