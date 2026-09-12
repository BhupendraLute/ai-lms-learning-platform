import React from "react";
import Link from "next/link";
import {
  Navbar,
  CourseCard,
  NextjsIcon,
  DockerIcon,
  TypeScriptIcon,
  ArrowRight,
  Star,
} from "@/components/ui";
import { HeroSearchBar } from "@/components/home/hero-search-bar";
import { getAllCourses } from "@/sanity/lib/data";
import { urlForImage } from "@/sanity/lib/image";

interface CourseDisplayItem {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  moduleCount: string;
  imageUrl?: string;
  icon?: React.ReactNode;
}

function getCourseIcon(slug: string, title: string) {
  const lower = (slug + " " + title).toLowerCase();
  if (lower.includes("nextjs") || lower.includes("next.js")) {
    return <NextjsIcon size={48} />;
  }
  if (lower.includes("docker") || lower.includes("devops") || lower.includes("kubernetes")) {
    return <DockerIcon size={48} />;
  }
  if (lower.includes("typescript") || lower.includes("type")) {
    return <TypeScriptIcon size={48} />;
  }
  return <NextjsIcon size={48} />;
}

// Fallback courses if Sanity is loading or offline
const fallbackCourses: CourseDisplayItem[] = [
  {
    slug: "nextjs-app-router-in-depth",
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    moduleCount: "12 modules",
    icon: <NextjsIcon size={48} />,
  },
  {
    slug: "devops-with-docker-and-kubernetes",
    title: "Docker Essentials",
    description: "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    moduleCount: "8 modules",
    icon: <DockerIcon size={48} />,
  },
  {
    slug: "typescript-for-application-developers",
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    moduleCount: "10 modules",
    icon: <TypeScriptIcon size={48} />,
  },
];

export default async function HomePage() {
  const sanityCourses = await getAllCourses();

  // Pick top 3 featured/popular courses from Sanity
  let displayCourses: CourseDisplayItem[] = fallbackCourses;

  if (sanityCourses && sanityCourses.length > 0) {
    // Prefer Next.js, Docker, and TypeScript courses if present, or first 3 courses
    const nextCourse = sanityCourses.find((c) =>
      c.title?.toLowerCase().includes("next") || c.slug?.current?.includes("next")
    );
    const dockerCourse = sanityCourses.find((c) =>
      c.title?.toLowerCase().includes("docker") || c.slug?.current?.includes("docker") || c.slug?.current?.includes("devops")
    );
    const tsCourse = sanityCourses.find((c) =>
      c.title?.toLowerCase().includes("typescript") || c.slug?.current?.includes("typescript")
    );

    const curated = [nextCourse, dockerCourse, tsCourse].filter(Boolean);
    const remaining = sanityCourses.filter((c) => !curated.includes(c));
    const finalCourseSelection = [...curated, ...remaining].slice(0, 3);

    displayCourses = finalCourseSelection.map((c) => {
      const slugStr = typeof c!.slug === "object" ? c!.slug.current : c!.slug;
      const imgUrl = urlForImage(c!.coverImage);
      return {
        slug: slugStr,
        title: c!.title,
        description: c!.summary,
        level: c!.level || "Intermediate",
        duration: c!.duration || "18h 24m",
        moduleCount: c!.moduleCount ? `${c!.moduleCount} modules` : "4 modules",
        imageUrl: imgUrl,
        icon: !imgUrl ? getCourseIcon(slugStr, c!.title) : undefined,
      };
    });
  }

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

          {/* Large Hero Search Input with ⌘K keyboard shortcut */}
          <HeroSearchBar />
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
            {displayCourses.map((course) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="block">
                <CourseCard
                  imageUrl={course.imageUrl}
                  icon={course.icon}
                  title={course.title}
                  description={course.description}
                  level={course.level}
                  duration={course.duration}
                  moduleCount={course.moduleCount}
                  className="h-full cursor-pointer"
                />
              </Link>
            ))}
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
