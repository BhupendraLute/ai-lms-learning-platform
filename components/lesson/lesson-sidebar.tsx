"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronLeft,
  Play,
  CheckCircle2,
  Menu,
  X,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { getLessonsDuration, formatLessonDuration } from "@/lib/duration";
import { imageUrl } from "@/sanity/lib/image";
import type { SanityImage, Module, LessonSummary } from "@/sanity/types";

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  courseCoverImage?: SanityImage;
  modules: Module[];
  currentLessonSlug: string;
  currentModuleIndex?: number;
  progressPercentage?: number;
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  courseCoverImage,
  modules = [],
  currentLessonSlug,
  currentModuleIndex = 1,
  progressPercentage = 35,
}: LessonSidebarProps) {
  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize expanded module indices
  const [openModules, setOpenModules] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    const activeIdx = Math.max(0, currentModuleIndex - 1);
    initial.add(activeIdx);
    return initial;
  });

  const toggleModule = (index: number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const coverUrl = courseCoverImage ? imageUrl(courseCoverImage) : null;

  const totalModules = modules.length;
  const displayModuleIndex = Math.min(Math.max(1, currentModuleIndex), totalModules || 1);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Back to course link */}
      <div className="p-4 sm:p-6 pb-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#EA580C] hover:text-[#C24E2B] transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to course</span>
        </Link>
      </div>

      {/* Course Info Card with Progress */}
      <div className="px-4 sm:px-6 pb-5">
        <div className="flex items-center gap-3.5">
          {/* Course Thumbnail */}
          <div className="w-12 h-12 rounded-[12px] bg-[#0F172A] flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={courseTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                N
              </span>
            )}
          </div>

          {/* Title & Progress */}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight leading-snug truncate">
              {courseTitle}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-medium">
                {progressPercentage}% complete
              </span>
            </div>
            {/* Slim progress bar */}
            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#EA580C] rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#F1F5F9] mx-4 sm:mx-6" />

      {/* Module count header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-[#0F172A] tracking-tight">
          Module {displayModuleIndex} of {totalModules}
        </span>
        <div className="w-4 h-4 text-[#64748B]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Modules List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-6 space-y-2 divide-y divide-[#F8FAFC]">
        {modules.map((module, modIdx) => {
          const modNumber = modIdx + 1;
          const isCurrentModule = modNumber === currentModuleIndex;
          const isCompletedModule = modNumber < currentModuleIndex;
          const isOpen = openModules.has(modIdx);
          const modDuration = getLessonsDuration(module.lessons);
          const lessonsList: LessonSummary[] = module.lessons || [];

          return (
            <div key={module._key || `module-${modIdx}`} className="pt-2 first:pt-0">
              {/* Module Accordion Item Header */}
              <button
                type="button"
                onClick={() => toggleModule(modIdx)}
                className={cn(
                  "w-full px-3 py-2.5 rounded-[12px] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none",
                  isCurrentModule
                    ? "bg-[#FFF8F5]/80 hover:bg-[#FFF8F5]"
                    : "hover:bg-[#F8FAFC]"
                )}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Circle number badge */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                      isCurrentModule
                        ? "bg-[#EA580C] text-white shadow-xs"
                        : "bg-white border border-[#E2E8F0] text-[#0F172A]"
                    )}
                  >
                    {modNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        "text-xs sm:text-sm font-semibold tracking-tight truncate",
                        isCurrentModule ? "text-[#0F172A]" : "text-[#334155]"
                      )}
                    >
                      {module.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-medium mt-0.5">
                      {modDuration}
                    </p>
                  </div>
                </div>

                {/* Right side icon: Checkmark, Chevron Up, or Chevron Down */}
                <div className="shrink-0 flex items-center">
                  {isCompletedModule ? (
                    <CheckCircle2 className="w-5 h-5 text-[#EA580C]" />
                  ) : (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isCurrentModule ? "text-[#EA580C]" : "text-[#94A3B8]",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </div>
              </button>

              {/* Module Lessons Timeline List */}
              {isOpen && lessonsList.length > 0 && (
                <div className="relative pl-7 pr-2 py-2 mt-1 space-y-3">
                  {/* Vertical Timeline Track Line */}
                  <div
                    className="absolute left-[26px] top-3 bottom-3 w-[2px] bg-[#E2E8F0]"
                    aria-hidden="true"
                  />

                  {lessonsList.map((lesson, lIdx) => {
                    const lSlug =
                      typeof lesson.slug === "object"
                        ? lesson.slug?.current
                        : lesson.slug;
                    const isLessonActive = lSlug === currentLessonSlug;
                    const lessonHref = lSlug
                      ? `/courses/${courseSlug}/lessons/${lSlug}`
                      : `/courses/${courseSlug}`;
                    const formattedDur = formatLessonDuration(lesson.duration);

                    return (
                      <div
                        key={lesson._id || `lesson-${lIdx}`}
                        className="relative flex items-center justify-between gap-3 text-xs group"
                      >
                        {/* Timeline Node Icon */}
                        <div
                          className={cn(
                            "absolute -left-[19px] w-2.5 h-2.5 rounded-full z-10 transition-colors",
                            isLessonActive
                              ? "bg-[#EA580C] ring-4 ring-[#FFEEE5]"
                              : "bg-white border-2 border-[#CBD5E1] group-hover:border-[#EA580C]"
                          )}
                        />

                        {/* Lesson Link */}
                        <Link
                          href={lessonHref}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex-1 min-w-0 pl-1 py-1 block group-hover:text-[#EA580C] transition-colors"
                        >
                          <span
                            className={cn(
                              "block truncate font-medium",
                              isLessonActive
                                ? "text-[#0F172A] font-semibold"
                                : "text-[#475569] group-hover:text-[#0F172A]"
                            )}
                          >
                            {lesson.title}
                          </span>
                          {isLessonActive && (
                            <span className="block text-[11px] font-semibold text-[#EA580C] mt-0.5">
                              Now playing
                            </span>
                          )}
                        </Link>

                        {/* Right Action: Active Play Button or Duration */}
                        <div className="shrink-0 flex items-center">
                          {isLessonActive ? (
                            <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
                              <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#94A3B8] font-mono">
                              {formattedDur}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-[340px] xl:w-[380px] shrink-0 border-r border-[#E2E8F0] bg-white sticky top-0 h-screen overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Toggle Button */}
      <div className="lg:hidden p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <Menu className="w-4 h-4 text-[#0F172A]" />
            <span>Course Outline ({displayModuleIndex}/{totalModules})</span>
          </button>
        </div>
        <Link
          href={`/courses/${courseSlug}`}
          className="text-xs font-semibold text-[#EA580C] hover:underline"
        >
          Back to Course
        </Link>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="w-[85%] max-w-[340px] h-full bg-white shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center hover:bg-[#E2E8F0] cursor-pointer"
                aria-label="Close outline drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
