import React from "react";
import {
  Bell,
  Search,
  Play,
  FileText,
  Bookmark,
  BarChart2,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  CheckCircle2,
  Lock,
  ExternalLink,
  Command,
  Eye,
  LayoutGrid,
  Target,
  Accessibility,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  filled?: boolean;
}

// Custom AI-LMS Triangular Brand Logo Icon
export function AiLmsLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2L30 26H2L16 2Z"
        fill="#F97316"
      />
      <path
        d="M16 9L24.5 24H7.5L16 9Z"
        fill="#FAFAFC"
      />
      <path
        d="M16 15L20 22.5H12L16 15Z"
        fill="#F97316"
      />
    </svg>
  );
}

export {
  Bell,
  Search,
  Play,
  FileText,
  Bookmark,
  BarChart2,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  CheckCircle2,
  Lock,
  ExternalLink,
  Command,
  Eye,
  LayoutGrid,
  Target,
  Accessibility,
  ArrowUpRight,
  Loader2,
};
