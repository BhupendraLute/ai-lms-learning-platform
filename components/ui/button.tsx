import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] focus-visible:ring-offset-2 disabled:cursor-not-allowed";

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-[10px]",
      md: "h-10 px-3 text-sm rounded-[12px]",
      lg: "h-[44px] px-4 text-sm md:text-base rounded-[12px]",
    };

    const variantStyles = {
      primary: disabled
        ? "bg-[#FED7AA] text-white"
        : "bg-[#F97316] text-white hover:bg-[#EA580C] active:bg-[#C2410C] shadow-sm",
      secondary: disabled
        ? "bg-white text-[#FED7AA] border border-[#FED7AA]"
        : "bg-white text-[#F97316] border border-[#F97316] hover:bg-[#FFEEE5] hover:border-[#FB923C] active:bg-[#FED7AA]/30",
      tertiary: disabled
        ? "bg-white text-[#CBD5E1] border border-[#E2E8F0] opacity-60"
        : "bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] hover:text-[#0F172A]",
      text: disabled
        ? "bg-transparent text-[#FED7AA]"
        : "bg-transparent text-[#F97316] hover:text-[#EA580C] active:text-[#C2410C] px-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
