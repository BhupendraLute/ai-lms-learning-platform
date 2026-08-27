import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage = 1,
  totalPages = 8,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages: (number | string)[] = [1, 2, 3, "...", totalPages];

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      <button
        onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </button>

      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm font-medium text-[#64748B]"
            >
              ...
            </span>
          );
        }

        const pageNum = Number(p);
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange?.(pageNum)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150",
              isActive
                ? "border border-[#F97316] bg-white font-semibold text-[#F97316] shadow-sm"
                : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            )}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </nav>
  );
}
