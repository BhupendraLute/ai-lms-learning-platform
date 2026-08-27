import Link from "next/link";
import { AiLmsLogo, Button, Navbar } from "@/components/ui";
import { ArrowRight, Palette } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#FFEEE5] text-[#F97316] shadow-sm mb-2">
            <AiLmsLogo size={44} />
          </div>

          <div className="space-y-4">
            <h1 className="type-display-1 text-[#0F172A]">
              AI-LMS Learning Platform
            </h1>
            <p className="type-body-large text-[#64748B] max-w-xl mx-auto">
              Intelligent video learning platform powered by Sanity and Next.js.
              Explore our design system and component architecture below.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/design-system">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Palette className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View Design System
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B]">
        AI-LMS Platform • Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
