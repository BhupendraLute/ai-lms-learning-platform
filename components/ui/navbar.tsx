import React from "react";
import Link from "next/link";
import { AiLmsLogo } from "./icons";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  activePath?: string;
  items?: NavItem[];
}

export function Navbar({
  activePath = "/courses",
  items = [
    { label: "Courses", href: "/courses", active: true },
    { label: "My Learning", href: "/my-learning", active: false },
  ],
  className,
  ...props
}: NavbarProps) {
  return (
    <header
      className={cn(
        "flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-6 md:px-8",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <AiLmsLogo size={28} className="group-hover:scale-105 transition-transform" />
          <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
            AI-LMS
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {items.map((item) => {
            const isActive = item.active || item.href === activePath;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#F97316] font-semibold"
                    : "text-[#334155] hover:text-[#0F172A]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
