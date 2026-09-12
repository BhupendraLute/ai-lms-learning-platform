"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ChevronDown } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getLessonsDuration } from "@/lib/duration";

export interface LessonItem {
  _id?: string;
  title: string;
  slug?: { current: string } | string;
  duration?: string;
  isFreePreview?: boolean;
}

export interface ModuleItem {
  _key?: string;
  title: string;
  summary?: string;
  lessons?: LessonItem[];
}

interface CourseModulesAccordionProps {
  modules: ModuleItem[];
  courseSlug: string;
  initialExpandedIndex?: number;
}

export function CourseModulesAccordion({
  modules = [],
  courseSlug,
  initialExpandedIndex = 0,
}: CourseModulesAccordionProps) {
  // Set of open module indices
  const [openModules, setOpenModules] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (initialExpandedIndex >= 0 && initialExpandedIndex < modules.length) {
      initial.add(initialExpandedIndex);
    }
    return initial;
  });

  // Limit initially displayed modules if more than 6
  const [showAll, setShowAll] = useState(false);
  const displayedModules = showAll || modules.length <= 6 ? modules : modules.slice(0, 6);

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

  if (modules.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center text-[#64748B]">
        No modules currently published for this course.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedModules.map((module, index) => {
        const isOpen = openModules.has(index);
        const moduleDuration = getLessonsDuration(module.lessons);
        const moduleNumber = index + 1;

        return (
          <div
            key={module._key || `module-${index}`}
            className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden transition-all duration-200 hover:border-[#CBD5E1]"
          >
            {/* Module Accordion Header */}
            <button
              type="button"
              onClick={() => toggleModule(index)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-[#FAFAFC] transition-colors cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                {/* Circular Number Badge */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center font-semibold text-xs sm:text-sm text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  {moduleNumber}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-[#0F172A] tracking-tight truncate">
                    {module.title}
                  </h3>
                  {module.summary && (
                    <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 line-clamp-1 sm:line-clamp-2">
                      {module.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Module Duration & Chevron */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs sm:text-sm text-[#64748B] font-medium whitespace-nowrap">
                  {moduleDuration}
                </span>
                <div
                  className={cn(
                    "w-5 h-5 flex items-center justify-center text-[#64748B] transition-transform duration-200",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}
                >
                  <ChevronDown className="w-4 h-4" strokeWidth={2.25} />
                </div>
              </div>
            </button>

            {/* Accordion Lessons List Body */}
            {isOpen && module.lessons && module.lessons.length > 0 && (
              <div className="border-t border-[#F1F5F9] bg-[#FAFAFC]/60 px-4 sm:px-6 py-3 divide-y divide-[#F1F5F9]">
                {module.lessons.map((lesson, lIdx) => {
                  const lessonSlug =
                    typeof lesson.slug === "object" ? lesson.slug?.current : lesson.slug;
                  const lessonHref = lessonSlug
                    ? `/courses/${courseSlug}/lessons/${lessonSlug}`
                    : `/courses/${courseSlug}`;

                  return (
                    <div
                      key={lesson._id || `lesson-${lIdx}`}
                      className="py-3 flex items-center justify-between gap-3 text-sm hover:bg-white/80 px-2.5 rounded-lg transition-colors group"
                    >
                      <Link
                        href={lessonHref}
                        className="flex items-center gap-3 min-w-0 flex-1 group-hover:text-[#D95D39] transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#FED7AA]">
                          <Play className="w-3 h-3 text-[#D95D39] fill-[#D95D39]" />
                        </div>
                        <span className="font-medium text-[#334155] group-hover:text-[#0F172A] transition-colors truncate">
                          {lesson.title}
                        </span>
                      </Link>

                      <div className="flex items-center gap-3 shrink-0">
                        {lesson.isFreePreview && (
                          <Badge variant="video" size="sm">
                            Free Preview
                          </Badge>
                        )}
                        {lesson.duration && (
                          <span className="text-xs text-[#64748B] font-mono whitespace-nowrap">
                            {lesson.duration}
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

      {/* Show all X modules Button */}
      {modules.length > 6 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] shadow-sm hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>
              {showAll ? "Show fewer modules" : `Show all ${modules.length} modules`}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[#64748B] transition-transform duration-200",
                showAll && "rotate-180"
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
}
