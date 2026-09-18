"use client";

import React, { useState, useSyncExternalStore } from "react";
import { CheckCircle2, Lightbulb } from "@/components/ui/icons";
import { LessonNotesPortableText } from "./lesson-notes-portable-text";
import { LessonResources } from "./lesson-resources";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";
import type { PortableTextBlock } from "@portabletext/react";
import type { Resource } from "@/sanity/types";

function readStoredNote(lessonSlug: string): string {
  try {
    return localStorage.getItem(`ai_lms_note_${lessonSlug}`) || "";
  } catch {
    return "";
  }
}

interface LessonTabsProps {
  lessonSlug: string;
  notesBlocks?: PortableTextBlock[];
  keyPoints?: string[];
  proTip?: string;
  resources?: Resource[];
  summaryFallback?: string;
}

export function LessonTabs({
  lessonSlug,
  notesBlocks,
  keyPoints = [],
  proTip,
  resources = [],
  summaryFallback,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");
  // The first client render must match the server HTML (an empty note), so we
  // only read localStorage once hydrated. `draft` holds the learner's edits and
  // takes over from the stored value as soon as they type.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [draft, setDraft] = useState<string | null>(null);
  const userNote = draft ?? (hydrated ? readStoredNote(lessonSlug) : "");
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDraft(val);
    try {
      localStorage.setItem(`ai_lms_note_${lessonSlug}`, val);
      setSavedStatus("Saved locally");
      setTimeout(() => setSavedStatus(null), 2000);
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleTabChange = (tab: "content" | "notes") => {
    setActiveTab(tab);
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture("lesson_tab_changed", {
        lesson_slug: lessonSlug,
        tab,
      });
    }
  };

  return (
    <div className="mt-8">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-8 border-b border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => handleTabChange("content")}
          className={cn(
            "pb-3.5 text-sm sm:text-base font-semibold transition-all relative cursor-pointer",
            activeTab === "content"
              ? "text-[#EA580C]"
              : "text-[#64748B] hover:text-[#0F172A]"
          )}
        >
          Lesson Content
          {activeTab === "content" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA580C] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("notes")}
          className={cn(
            "pb-3.5 text-sm sm:text-base font-semibold transition-all relative cursor-pointer",
            activeTab === "notes"
              ? "text-[#EA580C]"
              : "text-[#64748B] hover:text-[#0F172A]"
          )}
        >
          Notes
          {activeTab === "notes" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA580C] rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Lesson Content */}
      {activeTab === "content" && (
        <div className="pt-6 space-y-8">
          {/* Overview */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0F172A] tracking-tight mb-3">
              Overview
            </h3>
            {notesBlocks && notesBlocks.length > 0 ? (
              <LessonNotesPortableText blocks={notesBlocks} />
            ) : summaryFallback ? (
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                {summaryFallback}
              </p>
            ) : (
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                In this lesson, you will master essential patterns and core concepts to build fast and scalable applications.
              </p>
            )}
          </div>

          {/* In This Lesson You Will (Key Points) */}
          {keyPoints && keyPoints.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-3.5">
                In this lesson you will:
              </h3>
              <ul className="space-y-3">
                {keyPoints.map((point, idx) => (
                  <li
                    key={`point-${idx}`}
                    className="flex items-start gap-3 text-sm sm:text-base text-[#334155]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pro Tip Callout */}
          {proTip && (
            <div className="rounded-[16px] bg-[#FFF8F5] border border-[#FED7AA] p-5 sm:p-6 flex items-start gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="w-9 h-9 rounded-full bg-[#FFEEE5] flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5 text-[#EA580C]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-[#0F172A] text-sm sm:text-base">
                  Pro Tip
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                  {proTip}
                </p>
              </div>
            </div>
          )}

          {/* Resources */}
          <LessonResources resources={resources} />
        </div>
      )}

      {/* Tab 2: Notes Workspace */}
      {activeTab === "notes" && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#0F172A] tracking-tight">
              Personal Notes
            </h3>
            {savedStatus && (
              <span className="text-xs text-[#16A34A] font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {savedStatus}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Capture takeaways, code snippets, and timestamps for this lesson. Notes are saved to your browser.
          </p>
          <textarea
            value={userNote}
            onChange={handleNoteChange}
            placeholder="Type your notes here... (e.g., Key takeaway: always revalidate by tag after mutations)"
            rows={8}
            className="w-full rounded-[12px] border border-[#E2E8F0] p-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent bg-white shadow-xs font-sans leading-relaxed resize-y"
          />
        </div>
      )}
    </div>
  );
}
