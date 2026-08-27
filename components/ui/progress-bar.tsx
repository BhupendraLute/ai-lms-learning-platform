import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  labelPosition?: "right" | "top";
  customLabel?: string;
  label?: string;
}

export function ProgressBar({
  value = 0,
  max = 100,
  showLabel = true,
  labelPosition = "right",
  customLabel,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = Math.round((clampedValue / max) * 100);
  const labelText = customLabel || label || `${percentage}% complete`;

  return (
    <div
      className={cn(
        "flex items-center gap-4 w-full",
        labelPosition === "top" && "flex-col items-stretch gap-1.5",
        className
      )}
      {...props}
    >
      {labelPosition === "top" && showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-[#64748B]">
          <span>Progress</span>
          <span className="text-[#0F172A] font-semibold">{labelText}</span>
        </div>
      )}
      <div className="relative h-2 w-full flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
        <div
          className="h-full rounded-full bg-[#F97316] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {labelPosition === "right" && showLabel && (
        <span className="shrink-0 text-xs font-medium text-[#334155]">
          <strong className="font-semibold text-[#0F172A]">{percentage}%</strong> complete
        </span>
      )}
    </div>
  );
}
