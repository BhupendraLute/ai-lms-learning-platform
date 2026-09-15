import { notFound, redirect } from "next/navigation";
import { getLessonBySlug, getLessonSlugs } from "@/sanity/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function DirectLessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const courseSlug =
    typeof lesson.course?.slug === "object"
      ? lesson.course.slug.current
      : lesson.course?.slug || "nextjs-app-router-in-depth";

  redirect(`/courses/${courseSlug}/lessons/${slug}`);
}
