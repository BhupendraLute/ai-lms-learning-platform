"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  Navbar,
  CourseCard,
  NextjsIcon,
  DockerIcon,
  TypeScriptIcon,
  Search,
  ArrowRight,
  Star,
} from "@/components/ui";

export default function HomePage() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ⌘K or Ctrl+K shortcut listener to focus search input
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

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between overflow-x-hidden relative">
      {/* Top Navigation Header */}
      <Navbar activePath="/" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {/* Hero Section */}
        <section className="pt-14 pb-10 md:pt-20 md:pb-14 px-6 text-center max-w-4xl mx-auto w-full">
          {/* Intelligent Learning Pill Badge */}
          <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-[8px] bg-[#FFEEE5]/90 border border-[#FED7AA] shadow-[0_1px_2px_rgba(249,115,22,0.05)] mb-6">
            <span className="text-[11px] md:text-xs font-semibold tracking-[0.14em] text-[#F97316] uppercase">
              INTELLIGENT LEARNING
            </span>
          </div>

          {/* Main Headline in Serif (Playfair Display) */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[58px] lg:text-[64px] font-bold text-[#0F172A] leading-[1.12] tracking-tight max-w-3xl mx-auto">
            Search your learning
            <br />
            in plain English.
          </h1>

          {/* Subtitle */}
          <p className="type-body-large text-[#475569] max-w-xl mx-auto leading-relaxed mt-4 mb-8 text-sm sm:text-base md:text-[17px]">
            AI-LMS understands what you want to learn and
            <br className="hidden sm:inline" /> finds the exact lessons across
            all your courses.
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[#F97316] text-white text-sm md:text-base font-medium shadow-sm hover:bg-[#EA580C] active:bg-[#C2410C] transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Large Hero Search Input */}
          <div className="w-full max-w-[680px] mx-auto mt-8">
            <div className="relative flex items-center w-full rounded-[14px] border border-[#E2E8F0] bg-white shadow-sm transition-all duration-200 hover:border-[#CBD5E1] focus-within:border-[#FB923C] focus-within:ring-2 focus-within:ring-[#FB923C]/20">
              <div className="absolute left-4 flex items-center pointer-events-none text-[#64748B]">
                <Search className="w-5 h-5 text-[#64748B]" strokeWidth={2} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ask anything about your learning..."
                className="h-[52px] w-full rounded-[14px] bg-transparent pl-12 pr-16 text-sm md:text-[15px] text-[#0F172A] placeholder:text-[#64748B] outline-none"
              />
              <div className="absolute right-3.5 flex items-center pointer-events-none">
                <kbd className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-1 text-xs font-medium text-[#64748B] select-none">
                  <span className="text-xs">⌘</span> K
                </kbd>
              </div>
            </div>
          </div>
        </section>

        {/* All Courses Section */}
        <section className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-8 pb-10">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl md:text-[28px] font-bold text-[#0F172A] tracking-tight">
              All Courses
            </h2>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors group"
            >
              <span>View all courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 3 Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/courses/nextjs-for-production" className="block">
              <CourseCard
                icon={<NextjsIcon size={48} />}
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                moduleCount="12 modules"
                className="h-full cursor-pointer"
              />
            </Link>

            <Link href="/courses/docker-essentials" className="block">
              <CourseCard
                icon={<DockerIcon size={48} />}
                title="Docker Essentials"
                description="Containerize applications and streamline your development workflow."
                level="Beginner"
                duration="10h 12m"
                moduleCount="8 modules"
                className="h-full cursor-pointer"
              />
            </Link>

            <Link href="/courses/typescript-deep-dive" className="block">
              <CourseCard
                icon={<TypeScriptIcon size={48} />}
                title="TypeScript Deep Dive"
                description="Go beyond the basics and write safer, more expressive code."
                level="Intermediate"
                duration="14h 36m"
                moduleCount="10 modules"
                className="h-full cursor-pointer"
              />
            </Link>
          </div>

          {/* Weekly Updates Divider Notice */}
          <div className="flex items-center justify-center gap-4 mt-14 mb-4 max-w-4xl mx-auto">
            <div className="h-[1px] bg-[#E2E8F0] flex-1 max-w-[120px] sm:max-w-[180px] md:max-w-[220px]" />
            <div className="flex items-center gap-2 text-sm text-[#475569] font-normal shrink-0">
              <Star className="w-4 h-4 text-[#F97316] stroke-[1.5]" />
              <span>New courses and lessons added every week.</span>
            </div>
            <div className="h-[1px] bg-[#E2E8F0] flex-1 max-w-[120px] sm:max-w-[180px] md:max-w-[220px]" />
          </div>
        </section>
      </main>

      {/* Decorative Rising Warm Gradient Graphic Horizon */}
      <div
        className="w-full h-44 md:h-56 relative overflow-hidden pointer-events-none mt-auto flex items-end justify-center select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#FED7AA]/30 via-[#FFEEE5]/20 to-transparent z-0" />
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-2 sm:gap-4 px-6 md:px-12 items-end relative z-10 opacity-75">
          <div className="h-16 sm:h-20 bg-gradient-to-t from-[#F97316]/40 via-[#FB923C]/20 to-transparent rounded-t-sm" />
          <div className="h-24 sm:h-32 bg-gradient-to-t from-[#F97316]/50 via-[#FB923C]/25 to-transparent rounded-t-sm" />
          <div className="h-32 sm:h-44 bg-gradient-to-t from-[#F97316]/60 via-[#FB923C]/30 to-transparent rounded-t-sm" />
          <div className="h-36 sm:h-52 bg-gradient-to-t from-[#F97316]/65 via-[#FB923C]/35 to-transparent rounded-t-sm" />
          <div className="h-16 sm:h-24 bg-gradient-to-t from-[#F97316]/35 via-[#FB923C]/15 to-transparent rounded-t-sm" />
          <div className="h-12 sm:h-16 bg-gradient-to-t from-[#F97316]/25 via-[#FB923C]/10 to-transparent rounded-t-sm" />
          <div className="h-20 sm:h-28 bg-gradient-to-t from-[#F97316]/45 via-[#FB923C]/20 to-transparent rounded-t-sm" />
          <div className="h-28 sm:h-40 bg-gradient-to-t from-[#F97316]/55 via-[#FB923C]/25 to-transparent rounded-t-sm" />
          <div className="h-36 sm:h-52 bg-gradient-to-t from-[#F97316]/65 via-[#FB923C]/35 to-transparent rounded-t-sm" />
          <div className="h-40 sm:h-56 bg-gradient-to-t from-[#F97316]/70 via-[#FB923C]/40 to-transparent rounded-t-sm" />
          <div className="h-32 sm:h-44 bg-gradient-to-t from-[#F97316]/60 via-[#FB923C]/30 to-transparent rounded-t-sm" />
          <div className="h-24 sm:h-32 bg-gradient-to-t from-[#F97316]/45 via-[#FB923C]/20 to-transparent rounded-t-sm" />
        </div>
      </div>
    </div>
  );
}
