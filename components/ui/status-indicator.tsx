import React from "react";
import { CheckCircle2, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = "in-progress" | "completed" | "now-playing" | "locked";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  showLabel?: boolean;
  label?: string;
}

export function StatusIndicator({
  status,
  showLabel = true,
  label,
  className,
  ...props
}: StatusIndicatorProps) {
  const statusConfig = {
    "in-progress": {
      defaultLabel: "In Progress",
      textColor: "text-[#334155]",
      icon: (
        <svg
          className="w-4 h-4 text-[#F97316]"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="#FED7AA"
            strokeWidth="2"
          />
          <path
            d="M8 2C11.3137 2 14 4.68629 14 8"
            stroke="#F97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    completed: {
      defaultLabel: "Completed",
      textColor: "text-[#334155]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#10B981]" strokeWidth={2.2} />,
    },
    "now-playing": {
      defaultLabel: "Now Playing",
      textColor: "text-[#334155]",
      icon: (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F97316] text-white">
          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
        </span>
      ),
    },
    locked: {
      defaultLabel: "Locked",
      textColor: "text-[#64748B]",
      icon: <Lock className="w-4 h-4 text-[#64748B]" strokeWidth={2} />,
    },
  };

  const current = statusConfig[status];

  return (
    <div
      className={cn("inline-flex items-center gap-2 text-sm font-medium", current.textColor, className)}
      {...props}
    >
      <span className="inline-flex shrink-0 items-center justify-center">{current.icon}</span>
      {showLabel && <span>{label || current.defaultLabel}</span>}
    </div>
  );
}
