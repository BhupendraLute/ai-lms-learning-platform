# Implementation Prompt: AI-LMS Design System Implementation

## Goal
Implement the complete AI-LMS Design System derived from the design specification reference (`design/ailms-designsystem.png`). This includes the foundational color tokens, typography hierarchy (Playfair Display and Inter), spacing, border radius, shadows, core reusable UI components (Buttons, Inputs, Badges, Status Indicators, Progress Bars, Cards, Breadcrumbs, Pagination, Navigation Header, and Icons), and an interactive Design System Showcase page.

---

## Skills Read
- `AGENTS.md` (Project rules, boundaries, and implementation loop)
- `.agents/skills/develop/SKILL.md` (UI track implementation principles)
- `.agents/skills/sanity-best-practices/SKILL.md` (Content and schema design alignment)

---

## Code Inspected
- `package.json`: Next.js 16.3.3, React 19.2.8, Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss: ^4`).
- `app/globals.css`: Root variables and Tailwind configuration.
- `app/layout.tsx`: Root font loading and metadata structure.
- `app/page.tsx`: Current initial landing page.
- `design/ailms-designsystem.png`: Source of truth design specification covering 14 sections.

---

## Decisions and Assumptions
1. **Styling & Token Architecture**:
   - Configure Tailwind CSS v4 `@theme` in `app/globals.css` with exact hex colors, type scale, custom shadows, and border radii matching `design/ailms-designsystem.png`.
2. **Typography**:
   - Load `Playfair_Display` and `Inter` via `next/font/google` in `app/layout.tsx`.
   - Provide explicit utility classes and type tokens (`font-display-1`, `font-display-2`, `font-heading-1`, `font-heading-2`, `font-heading-3`, `font-body-large`, `font-body`, `font-small`).
3. **Icons & Helper Utilities**:
   - Install `lucide-react`, `clsx`, and `tailwind-merge` for robust, accessible icon rendering and flexible className merging.
   - Provide custom 24x24px stroke-2 rounded icon wrappers where appropriate to match Section 06 optical balance.
4. **Component Library Structure**:
   - Organize components in `components/ui/` with clear TypeScript interfaces and accessibility attributes.
   - Components to build:
     - `Button`: Primary, Secondary, Tertiary, Text variants; default, hover, disabled states.
     - `Input` & `Select`: 44px height, 12px radius, `#E2E8F0` border, `#FB923C` focus ring.
     - `Badge`: Video (orange), Lesson (indigo/purple), Popular (warm orange/coral).
     - `StatusIndicator`: In Progress, Completed, Now Playing, Locked.
     - `ProgressBar`: 8px height, rounded full, orange progress bar with completion percentage.
     - `CourseCard`, `VideoLessonCard`, `LessonCard`, `ResourceCard`: Structured cards with responsive styling.
     - `Breadcrumbs`, `Pagination`, `Navbar`: Navigation components.
5. **Interactive Showcase Page**:
   - Implement the showcase on `app/page.tsx` (or dedicated route) displaying all 14 sections from the reference image for full visual parity and testability.

---

## Files to Touch / Create
- `package.json` (Add `lucide-react`, `clsx`, `tailwind-merge`)
- `app/globals.css` (Define theme tokens: colors, type scale, radius, shadows)
- `app/layout.tsx` (Configure Google fonts `Playfair Display` and `Inter`)
- `lib/utils.ts` (Class merging helper `cn`)
- `components/ui/button.tsx` (Button component with all 4 variants and states)
- `components/ui/input.tsx` (Search and text inputs with search icon and ⌘K badge)
- `components/ui/select.tsx` (Select dropdown component)
- `components/ui/badge.tsx` (Content type badges: Video, Lesson, Popular)
- `components/ui/status-indicator.tsx` (Status badges: In Progress, Completed, Now Playing, Locked)
- `components/ui/progress-bar.tsx` (Progress bar component with percentage)
- `components/ui/cards.tsx` (CourseCard, VideoLessonCard, LessonCard, ResourceCard)
- `components/ui/breadcrumbs.tsx` (Breadcrumb navigation)
- `components/ui/pagination.tsx` (Pagination control with active page indicator)
- `components/ui/navbar.tsx` (Header navigation bar with logo and links)
- `components/ui/icons.tsx` (Icon set matching section 06)
- `app/page.tsx` (Complete 14-section Design System showcase)

---

## Requirements & Specifications (from ailms-designsystem.png)

### 01 Colors
- **Primary**:
  - Primary 500: `#F97316`
  - Primary 400: `#FB923C`
  - Primary 300: `#FDBA74`
  - Primary 200: `#FED7AA`
  - Primary 100: `#FFEEE5`
- **Neutral**:
  - Neutral 900: `#0F172A`
  - Neutral 700: `#334155`
  - Neutral 500: `#64748B`
  - Neutral 300: `#CBD5E1`
  - Neutral 200: `#E2E8F0`
  - Neutral 100: `#F1F5F9`
  - Neutral 50: `#FAFAFC`
  - White: `#FFFFFF`

### 02 & 03 Typography & Type Scale
- **Display 1**: Playfair Display, 48px / line-height 56px, Bold (700), Page titles
- **Display 2**: Playfair Display, 36px / line-height 44px, Bold (700), Section titles
- **Heading 1**: Inter, 28px / line-height 36px, Semi-Bold (600), Card titles
- **Heading 2**: Inter, 22px / line-height 30px, Semi-Bold (600), Sub section
- **Heading 3**: Inter, 18px / line-height 26px, Medium (500), Small titles
- **Body Large**: Inter, 16px / line-height 24px, Regular (400), Body copy
- **Body**: Inter, 14px / line-height 20px, Regular (400), Supporting text
- **Small**: Inter, 12px / line-height 16px, Regular (400), Captions / meta

### 04 Spacing System
- Base unit: 4px
- Steps: 4 (0.25rem), 8 (0.5rem), 12 (0.75rem), 16 (1rem), 24 (1.5rem), 32 (2rem), 40 (2.5rem), 48 (3rem), 64 (4rem)

### 05 Radius & Shadows
- **Radius**: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), full (9999px)
- **Shadows**:
  - `sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
  - `md`: `0 4px 12px -2px rgba(15, 23, 42, 0.08)`
  - `lg`: `0 12px 24px -4px rgba(15, 23, 42, 0.10)`
  - `xl`: `0 20px 40px -8px rgba(15, 23, 42, 0.12)`

### 06 - 13 Components & Patterns
- Buttons: Primary (orange fill), Secondary (orange outline/text), Tertiary (neutral border with external icon), Text (orange text with play icon).
- Inputs: 44px height, 12px radius, search icon, ⌘K badge, focus highlight.
- Badges & Status: VIDEO (orange badge), LESSON (blue badge), POPULAR (warm badge), In Progress, Completed, Now Playing, Locked.
- Progress Bar: 8px height, 35% fill demonstration with label.
- Cards: Course Card with meta stats, Video Lesson Card with timestamp action, Lesson Card with link, Resource Card with format/size.
- Navigation: Logo, nav links, Breadcrumbs, Pagination.

---

## Security Considerations
- Client-side safe: No secrets, private tokens, or credentials in client bundles.
- Accessible HTML semantics (`<nav>`, `<button>`, `<input>`, `<article>`, `aria-*` tags).

---

## Acceptance Criteria
- [ ] Tailwind theme configured with exact colors, shadows, radius, and font families.
- [ ] Google fonts `Playfair Display` and `Inter` loaded cleanly and rendered with exact scale specs.
- [ ] All UI components implemented with full variant and state coverage.
- [ ] Interactive showcase page faithfully displays all 14 design system sections.
- [ ] TypeScript compilation (`npm run build` / `tsc --noEmit`) passes without errors.
- [ ] Next.js linting (`npm run lint`) passes with zero errors.

---

## Checks to Run
1. `npm run lint` - Verify no linting errors.
2. `npm run build` - Verify clean production build and TypeScript type-checking.
3. Dev server verification of UI responsiveness and visual fidelity.

---

## Exact Manual Test Steps
1. Start dev server `npm run dev`.
2. Open `http://localhost:3000` in the browser.
3. Inspect Color swatches (Primary 500-100, Neutral 900-50, White).
4. Verify Typography section renders Playfair Display for Display 1/2 and Inter for Headings/Body/Small.
5. Verify Button interactions (Default, Hover, Disabled) across Primary, Secondary, Tertiary, and Text variants.
6. Test Input focus state and ⌘K badge.
7. Verify Badges and Status Indicators.
8. Verify Cards layout, badges, icons, and action triggers.
9. Verify Breadcrumbs, Pagination, and Header Navigation.
