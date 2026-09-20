"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackSearchPerformed } from "@/lib/analytics";
import {
  Navbar,
  Search,
  ChevronDown,
  ArrowRight,
  BookOpen,
} from "@/components/ui";
import { VideoResultCard } from "./video-result-card";
import { LessonResultCard } from "./lesson-result-card";
import type { SearchResponse, SearchResultVideo, SearchResultLesson } from "@/sanity/lib/search";

interface SearchResultsViewProps {
  initialData: SearchResponse;
  initialQuery: string;
  initialSort?: string;
}

type UnifiedSearchResult =
  | ({ type: "video" } & SearchResultVideo)
  | ({ type: "lesson" } & SearchResultLesson);

export function SearchResultsView({
  initialData,
  initialQuery,
  initialSort = "relevance",
}: SearchResultsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Track search performed in PostHog
  useEffect(() => {
    if (initialQuery) {
      trackSearchPerformed({
        query: initialQuery,
        totalResults: initialData.stats.totalResults,
        coursesCount: initialData.stats.coursesCount,
        videoResultsCount: initialData.stats.videoResultsCount,
        lessonResultsCount: initialData.stats.lessonResultsCount,
        sort,
        source: "search_page",
      });
    }
  }, [initialQuery, initialData.stats, sort]);

  // Keyboard shortcut listener: ⌘K or Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle form submission to update URL and trigger server-side re-query
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    startTransition(() => {
      const params = new URLSearchParams();
      params.set("q", clean);
      if (sort && sort !== "relevance") {
        params.set("sort", sort);
      }
      router.push(`/search?${params.toString()}`);
    });
  };

  // Handle sort dropdown change
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    startTransition(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (newSort !== "relevance") params.set("sort", newSort);
      router.push(`/search?${params.toString()}`);
    });
  };

  // Merge and sort results for unified feed display
  const unifiedResults = React.useMemo(() => {
    const videoItems: UnifiedSearchResult[] = (initialData.videoResults || []).map((v) => ({
      ...v,
      type: "video",
    }));
    const lessonItems: UnifiedSearchResult[] = (initialData.lessonResults || []).map((l) => ({
      ...l,
      type: "lesson",
    }));

    const combined = [...videoItems, ...lessonItems];

    if (sort === "relevance") {
      combined.sort((a, b) => b.score - a.score);
    } else if (sort === "duration") {
      // Prioritize video duration
      combined.sort((a, b) => {
        const durA = "startSeconds" in a ? a.startSeconds : 0;
        const durB = "startSeconds" in b ? b.startSeconds : 0;
        return durB - durA;
      });
    }

    return combined;
  }, [initialData.videoResults, initialData.lessonResults, sort]);

  const totalCount = initialData.stats.totalResults;
  const coursesCount = initialData.stats.coursesCount;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Navbar */}
      <Navbar activePath="/courses" />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col">
        {/* Page Hero Header */}
        <div className="text-center mb-8">
          {/* SEARCH RESULTS Pill Badge */}
          <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-[8px] bg-[#FFEEE5]/90 border border-[#FED7AA] shadow-[0_1px_2px_rgba(249,115,22,0.05)] mb-4">
            <span className="text-[11px] font-bold tracking-widest text-[#EA580C] uppercase">
              SEARCH RESULTS
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A]">
            Results for{" "}
            <span className="text-[#EA580C] italic font-serif">
              &ldquo;{initialQuery || "all"}&rdquo;
            </span>
          </h1>

          {/* Result Counts Subtitle */}
          <p className="text-sm sm:text-base text-[#64748B] mt-2.5 font-medium">
            Found {totalCount} {totalCount === 1 ? "result" : "results"} across {coursesCount}{" "}
            {coursesCount === 1 ? "course" : "courses"}
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSubmit} className="w-full max-w-[680px] mx-auto mt-6">
            <div className="relative flex items-center w-full rounded-[14px] border border-[#E2E8F0] bg-white shadow-xs transition-all duration-200 hover:border-[#CBD5E1] focus-within:border-[#FB923C] focus-within:ring-2 focus-within:ring-[#FB923C]/20">
              <div className="absolute left-4 flex items-center pointer-events-none text-[#94A3B8]">
                <Search className="w-5 h-5" strokeWidth={2} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about your learning..."
                className="h-[52px] w-full rounded-[14px] bg-transparent pl-12 pr-16 text-sm sm:text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
              />
              <div className="absolute right-3.5 flex items-center pointer-events-none">
                <kbd className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-1 text-xs font-medium text-[#64748B] select-none">
                  <span className="text-xs">⌘</span> K
                </kbd>
              </div>
            </div>
          </form>
        </div>

        {/* Results Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="text-sm font-semibold text-[#0F172A]">
            {totalCount} results
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-[#E2E8F0] text-[#334155] text-xs sm:text-sm font-medium py-1.5 pl-3.5 pr-8 rounded-xl shadow-2xs hover:border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#FB923C]/20 focus:border-[#FB923C] cursor-pointer"
              >
                <option value="relevance">Most Relevant</option>
                <option value="duration">Longest Duration</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Transition Indicator */}
        {isPending && (
          <div className="w-full py-4 text-center text-xs font-medium text-[#EA580C] animate-pulse">
            Updating search results...
          </div>
        )}

        {/* Results List */}
        {totalCount > 0 ? (
          <div className="flex flex-col gap-4 sm:gap-5">
            {unifiedResults.map((item, index) => {
              if (item.type === "video") {
                return (
                  <VideoResultCard
                    key={item.id}
                    result={item}
                    query={initialQuery}
                    position={index + 1}
                  />
                );
              }
              return (
                <LessonResultCard
                  key={item.id}
                  result={item}
                  query={initialQuery}
                  position={index + 1}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 text-center my-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mx-auto mb-4 border border-[#FED7AA]">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1.5">
              No results found for &ldquo;{initialQuery}&rdquo;
            </h3>
            <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
              We couldn&apos;t find any lessons or video timestamps matching that query. Try
              adjusting your keywords or explore topics below.
            </p>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-lg mx-auto">
              {[
                "Next.js",
                "React",
                "Docker",
                "TypeScript",
                "Data Fetching",
                "State Management",
                "API Routes",
              ].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setQuery(topic);
                    router.push(`/search?q=${encodeURIComponent(topic)}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#FFF7ED] hover:text-[#EA580C] border border-[#E2E8F0] text-xs font-medium text-[#475569] transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Course Catalog</span>
            </Link>
          </div>
        )}

        {/* Bottom CTA Card: "Can't find what you're looking for?" */}
        <div className="mt-10 sm:mt-12 rounded-2xl border border-[#FED7AA] bg-[#FFFAF5] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-2xs">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F172A]">
                Can&apos;t find what you&apos;re looking for?
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Try different keywords or browse our full course catalog.
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="shrink-0 inline-flex items-center gap-2 bg-white border border-[#FED7AA] text-[#EA580C] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-[#FFF7ED] transition-all shadow-xs"
          >
            <span>Browse all courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
