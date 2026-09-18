import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Navbar,
  Breadcrumbs,
  Clock,
  BarChart2,
  Users,
} from "@/components/ui";
import {
  LessonSidebar,
  LessonVideoPlayer,
  LessonTabs,
  LessonBottomNav,
  LessonBookmarkButton,
} from "@/components/lesson";
import { getLessonBySlug, getCourseBySlug, getAllCourses } from "@/sanity/lib/data";
import { formatLessonDuration } from "@/lib/duration";

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
  searchParams: Promise<{
    t?: string;
    start?: string;
  }>;
}

// Format student count (e.g. 3,426 students or 12.5k students)
function formatStudentCount(count?: number): string {
  if (!count) return "3,426 students";
  if (count >= 10000) {
    const formatted = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}k students`;
  }
  return `${count.toLocaleString("en-US")} students`;
}

// Generate static params for all published courses and lessons
export async function generateStaticParams() {
  const courses = await getAllCourses();
  const staticParams: Array<{ slug: string; lessonSlug: string }> = [];

  for (const course of courses) {
    const courseSlug = course.slug?.current;
    if (!courseSlug) continue;

    const fullCourse = await getCourseBySlug(courseSlug);
    if (fullCourse?.modules) {
      for (const mod of fullCourse.modules) {
        if (mod.lessons) {
          for (const les of mod.lessons) {
            const lesSlug =
              typeof les.slug === "object" ? les.slug.current : les.slug;
            if (lesSlug) {
              staticParams.push({
                slug: courseSlug,
                lessonSlug: lesSlug,
              });
            }
          }
        }
      }
    }
  }

  // Ensure design reference slug combinations exist
  staticParams.push(
    {
      slug: "nextjs-app-router-in-depth",
      lessonSlug: "nextjs-app-router-in-depth-fetching-in-server-components",
    },
    {
      slug: "nextjs-app-router-in-depth",
      lessonSlug: "nextjs-app-router-in-depth-caching-and-revalidation",
    },
    {
      slug: "nextjs-for-production",
      lessonSlug: "nextjs-app-router-in-depth-fetching-in-server-components",
    }
  );

  return staticParams;
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;

  let lesson = await getLessonBySlug(lessonSlug);
  if (!lesson && slug === "nextjs-for-production") {
    lesson = await getLessonBySlug("nextjs-app-router-in-depth-fetching-in-server-components");
  }

  if (!lesson) {
    return {
      title: "Lesson Not Found - AI-LMS",
      description: "The requested lesson could not be found.",
    };
  }

  const courseTitle = lesson.course?.title || "Course";
  return {
    title: `${lesson.title} - ${courseTitle} | AI-LMS`,
    description: `Watch and learn ${lesson.title} in ${courseTitle} on AI-LMS.`,
  };
}

export default async function LessonDetailPage({
  params,
  searchParams,
}: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const { t, start } = await searchParams;
  const startSeconds = parseFloat(start || t || "0") || 0;

  // Fetch lesson data from Sanity
  let lesson = await getLessonBySlug(lessonSlug);

  // Handle alias fallback for nextjs-for-production preview
  if (!lesson && (slug === "nextjs-for-production" || slug === "nextjs-app-router-in-depth")) {
    lesson = await getLessonBySlug("nextjs-app-router-in-depth-fetching-in-server-components");
  }

  if (!lesson) {
    notFound();
  }

  // Resolve parent course
  let course = lesson.course;
  if (!course) {
    const fetchedCourse = await getCourseBySlug(slug);
    if (fetchedCourse) {
      course = {
        _id: fetchedCourse._id,
        title: fetchedCourse.title,
        slug: fetchedCourse.slug,
        coverImage: fetchedCourse.coverImage,
        level: fetchedCourse.level,
        studentCount: fetchedCourse.studentCount,
        instructor: fetchedCourse.instructor,
        modules: fetchedCourse.modules || [],
      };
    }
  }

  const courseSlug =
    typeof course?.slug === "object" ? course?.slug.current : course?.slug || slug;
  const courseTitle = course?.title || "Next.js for Production";
  const moduleIndex = lesson.moduleIndex || 5;
  const lessonIndex = lesson.lessonIndex || 1;
  const moduleTitle = lesson.moduleTitle || "Data Fetching & Caching";

  const lessonDuration = formatLessonDuration(lesson.duration);
  const studentCountFormatted = formatStudentCount(
    lesson.studentCount || course?.studentCount
  );
  const courseLevel = course?.level || "Intermediate";

  // Fallback summary if notes empty
  const defaultSummary =
    "Learn how Next.js handles data fetching and caching in both Server and Client Components.";

  // Fallback key points if not configured
  const keyPoints =
    lesson.keyPoints && lesson.keyPoints.length > 0
      ? lesson.keyPoints
      : [
          "Understand the different data fetching methods in Next.js",
          "Learn how caching works in Server Components",
          "Implement revalidation and cache control",
          "Optimize performance with advanced caching strategies",
        ];

  // Fallback pro tip
  const proTip =
    lesson.proTip ||
    "Use caching and revalidation wisely to ensure your app stays fast and data remains fresh without unnecessary requests.";

  // Fallback resources
  const resources =
    lesson.resources && lesson.resources.length > 0
      ? lesson.resources
      : [
          {
            _key: "res-1",
            type: "docs",
            title: "Next.js Data Fetching Documentation",
            description: "Official Next.js docs on data fetching methods.",
            url: "https://nextjs.org/docs/app/building-your-application/data-fetching",
          },
          {
            _key: "res-2",
            type: "docs",
            title: "Caching and Revalidation Guide",
            description: "Deep dive into Next.js caching strategies.",
            url: "https://nextjs.org/docs/app/building-your-application/caching",
          },
          {
            _key: "res-3",
            type: "github",
            title: "Example Repository",
            description: "Explore the source code for this lesson.",
            url: "https://github.com/vercel/next.js",
          },
        ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between">
      {/* Top Header Navigation */}
      <Navbar activePath="/courses" />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        {/* Left Lesson Sidebar */}
        <LessonSidebar
          courseTitle={courseTitle}
          courseSlug={courseSlug}
          courseCoverImage={course?.coverImage}
          modules={course?.modules || []}
          currentLessonSlug={lessonSlug}
          currentModuleIndex={moduleIndex}
          progressPercentage={35}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "All Courses", href: "/courses" },
                { label: courseTitle, href: `/courses/${courseSlug}` },
                { label: moduleTitle },
                { label: lesson.title, active: true },
              ]}
            />
          </div>

          {/* Lesson Number Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[#FFEEE5] text-[#EA580C] text-[11px] font-bold tracking-wider uppercase select-none">
              LESSON {moduleIndex}.{lessonIndex}
            </span>
          </div>

          {/* Lesson Title & Bookmark Row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-bold text-[#0F172A] tracking-tight leading-[1.14]">
              {lesson.title}
            </h1>
            <LessonBookmarkButton
              lessonSlug={lessonSlug}
              lessonTitle={lesson.title}
            />
          </div>

          {/* Lesson Subtitle / Summary */}
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-3xl mb-4">
            {defaultSummary}
          </p>

          {/* Meta Stats Row */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs sm:text-sm text-[#64748B] mb-6">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
              <span>{lessonDuration}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <BarChart2 className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
              <span>{courseLevel}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Users className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
              <span>{studentCountFormatted}</span>
            </div>
          </div>

          {/* Video Player Embed */}
          <section aria-label="Lesson Video Player" className="mb-8">
            <LessonVideoPlayer
              videoUrl={lesson.videoUrl}
              poster={lesson.poster}
              title={lesson.title}
              startSeconds={startSeconds}
            />
          </section>

          {/* Tabs Section (Lesson Content & Notes) */}
          <LessonTabs
            lessonSlug={lessonSlug}
            notesBlocks={lesson.notes}
            keyPoints={keyPoints}
            proTip={proTip}
            resources={resources}
            summaryFallback={defaultSummary}
          />

          {/* Bottom Previous / Next Lesson Navigation */}
          <LessonBottomNav
            courseSlug={courseSlug}
            currentLessonSlug={lessonSlug}
            prevLesson={lesson.prevLesson}
            nextLesson={lesson.nextLesson}
          />
        </main>
      </div>
    </div>
  );
}
