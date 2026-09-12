import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Navbar,
  Breadcrumbs,
  BarChart2,
  Clock,
  FileText,
  Users,
  Bookmark,
  ArrowRight,
} from "@/components/ui";
import { getCourseBySlug, getCourseSlugs } from "@/sanity/lib/data";
import { CourseHeroCover } from "@/components/course/course-hero-cover";
import { OutcomeIcon } from "@/components/course/outcome-icon";
import { CourseModulesAccordion } from "@/components/course/course-modules-accordion";
import { CourseBottomProgress } from "@/components/course/course-bottom-progress";
import { calculateCourseDuration } from "@/lib/duration";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all published courses in Sanity
export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  const staticSlugs = new Set([
    ...slugs,
    "nextjs-app-router-in-depth",
    "nextjs-for-production",
    "typescript-for-application-developers",
    "devops-with-docker-and-kubernetes",
  ]);

  return Array.from(staticSlugs).map((slug) => ({ slug }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = (await getCourseBySlug(slug)) || (slug === "nextjs-for-production" ? await getCourseBySlug("nextjs-app-router-in-depth") : null);

  if (!course) {
    return {
      title: "Course Not Found - AI-LMS",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} - AI-LMS`,
    description: course.summary || `Learn ${course.title} with intelligent video search on AI-LMS.`,
  };
}

// Helper to format student count
function formatStudentCount(count?: number): string {
  if (!count) return "2.1k students";
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}k students`;
  }
  return `${count} students`;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch course data from Sanity (with graceful alias fallback for nextjs-for-production)
  let course = await getCourseBySlug(slug);
  if (!course && slug === "nextjs-for-production") {
    course = await getCourseBySlug("nextjs-app-router-in-depth");
  }

  if (!course) {
    notFound();
  }

  const moduleCount = course.modules?.length || 0;
  const totalDuration = calculateCourseDuration(course);
  const studentCountFormatted = formatStudentCount(course.studentCount);
  const currentSlug = typeof course.slug === "object" ? course.slug.current : course.slug || slug;

  // Resolve first lesson link
  const firstLesson = course.modules?.[0]?.lessons?.[0];
  const firstLessonSlug =
    typeof firstLesson?.slug === "object"
      ? firstLesson.slug.current
      : firstLesson?.slug;
  const continueHref = firstLessonSlug
    ? `/courses/${currentSlug}/lessons/${firstLessonSlug}`
    : `/courses/${currentSlug}`;

  // Default learning outcomes fallback if none configured
  const learningOutcomes =
    course.learningOutcomes && course.learningOutcomes.length > 0
      ? course.learningOutcomes
      : [
          {
            _key: "outcome-1",
            icon: "layers",
            title: "App Router Foundations",
            description:
              "Master the App Router, layouts, loading states, and nested routing.",
          },
          {
            _key: "outcome-2",
            icon: "database",
            title: "Data Fetching & Caching",
            description:
              "Fetch data efficiently and leverage caching for better performance.",
          },
          {
            _key: "outcome-3",
            icon: "gauge",
            title: "Performance Optimization",
            description:
              "Optimize rendering, assets, and bundle size for faster apps.",
          },
          {
            _key: "outcome-4",
            icon: "cloud",
            title: "Deployment & Scaling",
            description:
              "Deploy with confidence and scale your Next.js applications.",
          },
        ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Navigation */}
      <Navbar activePath="/courses" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs
            items={[
              { label: "All Courses", href: "/courses" },
              { label: course.title, href: `/courses/${currentSlug}`, active: true },
            ]}
          />
        </div>

        {/* Hero Course Header Section */}
        <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 sm:p-8 md:p-10 shadow-sm mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 lg:gap-12 justify-between">
            {/* Left Column: Course Cover Card */}
            <div className="shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
              <CourseHeroCover
                coverImage={course.coverImage}
                title={course.title}
                slug={currentSlug}
              />
            </div>

            {/* Right Column: Title, Metadata & CTAs */}
            <div className="flex-1 min-w-0">
              {/* Popular Badge */}
              {course.popular !== false && (
                <div className="inline-flex items-center px-3 py-1 rounded-[6px] bg-[#FFEEE5] text-[#EA580C] text-[11px] font-bold tracking-wider uppercase mb-3 select-none">
                  POPULAR
                </div>
              )}

              {/* Course Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.14]">
                {course.title}
              </h1>

              {/* Course Summary */}
              <p className="text-sm sm:text-base text-[#475569] mt-3 sm:mt-4 leading-relaxed max-w-2xl">
                {course.summary}
              </p>

              {/* Course Meta Stats Row */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 my-6 text-xs sm:text-sm text-[#64748B]">
                <div className="flex items-center gap-2 font-medium">
                  <BarChart2 className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
                  <span>{course.level || "Intermediate"}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
                  <span>{totalDuration}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <FileText className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
                  <span>{moduleCount} modules</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Users className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
                  <span>{studentCountFormatted}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <Link
                  href={continueHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#D95D39] hover:bg-[#C24E2B] active:bg-[#AA3E1D] text-white text-sm md:text-base font-medium shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm md:text-base font-medium shadow-xs transition-all duration-150 cursor-pointer"
                  aria-label="Bookmark this course"
                >
                  <Bookmark className="w-4 h-4 text-[#0F172A]" strokeWidth={2} />
                  <span>Bookmark</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="font-serif text-2xl md:text-[28px] font-bold text-[#0F172A] tracking-tight mb-6 sm:mb-7">
            What you&apos;ll learn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {learningOutcomes.map((outcome, idx) => (
              <div
                key={outcome._key || `outcome-${idx}`}
                className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start gap-4 sm:gap-5 transition-all duration-200 hover:border-[#CBD5E1]"
              >
                <OutcomeIcon icon={outcome.icon} size={44} className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                    {outcome.title}
                  </h3>
                  {outcome.description && (
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                      {outcome.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course Content Section */}
        <section className="mb-12 sm:mb-16">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl md:text-[28px] font-bold text-[#0F172A] tracking-tight">
              Course Content
            </h2>
            <span className="text-xs sm:text-sm text-[#64748B] font-normal">
              {moduleCount} modules • {totalDuration}
            </span>
          </div>

          {/* Interactive Modules Accordion */}
          <CourseModulesAccordion
            modules={course.modules || []}
            courseSlug={currentSlug}
            initialExpandedIndex={0}
          />
        </section>

        {/* Floating Bottom Progress Bar */}
        <CourseBottomProgress
          percentage={35}
          continueHref={continueHref}
          className="mt-8 mb-4"
        />
      </main>

      {/* Decorative Rising Warm Gradient Horizon Skyline */}
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
