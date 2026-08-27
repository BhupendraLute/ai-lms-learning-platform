import React, { forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  showShortcut?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      leftIcon,
      rightElement,
      showShortcut = false,
      placeholder = "Search anything...",
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon ? (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
            {leftIcon}
          </div>
        ) : (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
            <Search className="w-5 h-5 text-[#64748B]" strokeWidth={2} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-[44px] w-full rounded-[12px] border border-[#E2E8F0] bg-white pl-11 pr-14 text-sm text-[#0F172A] placeholder:text-[#64748B] transition-all duration-150 focus:border-[#FB923C] focus:outline-none focus:ring-2 focus:ring-[#FB923C]/20 disabled:cursor-not-allowed disabled:bg-[#FAFAFC] disabled:opacity-50",
            !leftIcon && "pl-11",
            !showShortcut && !rightElement && "pr-4",
            className
          )}
          {...props}
        />
        {rightElement ? (
          <div className="absolute right-3 flex items-center">{rightElement}</div>
        ) : showShortcut ? (
          <div className="absolute right-3 flex items-center pointer-events-none">
            <kbd className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 text-xs font-medium text-[#64748B]">
              <span className="text-xs">⌘</span> K
            </kbd>
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
