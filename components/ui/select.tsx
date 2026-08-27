import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], children, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            "h-[44px] w-full appearance-none rounded-[12px] border border-[#E2E8F0] bg-white px-4 pr-10 text-sm font-medium text-[#0F172A] transition-all duration-150 focus:border-[#FB923C] focus:outline-none focus:ring-2 focus:ring-[#FB923C]/20 disabled:cursor-not-allowed disabled:bg-[#FAFAFC] disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 flex items-center text-[#64748B]">
          <ChevronDown className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
