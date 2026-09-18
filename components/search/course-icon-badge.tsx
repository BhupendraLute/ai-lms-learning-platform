"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CourseIconBadgeProps {
  iconType?: string;
  courseTitle?: string;
  className?: string;
  size?: number;
}

export function CourseIconBadge({
  iconType,
  courseTitle = "",
  className,
  size = 20,
}: CourseIconBadgeProps) {
  const type = (iconType || courseTitle).toLowerCase();

  // Next.js [N]
  if (type.includes("next") || type.includes("nextjs") || type.includes("next.js")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#0F172A] text-white font-bold select-none shadow-xs",
          className
        )}
      >
        <span style={{ fontSize: `${Math.round(size * 0.55)}px` }} className="leading-none font-sans">
          N
        </span>
      </div>
    );
  }

  // React [⚛]
  if (type.includes("react")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#E0F2FE] text-[#0284C7] select-none shadow-xs",
          className
        )}
      >
        <svg
          width={Math.round(size * 0.8)}
          height={Math.round(size * 0.8)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // Node.js [⬡]
  if (type.includes("node") || type.includes("backend") || type.includes("express")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#DCFCE7] text-[#16A34A] select-none shadow-xs",
          className
        )}
      >
        <svg
          width={Math.round(size * 0.8)}
          height={Math.round(size * 0.8)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l9 4.9v10.2L12 22l-9-4.9V6.9L12 2z" />
          <path d="M12 22V12" />
        </svg>
      </div>
    );
  }

  // JavaScript [JS]
  if (type.includes("javascript") || type.includes("js")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#FEF08A] text-[#854D0E] font-bold select-none shadow-xs",
          className
        )}
      >
        <span style={{ fontSize: `${Math.round(size * 0.5)}px` }} className="leading-none font-sans font-extrabold tracking-tight">
          JS
        </span>
      </div>
    );
  }

  // TypeScript [TS]
  if (type.includes("typescript") || type.includes("ts")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#0284C7] text-white font-bold select-none shadow-xs",
          className
        )}
      >
        <span style={{ fontSize: `${Math.round(size * 0.5)}px` }} className="leading-none font-sans font-extrabold tracking-tight">
          TS
        </span>
      </div>
    );
  }

  // Docker / DevOps
  if (type.includes("docker") || type.includes("devops") || type.includes("kubernetes")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#E0F2FE] text-[#0284C7] select-none shadow-xs",
          className
        )}
      >
        <svg
          width={Math.round(size * 0.8)}
          height={Math.round(size * 0.8)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      </div>
    );
  }

  // Python
  if (type.includes("python") || type.includes("data")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#FEF3C7] text-[#D97706] font-bold select-none shadow-xs",
          className
        )}
      >
        <span style={{ fontSize: `${Math.round(size * 0.5)}px` }} className="leading-none font-sans font-extrabold">
          PY
        </span>
      </div>
    );
  }

  // AI / LLM
  if (type.includes("ai") || type.includes("rag") || type.includes("llm")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-[5px] bg-[#F3E8FF] text-[#9333EA] select-none shadow-xs",
          className
        )}
      >
        <svg
          width={Math.round(size * 0.8)}
          height={Math.round(size * 0.8)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    );
  }

  // Default Code Icon
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "shrink-0 flex items-center justify-center rounded-[5px] bg-[#F1F5F9] text-[#475569] select-none shadow-xs",
        className
      )}
    >
      <svg
        width={Math.round(size * 0.75)}
        height={Math.round(size * 0.75)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    </div>
  );
}
