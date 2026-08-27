import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "video" | "lesson" | "popular" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "video",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold uppercase tracking-wider select-none";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] rounded-[4px]",
    md: "px-2.5 py-1 text-[11px] rounded-[6px]",
  };

  const variantStyles = {
    video: "bg-[#FFEEE5] text-[#F97316]",
    lesson: "bg-[#EEF2FF] text-[#4F46E5]",
    popular: "bg-[#FFEEE5] text-[#EA580C]",
    neutral: "bg-[#F1F5F9] text-[#64748B]",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
