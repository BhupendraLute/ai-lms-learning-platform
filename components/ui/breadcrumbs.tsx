import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-sm text-[#64748B]", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="mx-1.5 h-3.5 w-3.5 shrink-0 text-[#CBD5E1]"
                  strokeWidth={2.5}
                />
              )}
              {isLast ? (
                <span className="font-medium text-[#0F172A]">{item.label}</span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="font-normal text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-normal text-[#64748B]">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
