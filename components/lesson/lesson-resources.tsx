"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  BookOpen,
  Code,
  Sparkles,
} from "@/components/ui/icons";
import posthog from "posthog-js";
import type { Resource } from "@/sanity/types";

interface LessonResourcesProps {
  resources?: Resource[];
}

function ResourceIcon({ type }: { type: string }) {
  const normalized = type?.toLowerCase() || "";

  if (normalized.includes("github") || normalized.includes("repo") || normalized.includes("code")) {
    return (
      <div className="w-9 h-9 rounded-[10px] bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Code className="w-4 h-4 text-white" />
      </div>
    );
  }

  if (normalized.includes("doc") || normalized.includes("guide") || normalized.includes("article")) {
    return (
      <div className="w-9 h-9 rounded-[10px] bg-[#FFEEE5] text-[#EA580C] flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-[#EA580C]" />
      </div>
    );
  }

  if (normalized.includes("tool") || normalized.includes("book")) {
    return (
      <div className="w-9 h-9 rounded-[10px] bg-[#FFEEE5] text-[#EA580C] flex items-center justify-center shrink-0">
        <BookOpen className="w-4 h-4 text-[#EA580C]" />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
      <Sparkles className="w-4 h-4 text-[#475569]" />
    </div>
  );
}

export function LessonResources({ resources = [] }: LessonResourcesProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  const handleResourceClick = (res: Resource) => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture("lesson_resource_clicked", {
        resource_title: res.title,
        resource_url: res.url,
        resource_type: res.type,
      });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-serif text-xl font-bold text-[#0F172A] tracking-tight mb-4">
        Resources
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, idx) => (
          <Link
            key={resource._key || `res-${idx}`}
            href={resource.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleResourceClick(resource)}
            className="group rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#CBD5E1] hover:shadow-xs transition-all flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <ResourceIcon type={resource.type} />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-xs sm:text-sm text-[#0F172A] tracking-tight group-hover:text-[#EA580C] transition-colors truncate">
                  {resource.title}
                </h4>
                {resource.description && (
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>
                )}
              </div>
            </div>

            <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#EA580C] transition-colors shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
