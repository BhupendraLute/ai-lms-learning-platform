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
  ArrowRight,
  Loader2,
  Star,
  BookOpen,
  Menu,
  X,
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
        d="M3 5H29L16 27L3 5Z"
        fill="#F97316"
      />
      <path
        d="M8.5 7.5H23.5L16 20.5L8.5 7.5Z"
        fill="#FAFAFC"
      />
      <path
        d="M12.5 9.5H19.5L16 15.5L12.5 9.5Z"
        fill="#F97316"
      />
    </svg>
  );
}

// Next.js Brand Icon
export function NextjsIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-[12px] bg-[#0F172A] text-white shadow-sm font-sans font-bold select-none ${className}`}
    >
      <span style={{ fontSize: typeof size === "number" ? `${size * 0.45}px` : "20px" }}>N</span>
    </div>
  );
}

// Docker Brand Whale Icon
export function DockerIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center select-none ${className}`}
    >
      <svg
        width={typeof size === "number" ? size * 0.95 : size}
        height={typeof size === "number" ? size * 0.95 : size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Containers */}
        <rect x="18" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
        <rect x="25" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
        <rect x="32" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
        <rect x="25" y="18" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
        <rect x="32" y="18" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
        <rect x="39" y="24" width="6" height="5" rx="0.75" fill="#0284C7" stroke="#0F172A" strokeWidth="1" />
        {/* Whale Body */}
        <path
          d="M58 35C56 31 52 30 48 30C46 30 44.5 30.5 43 31.5C40 31.5 38 31 36 31H12C8 31 6 34 6 37C6 44 12 49 24 49C36 49 48 46 54 39C56 39 58 37 58 35Z"
          fill="#0EA5E9"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Whale Spout & Tail */}
        <path
          d="M54 33C57 30 59 26 56 24C53 22 51 27 49 29"
          fill="#0EA5E9"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Eye */}
        <circle cx="16" cy="38" r="1.5" fill="#0F172A" />
      </svg>
    </div>
  );
}

// TypeScript Brand Icon
export function TypeScriptIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-[12px] bg-[#0284C7] text-white shadow-sm font-sans font-bold select-none ${className}`}
    >
      <span style={{ fontSize: typeof size === "number" ? `${size * 0.4}px` : "18px", letterSpacing: "-0.05em" }}>TS</span>
    </div>
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
  ArrowRight,
  Loader2,
  Star,
  BookOpen,
  Menu,
  X,
};

