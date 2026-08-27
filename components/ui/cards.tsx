import React from "react";
import { BarChart2, Clock, Play, ExternalLink, FileText } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

// 1. Course Card
export interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  iconText?: string;
  title: string;
  description: string;
  level?: string;
  duration?: string;
  moduleCount?: number | string;
  onClick?: () => void;
}

export function CourseCard({
  iconText = "N",
  icon,
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  moduleCount = "12 modules",
  className,
  ...props
}: CourseCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]",
        className
      )}
      {...props}
    >
      <div>
        <div className="mb-5">
          {icon ? (
            icon
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#0F172A] text-white font-bold text-xl shadow-sm">
              {iconText}
            </div>
          )}
        </div>
        <h3 className="type-heading-2 text-[#0F172A] font-bold group-hover:text-[#F97316] transition-colors mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="type-body text-[#64748B] mb-6 line-clamp-2 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-5 pt-4 border-t border-[#F1F5F9] text-xs text-[#64748B]">
        {level && (
          <div className="flex items-center gap-1.5 font-medium">
            <BarChart2 className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={2} />
            <span>{level}</span>
          </div>
        )}
        {duration && (
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={2} />
            <span>{duration}</span>
          </div>
        )}
        {moduleCount && (
          <div className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={2} />
            <span>{typeof moduleCount === "number" ? `${moduleCount} modules` : moduleCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Video Lesson Card
export interface VideoLessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  lessonNumber?: string;
  duration?: string;
  startSecondsFormatted?: string;
  onWatch?: () => void;
}

export function VideoLessonCard({
  title = "Data Fetching in Server Components",
  description = "Learn how to fetch data on the server using async/await and Next.js best practices.",
  lessonNumber = "Lesson 5.1",
  duration = "12:45",
  startSecondsFormatted = "12:45",
  onWatch,
  className,
  ...props
}: VideoLessonCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]",
        className
      )}
      {...props}
    >
      <div>
        <div className="mb-3">
          <Badge variant="video">VIDEO</Badge>
        </div>
        <h3 className="type-heading-3 text-[#0F172A] font-semibold group-hover:text-[#F97316] transition-colors mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="type-body text-[#64748B] mb-6 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-xs">
        <span className="text-[#64748B] font-medium">
          {lessonNumber} {duration ? `• ${duration}` : ""}
        </span>
        <button
          type="button"
          onClick={onWatch}
          className="inline-flex items-center gap-1.5 font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-[#F97316]" />
          <span>Watch from {startSecondsFormatted}</span>
        </button>
      </div>
    </div>
  );
}

// 3. Lesson Card
export interface LessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  moduleLabel?: string;
  onView?: () => void;
}

export function LessonCard({
  title = "Data Fetching & Caching",
  description = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  onView,
  className,
  ...props
}: LessonCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]",
        className
      )}
      {...props}
    >
      <div>
        <div className="mb-3">
          <Badge variant="lesson">LESSON</Badge>
        </div>
        <h3 className="type-heading-3 text-[#0F172A] font-semibold group-hover:text-[#F97316] transition-colors mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="type-body text-[#64748B] mb-6 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-xs">
        <span className="text-[#64748B] font-medium">{moduleLabel}</span>
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1 font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
        >
          <span>View lesson</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// 4. Resource Card
export interface ResourceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  fileType?: string;
  fileSize?: string;
  onDownload?: () => void;
}

export function ResourceCard({
  title = "Caching and Revalidation Guide",
  description = "Deep dive into Next.js caching strategies.",
  fileType = "PDF",
  fileSize = "1.2 MB",
  onDownload,
  className,
  ...props
}: ResourceCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1]",
        className
      )}
      {...props}
    >
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F1F5F9] text-[#334155]">
            <FileText className="w-5 h-5 text-[#334155]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="type-heading-3 text-[#0F172A] font-semibold group-hover:text-[#F97316] transition-colors mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="type-body text-[#64748B] line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] text-xs">
        <span className="text-[#64748B] font-medium">
          {fileType} • {fileSize}
        </span>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1 font-medium text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
          aria-label="Download resource"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
