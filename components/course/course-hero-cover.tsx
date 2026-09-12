import React from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

interface CourseHeroCoverProps {
  coverImage?: SanityImage;
  title: string;
  slug: string;
}

export function CourseHeroCover({ coverImage, title, slug }: CourseHeroCoverProps) {
  const imageUrl = urlForImage(coverImage);

  // If a cover image exists in Sanity, display it
  if (imageUrl) {
    return (
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-[22px] overflow-hidden border border-[#E2E8F0] shadow-md bg-[#0F172A] shrink-0">
        <Image
          src={imageUrl}
          alt={coverImage?.alt || title}
          fill
          priority
          sizes="(max-width: 768px) 280px, 320px"
          className="object-cover"
        />
      </div>
    );
  }

  const isNextjs = slug.includes("nextjs") || title.toLowerCase().includes("next.js");
  const isDocker = slug.includes("docker") || slug.includes("devops");
  const isTypeScript = slug.includes("typescript");

  // Next.js Fallback Card
  if (isNextjs) {
    return (
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-[22px] bg-[#050505] border border-[#1E293B] shadow-md flex items-center justify-center shrink-0 overflow-hidden select-none group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <svg
          width="170"
          height="170"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02]"
        >
          <defs>
            <linearGradient id="n-diagonal-sheen" x1="50" y1="40" x2="140" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="75%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="n-vertical-left" x1="45" y1="35" x2="45" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="n-vertical-right" x1="135" y1="35" x2="135" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <path d="M40 38H60V142H40V38Z" fill="url(#n-vertical-left)" />
          <path d="M56 38H72L138 136V142H122L56 44V38Z" fill="url(#n-diagonal-sheen)" />
          <path d="M120 38H140V142H120V38Z" fill="url(#n-vertical-right)" />
        </svg>
      </div>
    );
  }

  // Docker Fallback Card
  if (isDocker) {
    return (
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-[22px] bg-[#0C1527] border border-[#1E293B] shadow-md flex items-center justify-center shrink-0 overflow-hidden select-none">
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="18" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
          <rect x="25" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
          <rect x="32" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
          <rect x="25" y="18" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
          <rect x="32" y="18" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
          <rect x="39" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
          <path
            d="M58 35C56 31 52 30 48 30C46 30 44.5 30.5 43 31.5C40 31.5 38 31 36 31H12C8 31 6 34 6 37C6 44 12 49 24 49C36 49 48 46 54 39C56 39 58 37 58 35Z"
            fill="#0EA5E9"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M54 33C57 30 59 26 56 24C53 22 51 27 49 29"
            fill="#0EA5E9"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="38" r="1.5" fill="#0F172A" />
        </svg>
      </div>
    );
  }

  // TypeScript Fallback Card
  if (isTypeScript) {
    return (
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-[22px] bg-[#004A87] border border-[#0284C7]/30 shadow-md flex items-center justify-center shrink-0 overflow-hidden select-none">
        <span className="text-white font-sans font-bold text-7xl tracking-tighter">TS</span>
      </div>
    );
  }

  // Generic fallback cover
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-[22px] bg-[#0F172A] border border-[#1E293B] shadow-md flex items-center justify-center shrink-0 overflow-hidden select-none p-6 text-center">
      <span className="text-white font-serif font-bold text-3xl line-clamp-2">
        {title}
      </span>
    </div>
  );
}
