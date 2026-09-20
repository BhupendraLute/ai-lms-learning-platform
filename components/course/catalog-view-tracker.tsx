"use client";

import { useEffect } from "react";
import { trackCatalogViewed } from "@/lib/analytics";

interface CatalogViewTrackerProps {
  totalCourses?: number;
}

export function CatalogViewTracker({ totalCourses }: CatalogViewTrackerProps) {
  useEffect(() => {
    trackCatalogViewed({ totalCourses });
  }, [totalCourses]);

  return null;
}
