import React from "react";
import Link from "next/link";
import {
  Navbar,
  CourseCard,
  NextjsIcon,
  DockerIcon,
  TypeScriptIcon,
  Input,
  Breadcrumbs,
} from "@/components/ui";
import { getAllCourses } from "@/sanity/lib/data";
import { urlForImage } from "@/sanity/lib/image";

export const metadata = {
  title: "All Courses - AI-LMS",
  description: "Browse all intelligent video courses available on AI-LMS.",
};

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

// Fallback courses if Sanity is offline
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

function getCourseIcon(slug: string, title: string) {
  if (slug.includes("nextjs") || title.toLowerCase().includes("next")) {
    return <NextjsIcon size={48} />;
  }
  if (slug.includes("docker") || title.toLowerCase().includes("docker") || slug.includes("devops")) {
    return <DockerIcon size={48} />;
  }
  if (slug.includes("typescript") || title.toLowerCase().includes("typescript")) {
    return <TypeScriptIcon size={48} />;
  }
  return <NextjsIcon size={48} />;
}

export default async function CoursesPage() {
  const sanityCourses = await getAllCourses();

  const coursesList: CourseDisplayItem[] =
    sanityCourses && sanityCourses.length > 0
      ? sanityCourses.map((c) => {
          const imgUrl = urlForImage(c.coverImage);
          const slugStr = typeof c.slug === "object" ? c.slug.current : c.slug;
          return {
            slug: slugStr,
            title: c.title,
            description: c.summary,
            level: c.level || "Intermediate",
            duration: c.duration || "12h 30m",
            moduleCount: c.moduleCount ? `${c.moduleCount} modules` : "4 modules",
            imageUrl: imgUrl,
            icon: !imgUrl ? getCourseIcon(slugStr, c.title) : undefined,
          };
        })
      : fallbackCourses;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between">
      <Navbar activePath="/courses" />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Courses", href: "/courses", active: true },
            ]}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              All Courses
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] mt-1">
              Explore our curated library of production-grade engineering courses.
            </p>
          </div>

          <div className="w-full md:w-80">
            <Input
              placeholder="Filter courses..."
              showShortcut={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesList.map((course) => (
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
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B]">
        AI-LMS Platform • Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
