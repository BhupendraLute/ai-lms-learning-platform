"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
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
  onNotificationClick,
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
        <div className="flex items-center gap-3 sm:gap-4">
          <Show when="signed-out">
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-sm font-medium text-[#334155] hover:text-[#0F172A] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="text-sm font-medium bg-[#F97316] text-white hover:bg-[#EA580C] px-3.5 py-1.5 rounded-[10px] shadow-sm transition-all hover:shadow hover:scale-[1.01] active:scale-[0.99]"
                >
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3 sm:gap-4">
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
                <div className="flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full ring-1 ring-[#E2E8F0]",
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </Show>

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

          <div className="pt-3 mt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full text-center px-3 py-2 rounded-lg text-sm font-medium text-[#334155] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="w-full text-center px-3 py-2 rounded-lg text-sm font-medium bg-[#F97316] text-white hover:bg-[#EA580C] shadow-sm transition-colors"
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-[#334155]">Signed in as:</span>
                <UserButton />
              </div>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
