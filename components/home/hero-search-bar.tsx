"use client";

import React, { useRef, useEffect } from "react";
import { Search } from "@/components/ui/icons";

export function HeroSearchBar() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ⌘K or Ctrl+K shortcut listener to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-[680px] mx-auto mt-8">
      <div className="relative flex items-center w-full rounded-[14px] border border-[#E2E8F0] bg-white shadow-sm transition-all duration-200 hover:border-[#CBD5E1] focus-within:border-[#FB923C] focus-within:ring-2 focus-within:ring-[#FB923C]/20">
        <div className="absolute left-4 flex items-center pointer-events-none text-[#64748B]">
          <Search className="w-5 h-5 text-[#64748B]" strokeWidth={2} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Ask anything about your learning..."
          className="h-[52px] w-full rounded-[14px] bg-transparent pl-12 pr-16 text-sm md:text-[15px] text-[#0F172A] placeholder:text-[#64748B] outline-none"
        />
        <div className="absolute right-3.5 flex items-center pointer-events-none">
          <kbd className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-1 text-xs font-medium text-[#64748B] select-none">
            <span className="text-xs">⌘</span> K
          </kbd>
        </div>
      </div>
    </div>
  );
}
