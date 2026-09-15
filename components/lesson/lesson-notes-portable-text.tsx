"use client";

import React from "react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import Link from "next/link";

interface LessonNotesPortableTextProps {
  blocks?: PortableTextBlock[];
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-4">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-6 mb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-base sm:text-lg font-bold text-[#0F172A] tracking-tight mt-5 mb-2">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#F97316] pl-4 py-1.5 my-4 italic text-[#334155] bg-[#FFF8F5]/60 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-[#475569] mb-4 pl-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1.5 text-sm sm:text-base text-[#475569] mb-4 pl-1">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0F172A]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded-md bg-[#F1F5F9] font-mono text-xs sm:text-sm text-[#0F172A] border border-[#E2E8F0]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <Link
          href={value?.href || "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-[#EA580C] hover:text-[#C24E2B] underline underline-offset-2 font-medium"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    code: ({ value }) => (
      <pre className="rounded-[12px] bg-[#0F172A] text-[#F8FAFC] p-4 font-mono text-xs sm:text-sm overflow-x-auto my-4 border border-[#1E293B]">
        <code>{value?.code || ""}</code>
      </pre>
    ),
  },
};

export function LessonNotesPortableText({ blocks }: LessonNotesPortableTextProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <PortableText value={blocks} components={portableTextComponents} />
    </div>
  );
}
