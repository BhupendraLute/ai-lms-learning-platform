import React from "react";
import Link from "next/link";
import {
  Navbar,
  Button,
  ProgressBar,
  Breadcrumbs,
  NextjsIcon,
} from "@/components/ui";

export const metadata = {
  title: "My Learning - AI-LMS",
  description: "Track your active courses and learning progress.",
};

export default function MyLearningPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col justify-between">
      <Navbar activePath="/my-learning" />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "My Learning", href: "/my-learning", active: true },
            ]}
          />
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            My Learning
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">
            Pick up where you left off across your active courses.
          </p>
        </div>

        {/* Active Enrolled Course Card */}
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <NextjsIcon size={48} />
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Next.js for Production
                </h2>
                <p className="text-xs text-[#64748B]">
                  Last active: Lesson 2.1 • 14h remaining
                </p>
              </div>
            </div>
            <Link href="/courses/nextjs-for-production">
              <Button variant="primary" size="md">
                Resume Learning
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <ProgressBar value={35} showLabel label="Course Progress" />
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B]">
        AI-LMS Platform • Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
