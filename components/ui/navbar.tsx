"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiLmsLogo, Bell, Menu, X } from "./icons";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  activePath?: string;
  items?: NavItem[];
  showNotifications?: boolean;
  showUser?: boolean;
  userAvatarUrl?: string;
  onNotificationClick?: () => void;
  onUserClick?: () => void;
}

export function Navbar({
  activePath = "/",
  items = [
    { label: "Courses", href: "/courses", active: false },
    { label: "My Learning", href: "/my-learning", active: false },
  ],
  showNotifications = true,
  showUser = true,
  userAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  onNotificationClick,
  onUserClick,
  className,
  ...props
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "w-full border-b border-[#E2E8F0] bg-white shrink-0 sticky top-0 z-30",
        className
      )}
      {...props}
    >
      <div className="max-w-[1440px] mx-auto w-full h-16 px-4 sm:px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <AiLmsLogo size={28} className="group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
              AI-LMS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
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

        {/* Right Header Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {showNotifications && (
            <button
              type="button"
              onClick={onNotificationClick}
              className="relative p-1.5 text-[#334155] hover:text-[#0F172A] transition-colors rounded-full hover:bg-[#F1F5F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C]"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.75]" />
            </button>
          )}

          {showUser && (
            <button
              type="button"
              onClick={onUserClick}
              className="flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] focus-visible:ring-offset-2 overflow-hidden ring-1 ring-[#E2E8F0]"
              aria-label="User Profile"
            >
              <Image
                src={userAvatarUrl}
                alt="User Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
                unoptimized
                priority
              />
            </button>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-1.5 text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-3 shadow-md animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {items.map((item) => {
              const isActive = item.active || item.href === activePath;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#FFEEE5] text-[#F97316] font-semibold"
                      : "text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}


