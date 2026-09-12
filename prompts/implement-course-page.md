# Implementation Prompt: AI-LMS Course Page Implementation

## Goal
Implement the course detail page (`/courses/[slug]`) matching the design specification (`design/ailms-course.png`) with pixel-perfect visual fidelity, responsive layouts, exact typography hierarchy, interactive module accordion, sticky/floating progress bar, and complete data wiring from seeded Sanity content.

---

## Skills Read
- `AGENTS.md` (Project rules, boundaries, UI work guidelines, data model, and implementation loop)
- `.agents/skills/develop/SKILL.md` (UI track implementation principles and execution flow)
- `.agents/skills/sanity-best-practices/SKILL.md` (Content structure alignment, GROQ queries, and server presentation boundaries)

---

## Code Inspected
- `design/ailms-course.png`: Source of truth design reference.
- `app/courses/[slug]/page.tsx`: Current mock course page.
- `sanity/lib/queries.ts`: `COURSE_BY_SLUG_QUERY`, `COURSE_SLUGS_QUERY`, and `LESSON_BY_SLUG_QUERY`.
- `sanity/lib/data.ts`: `getCourseBySlug`, `getCourseSlugs`, `getAllCourses`.
- `sanity/schemaTypes/courseType.ts`, `moduleType.ts`, `lessonType.ts`, `learningOutcomeType.ts`: Course data model and schema fields.
- `components/ui/navbar.tsx`: Header navigation bar with Clerk user button.
- `components/ui/breadcrumbs.tsx`: Breadcrumb navigation component.
- `components/ui/button.tsx`: Button component variants.
- `components/ui/badge.tsx`: Badge variants (popular, video, lesson, neutral).
- `components/ui/icons.tsx`: Icon system and brand graphics.
- `studio/scripts/seed/seed.ndjson`: Live dataset content with seeded courses (`nextjs-app-router-in-depth`, `typescript-for-application-developers`, etc.).

---

## Decisions and Assumptions
1. **Server-Side Data Fetching & Dynamic Routing**:
   - `app/courses/[slug]/page.tsx` is an async Next.js Server Component fetching live course data via `getCourseBySlug(slug)`.
   - `generateStaticParams` queries `getCourseSlugs()` from Sanity for static pre-rendering.
   - Dynamic `generateMetadata` dynamically generates page title and description from course title and summary.
   - If a course slug does not exist in Sanity, handle fallback gracefully with `notFound()`.

2. **Hero Course Header**:
   - Left side: High-contrast course cover image or stylized brand logo container (e.g. Next.js "N" logo card or Sanity `coverImage` rendered with `urlForImage`), `rounded-[20px]`, `w-full max-w-[280px] sm:max-w-[320px] aspect-square`, with dark background.
   - Right side:
     - `POPULAR` badge (rendered if `course.popular` is true) with soft warm background `#FFEEE5` and orange text `#EA580C`.
     - Course title: Large bold Playfair Display serif font (`font-serif text-3xl sm:text-4xl md:text-[42px] font-bold text-[#0F172A] tracking-tight leading-[1.15]`).
     - Course summary/description: Inter font, `#475569`, text-base, leading-relaxed, max-w-2xl.
     - Meta badges row: Level (`BarChart2` icon + `Intermediate`), Duration (`Clock` icon + formatted total duration), Module Count (`FileText` icon + `X modules`), Student Count (`Users` icon + formatted `studentCount` e.g. `18.2k students`).
     - Action Buttons:
       - Primary orange CTA button: `Continue Learning ->` (or `Start Course`), linking directly to the first lesson of the course.
       - Secondary button: `Bookmark` button with `Bookmark` icon.

3. **What You'll Learn Section**:
   - Title: `What you'll learn` in Playfair Display serif font.
   - 2x2 Grid of cards (`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6`).
   - Each outcome card features:
     - Distinctive orange line-art icon mapped by outcome type (`layers`, `database`/`workflow`, `gauge`/`performance`, `cloud`/`rocket`, `shield`, `puzzle`, `code`, etc.).
     - Title in bold/semi-bold font (`text-[#0F172A] text-lg font-semibold`).
     - Description in `#64748B` (`text-sm leading-relaxed`).

4. **Course Content (Interactive Modules Accordion)**:
   - Header with `Course Content` on the left and `X modules • Yh Zm` summary on the right.
   - Interactive client component `CourseModulesAccordion`:
     - Each module row displays:
       - Number badge (e.g. `1`, `2`, `3` in circular badge `w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-sm text-[#0F172A]`).
       - Module title and summary.
       - Total module duration and expand/collapse chevron.
     - Expanding a module reveals its nested lesson items:
       - Play icon (`Play` icon).
       - Lesson title.
       - `Free Preview` badge if `isFreePreview` is true.
       - Lesson duration string.
       - Clickable link to the lesson page (`/courses/${course.slug.current}/lessons/${lesson.slug.current}` or `/lessons/${lesson.slug.current}`).
     - "Show all X modules" expand/collapse toggle button at the bottom.

5. **Sticky / Floating Bottom Progress Bar**:
   - Floating persistent progress container at the bottom:
     - Left: "Your Progress" label and "35% complete" text (**35%** bold).
     - Center: Clean rounded orange progress bar.
     - Right: Orange `Continue Learning ->` button.

6. **Bottom Horizon Graphic**:
   - Signature warm orange rising horizon aesthetic gradient graphic.

7. **Mobile Responsiveness**:
   - Responsive layout adapting smoothly down to 375px mobile viewports (stacking hero columns, responsive 2x2 grid to single column, responsive module list).

---

## Files to Touch / Create
- `prompts/implement-course-page.md` (This implementation prompt)
- `components/ui/icons.tsx` (Add any missing icons such as `Users`, `Gauge`, `Layers`, `Workflow`, `Cloud`, `Database`, `Shield`, `Puzzle`, `Code`, `Rocket`, etc.)
- `components/course/course-modules-accordion.tsx` (Client component for interactive module expansion & lesson links)
- `components/course/course-bottom-progress.tsx` (Floating bottom progress bar component)
- `components/course/outcome-icon.tsx` (Line-art orange icon renderer for learning outcomes)
- `app/courses/[slug]/page.tsx` (Full course detail page wired with Sanity data fetching)

---

## Security Considerations
- Read-only Sanity data fetching performed entirely on the server using `serverClient` / `sanityFetch` with the private read token. No API tokens or keys exposed to the client.
- Strict slug sanitization and dynamic route validation with Next.js `notFound()`.

---

## Requirements & Acceptance Criteria
- [ ] Next.js App Router dynamic page `/courses/[slug]` fetches real course data from Sanity.
- [ ] `generateStaticParams` pre-renders all published course slugs.
- [ ] Breadcrumbs correctly reflect `All Courses > [Course Title]`.
- [ ] Hero section reproduces exact visual layout: course cover/icon, POPULAR badge, serif title, summary, meta stats (level, duration, modules, student count), and action buttons.
- [ ] "What you'll learn" section renders 2x2 grid of outcome cards with styled orange icons, titles, and descriptions.
- [ ] "Course Content" section renders interactive module accordion with lesson listings, durations, and free preview badges.
- [ ] Bottom floating progress bar renders progress percentage, progress bar, and "Continue Learning" CTA.
- [ ] Bottom decorative horizon gradient graphic matches platform visual style.
- [ ] Full responsiveness across desktop, tablet, and mobile viewports.
- [ ] `npm run build` and `npm run lint` pass with zero errors.

---

## Checks to Run
1. `npm run lint` - Verify no ESLint errors.
2. `npm run build` - Verify TypeScript compilation, static parameter generation, and server bundle build.
3. Test `/courses/nextjs-app-router-in-depth` and other seeded courses in the browser.

---

## Exact Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000/courses/nextjs-app-router-in-depth` in the browser.
3. Verify Hero: Cover image/logo, POPULAR badge, Playfair Display title "Next.js App Router in Depth", summary, stats (Intermediate, total duration, 4 modules, 18.2k students), "Continue Learning ->" button, and "Bookmark" button.
4. Verify "What you'll learn": 2x2 grid with 4 cards (Model routes with layouts, Draw the server/client line, Control caching, Mutate with server actions) with orange icons and descriptions.
5. Verify "Course Content": 4 modules with lesson counts and durations. Click module accordions to expand and view lessons with duration and Free Preview badges.
6. Verify bottom progress bar with 35% completion and "Continue Learning ->" button.
7. Verify mobile layout responsiveness by resizing browser window to 375px.
