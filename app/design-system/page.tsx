"use client";

import React, { useState } from "react";
import {
  AiLmsLogo,
  Button,
  Badge,
  StatusIndicator,
  Input,
  Select,
  ProgressBar,
  CourseCard,
  VideoLessonCard,
  LessonCard,
  ResourceCard,
  Breadcrumbs,
  Pagination,
  Navbar,
} from "@/components/ui";
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
  Eye,
  LayoutGrid,
  Target,
  Accessibility,
  ArrowUpRight,
} from "lucide-react";

export default function DesignSystemPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [progressVal, setProgressVal] = useState(35);
  const [searchValue, setSearchValue] = useState("");

  const primaryColors = [
    { label: "Primary 500", hex: "#F97316", bg: "bg-[#F97316]" },
    { label: "Primary 400", hex: "#FB923C", bg: "bg-[#FB923C]" },
    { label: "Primary 300", hex: "#FDBA74", bg: "bg-[#FDBA74]" },
    { label: "Primary 200", hex: "#FED7AA", bg: "bg-[#FED7AA]" },
    { label: "Primary 100", hex: "#FFEEE5", bg: "bg-[#FFEEE5]" },
  ];

  const neutralColors = [
    { label: "Neutral 900", hex: "#0F172A", bg: "bg-[#0F172A]" },
    { label: "Neutral 700", hex: "#334155", bg: "bg-[#334155]" },
    { label: "Neutral 500", hex: "#64748B", bg: "bg-[#64748B]" },
    { label: "Neutral 300", hex: "#CBD5E1", bg: "bg-[#CBD5E1]" },
    { label: "Neutral 200", hex: "#E2E8F0", bg: "bg-[#E2E8F0]" },
    { label: "Neutral 100", hex: "#F1F5F9", bg: "bg-[#F1F5F9]" },
    { label: "Neutral 50", hex: "#FAFAFC", bg: "bg-[#FAFAFC]", border: "border border-[#E2E8F0]" },
    { label: "White", hex: "#FFFFFF", bg: "bg-[#FFFFFF]", border: "border border-[#E2E8F0]" },
  ];

  const typeScaleData = [
    {
      style: "Display 1",
      font: "Playfair Display",
      size: "48 / 56",
      weight: "Bold",
      use: "Page titles",
    },
    {
      style: "Display 2",
      font: "Playfair Display",
      size: "36 / 44",
      weight: "Bold",
      use: "Section titles",
    },
    {
      style: "Heading 1",
      font: "Inter",
      size: "28 / 36",
      weight: "Semi Bold",
      use: "Card titles",
    },
    {
      style: "Heading 2",
      font: "Inter",
      size: "22 / 30",
      weight: "Semi Bold",
      use: "Sub section",
    },
    {
      style: "Heading 3",
      font: "Inter",
      size: "18 / 26",
      weight: "Medium",
      use: "Small titles",
    },
    {
      style: "Body Large",
      font: "Inter",
      size: "16 / 24",
      weight: "Regular",
      use: "Body copy",
    },
    {
      style: "Body",
      font: "Inter",
      size: "14 / 20",
      weight: "Regular",
      use: "Supporting text",
    },
    {
      style: "Small",
      font: "Inter",
      size: "12 / 16",
      weight: "Regular",
      use: "Captions, meta",
    },
  ];

  const spacingScale = [
    { px: 4, rem: "0.25rem" },
    { px: 8, rem: "0.5rem" },
    { px: 12, rem: "0.75rem" },
    { px: 16, rem: "1rem" },
    { px: 24, rem: "1.5rem" },
    { px: 32, rem: "2rem" },
    { px: 40, rem: "2.5rem" },
    { px: 48, rem: "3rem" },
    { px: 64, rem: "4rem" },
  ];

  const radiusScale = [
    { label: "4px", name: "xs", radiusClass: "rounded-[4px]" },
    { label: "8px", name: "sm", radiusClass: "rounded-[8px]" },
    { label: "12px", name: "md", radiusClass: "rounded-[12px]" },
    { label: "16px", name: "lg", radiusClass: "rounded-[16px]" },
    { label: "24px", name: "xl", radiusClass: "rounded-[24px]" },
    { label: "Full", name: "circle", radiusClass: "rounded-full" },
  ];

  const shadowScale = [
    {
      name: "Sm",
      value: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
      shadowClass: "shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]",
    },
    {
      name: "Md",
      value: "0 4px 12px -2px rgba(15, 23, 42, 0.08)",
      shadowClass: "shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08)]",
    },
    {
      name: "Lg",
      value: "0 12px 24px -4px rgba(15, 23, 42, 0.10)",
      shadowClass: "shadow-[0_12px_24px_-4px_rgba(15,23,42,0.10)]",
    },
    {
      name: "Xl",
      value: "0 20px 40px -8px rgba(15, 23, 42, 0.12)",
      shadowClass: "shadow-[0_20px_40px_-8px_rgba(15,23,42,0.12)]",
    },
  ];

  const outlineIcons = [
    { name: "Bell", icon: <Bell className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "Search", icon: <Search className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "Play", icon: <Play className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "Document", icon: <FileText className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "Bookmark", icon: <Bookmark className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "Chart", icon: <BarChart2 className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "Clock", icon: <Clock className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "User", icon: <User className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
    { name: "ChevronRight", icon: <ChevronRight className="w-5 h-5 text-[#334155]" strokeWidth={2} /> },
  ];

  const filledIcons = [
    { name: "Bell", icon: <Bell className="w-5 h-5 text-[#0F172A] fill-current" /> },
    { name: "Search", icon: <Search className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} /> },
    { name: "Play", icon: <Play className="w-5 h-5 text-[#0F172A] fill-current" /> },
    { name: "Document", icon: <FileText className="w-5 h-5 text-[#0F172A] fill-current" /> },
    { name: "Bookmark", icon: <Bookmark className="w-5 h-5 text-[#0F172A] fill-current" /> },
    { name: "Chart", icon: <BarChart2 className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} /> },
    { name: "Clock", icon: <Clock className="w-5 h-5 text-[#0F172A] fill-current" /> },
    { name: "User", icon: <User className="w-5 h-5 text-[#0F172A] fill-current" /> },
    { name: "ChevronRight", icon: <ChevronRight className="w-5 h-5 text-[#0F172A]" strokeWidth={3} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] pb-24">
      {/* Top Banner / System Title Header */}
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <AiLmsLogo size={40} />
            <span className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
              AI-LMS
            </span>
          </div>
          <h1 className="type-display-1 text-[#0F172A] mb-4">
            Design System
          </h1>
          <p className="type-body-large text-[#64748B] max-w-2xl mb-4">
            A unified design language for AI-LMS learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
          </p>
          <div className="text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">
            VERSION 1.0 • MAY 2025
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16 mt-12">

        {/* 01 COLORS */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
            01 &nbsp; COLORS
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Primary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {primaryColors.map((color) => (
                  <div key={color.label} className="flex flex-col gap-2">
                    <div
                      className={`h-24 rounded-[12px] ${color.bg} shadow-sm flex items-end p-3`}
                    />
                    <div>
                      <div className="text-xs font-medium text-[#0F172A]">{color.label}</div>
                      <div className="text-[11px] font-mono text-[#64748B]">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Neutral</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                {neutralColors.map((color) => (
                  <div key={color.label} className="flex flex-col gap-2">
                    <div
                      className={`h-20 rounded-[12px] ${color.bg} ${color.border || ""} shadow-sm flex items-end p-2`}
                    />
                    <div>
                      <div className="text-xs font-medium text-[#0F172A]">{color.label}</div>
                      <div className="text-[11px] font-mono text-[#64748B]">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 02 TYPOGRAPHY & 03 TYPE SCALE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 02 Typography */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
                02 &nbsp; TYPOGRAPHY
              </div>
              <div className="space-y-8">
                <div>
                  <div className="type-display-1 text-[#0F172A] mb-1">Ag</div>
                  <h3 className="text-lg font-bold font-serif text-[#0F172A]">Playfair Display</h3>
                  <p className="text-xs text-[#64748B] mt-1">Elegant • Readable • Timeless</p>
                </div>
                <div className="pt-6 border-t border-[#F1F5F9]">
                  <div className="type-display-1 font-sans text-[#0F172A] mb-1">Ag</div>
                  <h3 className="text-lg font-bold font-sans text-[#0F172A]">Inter</h3>
                  <p className="text-xs text-[#64748B] mt-1">Clean • Modern • Highly legible</p>
                </div>
              </div>
            </div>
          </section>

          {/* 03 Type Scale */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm lg:col-span-2 overflow-x-auto">
            <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
              03 &nbsp; TYPE SCALE
            </div>

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  <th className="pb-3 pr-4">Style</th>
                  <th className="pb-3 pr-4">Font</th>
                  <th className="pb-3 pr-4">Size / Line Height</th>
                  <th className="pb-3 pr-4">Weight</th>
                  <th className="pb-3">Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs md:text-sm">
                {typeScaleData.map((row) => (
                  <tr key={row.style} className="hover:bg-[#FAFAFC]">
                    <td className="py-3 pr-4 font-semibold text-[#0F172A] whitespace-nowrap">
                      {row.style}
                    </td>
                    <td className="py-3 pr-4 text-[#64748B] whitespace-nowrap">{row.font}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-[#0F172A] whitespace-nowrap">
                      {row.size}
                    </td>
                    <td className="py-3 pr-4 text-[#64748B] whitespace-nowrap">{row.weight}</td>
                    <td className="py-3 text-[#64748B] whitespace-nowrap">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* 04 SPACING SYSTEM & 05 RADIUS & SHADOWS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 04 Spacing System */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
            <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-2">
              04 &nbsp; SPACING SYSTEM
            </div>
            <div className="text-xs text-[#64748B] mb-6">Base unit: 4px</div>

            <div className="flex flex-wrap items-end gap-4 sm:gap-6 pt-4">
              {spacingScale.map((s) => (
                <div key={s.px} className="flex flex-col items-center gap-2">
                  <div
                    className="bg-[#FED7AA] rounded-[4px]"
                    style={{ width: `${s.px}px`, height: `${s.px}px`, minWidth: "6px", minHeight: "6px" }}
                  />
                  <div className="text-center">
                    <div className="text-xs font-semibold text-[#0F172A]">{s.px}</div>
                    <div className="text-[10px] text-[#64748B]">({s.rem})</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 05 Radius & Shadows */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm space-y-6">
            <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-2">
              05 &nbsp; RADIUS & SHADOWS
            </div>

            <div>
              <div className="text-xs font-semibold text-[#0F172A] mb-3">Radius</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {radiusScale.map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-1.5 text-center">
                    <div
                      className={`h-12 w-12 border border-[#CBD5E1] bg-[#F8FAFC] ${r.radiusClass}`}
                    />
                    <span className="text-xs font-medium text-[#0F172A]">{r.label}</span>
                    <span className="text-[10px] text-[#64748B]">({r.name})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <div className="text-xs font-semibold text-[#0F172A] mb-3">Shadows</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {shadowScale.map((s) => (
                  <div
                    key={s.name}
                    className={`rounded-[12px] bg-white border border-[#E2E8F0] p-3.5 flex flex-col justify-between ${s.shadowClass}`}
                  >
                    <div className="text-xs font-bold text-[#0F172A] mb-1">{s.name}</div>
                    <div className="text-[9px] font-mono text-[#64748B] break-all leading-tight">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 06 ICONS */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
            06 &nbsp; ICONS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Outline Style
              </h4>
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-[12px] bg-[#FAFAFC] border border-[#E2E8F0]">
                {outlineIcons.map((item) => (
                  <div
                    key={item.name}
                    className="p-2 rounded-lg hover:bg-[#E2E8F0] transition-colors"
                    title={item.name}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Filled Style
              </h4>
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-[12px] bg-[#FAFAFC] border border-[#E2E8F0]">
                {filledIcons.map((item) => (
                  <div
                    key={item.name}
                    className="p-2 rounded-lg hover:bg-[#E2E8F0] transition-colors"
                    title={item.name}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Icon Specs
              </h4>
              <ul className="text-xs text-[#64748B] space-y-1.5 list-disc list-inside">
                <li>24x24px grid</li>
                <li>2px stroke width (outline)</li>
                <li>Rounded line caps</li>
                <li>Consistent optical balance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 07 BUTTONS */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm overflow-x-auto">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
            07 &nbsp; BUTTONS
          </div>

          <div className="min-w-[650px] space-y-6">
            <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
              <div>State</div>
              <div>Primary</div>
              <div>Secondary</div>
              <div>Tertiary</div>
              <div>Text</div>
            </div>

            {/* Default */}
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="text-xs font-medium text-[#0F172A]">Default</div>
              <div>
                <Button variant="primary">Get Started</Button>
              </div>
              <div>
                <Button variant="secondary">Explore Courses</Button>
              </div>
              <div>
                <Button variant="tertiary" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  View Lesson
                </Button>
              </div>
              <div>
                <Button
                  variant="text"
                  rightIcon={<Play className="w-4 h-4 fill-[#F97316]" />}
                >
                  Watch Video
                </Button>
              </div>
            </div>

            {/* Hover Simulation */}
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="text-xs font-medium text-[#0F172A]">Hover</div>
              <div>
                <Button variant="primary" className="bg-[#EA580C]">
                  Get Started
                </Button>
              </div>
              <div>
                <Button variant="secondary" className="bg-[#FFEEE5] border-[#FB923C]">
                  Explore Courses
                </Button>
              </div>
              <div>
                <Button
                  variant="tertiary"
                  className="bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  View Lesson
                </Button>
              </div>
              <div>
                <Button
                  variant="text"
                  className="text-[#EA580C]"
                  rightIcon={<Play className="w-4 h-4 fill-[#EA580C]" />}
                >
                  Watch Video
                </Button>
              </div>
            </div>

            {/* Disabled */}
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="text-xs font-medium text-[#0F172A]">Disabled</div>
              <div>
                <Button variant="primary" disabled>
                  Get Started
                </Button>
              </div>
              <div>
                <Button variant="secondary" disabled>
                  Explore Courses
                </Button>
              </div>
              <div>
                <Button variant="tertiary" disabled rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  View Lesson
                </Button>
              </div>
              <div>
                <Button
                  variant="text"
                  disabled
                  rightIcon={<Play className="w-4 h-4 fill-[#FED7AA]" />}
                >
                  Watch Video
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#F1F5F9]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                Button Specs
              </h4>
              <ul className="text-xs text-[#64748B] space-y-1 list-disc list-inside">
                <li>Height: 44px (default)</li>
                <li>Padding: 0 16px (lg), 0 12px (md)</li>
                <li>Radius: 12px</li>
                <li>Font: Inter Medium (14–16px)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 08 INPUTS */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
            08 &nbsp; INPUTS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0F172A]">Search / Text Input</label>
              <Input
                showShortcut
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search anything..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#0F172A]">Select</label>
              <Select
                options={[
                  { value: "most-relevant", label: "Most Relevant" },
                  { value: "newest", label: "Newest" },
                  { value: "popular", label: "Most Popular" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Field Specs
              </h4>
              <ul className="text-xs text-[#64748B] space-y-1 list-disc list-inside">
                <li>Height: 44px</li>
                <li>Radius: 12px</li>
                <li>Border: 1px solid #E2E8F0</li>
                <li>Padding: 0 16px</li>
                <li>Focus: Border color #FB923C</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 09 BADGES / TAGS & 10 STATUS / INDICATORS & 11 PROGRESS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 09 Badges */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-4">
              09 &nbsp; BADGES / TAGS
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-[#64748B] mb-1.5">Video</div>
                <Badge variant="video">VIDEO</Badge>
              </div>
              <div>
                <div className="text-xs text-[#64748B] mb-1.5">Lesson</div>
                <Badge variant="lesson">LESSON</Badge>
              </div>
              <div>
                <div className="text-xs text-[#64748B] mb-1.5">Popular</div>
                <Badge variant="popular">POPULAR</Badge>
              </div>
            </div>
          </section>

          {/* 10 Status / Indicators */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-4">
              10 &nbsp; STATUS / INDICATORS
            </div>
            <div className="space-y-4">
              <div>
                <StatusIndicator status="in-progress" label="In Progress" />
              </div>
              <div>
                <StatusIndicator status="completed" label="Completed" />
              </div>
              <div>
                <StatusIndicator status="now-playing" label="Now Playing" />
              </div>
              <div>
                <StatusIndicator status="locked" label="Locked" />
              </div>
            </div>
          </section>

          {/* 11 Progress Bar */}
          <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-4">
              11 &nbsp; PROGRESS BAR
            </div>
            <div className="space-y-6 pt-2">
              <ProgressBar value={progressVal} />

              <div className="pt-4 border-t border-[#F1F5F9] space-y-2">
                <label className="text-xs text-[#64748B]">Interactive Demo:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>
            </div>
          </section>
        </div>

        {/* 12 CARDS */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
            12 &nbsp; CARDS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-semibold text-[#64748B] mb-3">Course Card</div>
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                moduleCount="12 modules"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-[#64748B] mb-3">Lesson Card (Video)</div>
              <VideoLessonCard
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonNumber="Lesson 5.1"
                duration="12:45"
                startSecondsFormatted="12:45"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-[#64748B] mb-3">Lesson Card (Lesson)</div>
              <LessonCard
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-[#64748B] mb-3">Resource Card</div>
              <ResourceCard
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                fileType="PDF"
                fileSize="1.2 MB"
              />
            </div>
          </div>
        </section>

        {/* 13 NAVIGATION */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm space-y-8">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-2">
            13 &nbsp; NAVIGATION
          </div>

          <div>
            <div className="text-xs font-semibold text-[#64748B] mb-3">Header Navigation</div>
            <div className="rounded-[12px] border border-[#E2E8F0] overflow-hidden">
              <Navbar />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#F1F5F9]">
            <div>
              <div className="text-xs font-semibold text-[#64748B] mb-3">Breadcrumbs</div>
              <div className="p-4 rounded-[12px] bg-[#FAFAFC] border border-[#E2E8F0]">
                <Breadcrumbs
                  items={[
                    { label: "All Courses", href: "#" },
                    { label: "Next.js for Production", href: "#" },
                    { label: "Data Fetching & Caching" },
                  ]}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#64748B] mb-3">Pagination</div>
              <div className="p-4 rounded-[12px] bg-[#FAFAFC] border border-[#E2E8F0] flex items-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={8}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 14 PRINCIPLES */}
        <section className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="text-xs font-bold tracking-widest text-[#F97316] uppercase mb-6">
            14 &nbsp; PRINCIPLES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-[16px] bg-[#FAFAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFEEE5] text-[#F97316]">
                <Eye className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Clarity First</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Every element should communicate clearly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-[16px] bg-[#FAFAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFEEE5] text-[#F97316]">
                <LayoutGrid className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Consistency</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Use components and patterns consistently across the platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-[16px] bg-[#FAFAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFEEE5] text-[#F97316]">
                <Target className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Focus & Calm</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Remove noise and help learners focus on what matters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-[16px] bg-[#FAFAFC] border border-[#E2E8F0]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFEEE5] text-[#F97316]">
                <Accessibility className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-1">Accessible</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Design with accessibility and inclusivity in mind.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
