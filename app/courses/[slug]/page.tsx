import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Navbar,
  Button,
  Badge,
  NextjsIcon,
  DockerIcon,
  TypeScriptIcon,
  Breadcrumbs,
  BarChart2,
  Clock,
  FileText,
  Play,
  CheckCircle2,
} from "@/components/ui";

const courseData: Record<
  string,
  {
    title: string;
    description: string;
    level: string;
    duration: string;
    moduleCount: string;
    instructor: string;
    icon: React.ReactNode;
    outcomes: string[];
    modules: {
      title: string;
      lessons: { title: string; duration: string; preview?: boolean }[];
    }[];
  }
> = {
  "nextjs-for-production": {
    title: "Next.js for Production",
    description:
      "Build scalable, high-performance web applications with Next.js App Router, Server Components, and advanced caching.",
    level: "Intermediate",
    duration: "18h 24m",
    moduleCount: "12 modules",
    instructor: "Guillermo Rauch",
    icon: <NextjsIcon size={64} />,
    outcomes: [
      "Master Server and Client Component architecture",
      "Implement robust caching and revalidation strategies",
      "Deploy scalable web apps to production with zero downtime",
      "Optimize core web vitals and streaming SSR performance",
    ],
    modules: [
      {
        title: "Module 1: Architecture & Mental Models",
        lessons: [
          { title: "1.1 Introduction to Next.js App Router", duration: "12:30", preview: true },
          { title: "1.2 Server Components vs Client Components", duration: "18:45", preview: true },
          { title: "1.3 Rendering Lifecycles and Streaming", duration: "15:20" },
        ],
      },
      {
        title: "Module 2: Data Fetching and Caching",
        lessons: [
          { title: "2.1 Fetch API & Next.js Extended Fetch", duration: "14:10" },
          { title: "2.2 Static vs Dynamic Rendering", duration: "20:05" },
          { title: "2.3 Incremental Static Regeneration (ISR)", duration: "16:40" },
        ],
      },
    ],
  },
  "docker-essentials": {
    title: "Docker Essentials",
    description:
      "Containerize applications and streamline your development and deployment workflows using Docker & Compose.",
    level: "Beginner",
    duration: "10h 12m",
    moduleCount: "8 modules",
    instructor: "Solomon Hykes",
    icon: <DockerIcon size={64} />,
    outcomes: [
      "Understand containers, images, and the Docker daemon",
      "Write optimized multi-stage Dockerfiles",
      "Orchestrate local multi-service environments with Docker Compose",
      "Manage persistent volumes, networks, and environment secrets",
    ],
    modules: [
      {
        title: "Module 1: Getting Started with Docker",
        lessons: [
          { title: "1.1 What is Containerization?", duration: "10:15", preview: true },
          { title: "1.2 Docker CLI and Container Lifecycle", duration: "16:00", preview: true },
        ],
      },
      {
        title: "Module 2: Building Images & Dockerfile Best Practices",
        lessons: [
          { title: "2.1 Writing your first Dockerfile", duration: "14:20" },
          { title: "2.2 Multi-stage builds for lean production images", duration: "19:10" },
        ],
      },
    ],
  },
  "typescript-deep-dive": {
    title: "TypeScript Deep Dive",
    description:
      "Go beyond the basics and write safer, more expressive, and scalable type-safe code for production systems.",
    level: "Intermediate",
    duration: "14h 36m",
    moduleCount: "10 modules",
    instructor: "Anders Hejlsberg",
    icon: <TypeScriptIcon size={64} />,
    outcomes: [
      "Leverage advanced generics and conditional types",
      "Master mapped types, template literal types, and type narrowing",
      "Build reusable utility types and library-grade TypeScript definitions",
      "Prevent runtime bugs with strict compiler configurations",
    ],
    modules: [
      {
        title: "Module 1: Advanced Type System Foundations",
        lessons: [
          { title: "1.1 Type Inference & Narrowing Patterns", duration: "14:50", preview: true },
          { title: "1.2 Discriminated Unions in Practice", duration: "17:35", preview: true },
        ],
      },
      {
        title: "Module 2: Generics and Conditional Types",
        lessons: [
          { title: "2.1 Generic Constraints and Default Types", duration: "15:20" },
          { title: "2.2 Infer Keyword and Template Literal Types", duration: "22:15" },
        ],
      },
    ],
  },
};

export async function generateStaticParams() {
  return [
    { slug: "nextjs-for-production" },
    { slug: "docker-essentials" },
    { slug: "typescript-deep-dive" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = courseData[slug];

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between">
      <Navbar activePath="/courses" />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Courses", href: "/courses" },
              { label: course.title, href: `/courses/${slug}`, active: true },
            ]}
          />
        </div>

        {/* Hero Course Header */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-start sm:items-center gap-5">
              {course.icon}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="popular">POPULAR</Badge>
                  <span className="text-xs font-medium text-[#64748B]">
                    Instructor: {course.instructor}
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
                  {course.title}
                </h1>
                <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-2xl">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0">
              <Link href="/courses">
                <Button variant="primary" size="lg" className="w-full md:w-auto">
                  Start Course
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 mt-6 border-t border-[#F1F5F9] text-xs sm:text-sm text-[#64748B]">
            <div className="flex items-center gap-1.5 font-medium">
              <BarChart2 className="w-4 h-4 text-[#F97316]" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-[#F97316]" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-[#F97316]" />
              <span>{course.moduleCount}</span>
            </div>
          </div>
        </div>

        {/* Learning Outcomes & Syllabus Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Syllabus Modules */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#0F172A]">Course Modules</h2>
            <div className="space-y-4">
              {course.modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-[#0F172A] mb-3">{mod.title}</h3>
                  <div className="divide-y divide-[#F1F5F9]">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        className="py-3 flex items-center justify-between text-sm hover:bg-[#FAFAFC] px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Play className="w-4 h-4 text-[#F97316]" />
                          <span className="font-medium text-[#334155]">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {lesson.preview && <Badge variant="video">Free Preview</Badge>}
                          <span className="text-xs text-[#64748B]">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll learn */}
          <div>
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl font-bold text-[#0F172A] mb-4">
                What you will learn
              </h2>
              <ul className="space-y-3">
                {course.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#334155]">
                    <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B]">
        AI-LMS Platform • Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
