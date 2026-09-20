"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackResumeUsed } from "@/lib/analytics";

interface MyLearningResumeButtonProps {
  courseSlug: string;
  lessonSlug?: string;
  progressPercentage?: number;
  href: string;
}

export function MyLearningResumeButton({
  courseSlug,
  lessonSlug,
  progressPercentage = 35,
  href,
}: MyLearningResumeButtonProps) {
  const handleClick = () => {
    trackResumeUsed({
      courseSlug,
      lessonSlug,
      progressPercentage,
      source: "my_learning",
    });
  };

  return (
    <Link href={href} onClick={handleClick}>
      <Button variant="primary" size="md">
        Resume Learning
      </Button>
    </Link>
  );
}
