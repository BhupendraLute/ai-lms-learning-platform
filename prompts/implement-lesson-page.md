# Implementation Prompt: AI-LMS Lesson Page Implementation

## Goal
Implement the lesson detail page (`/courses/[slug]/lessons/[lessonSlug]` and `/lessons/[lessonSlug]`) matching the design reference (`design/ailms-lesson.png`) with pixel-perfect visual fidelity, responsive two-column layout, embedded video player (YouTube/Vimeo/Bunny) supporting start time query params, interactive module/lesson sidebar, tabs (Lesson Content with rich Portable Text and Notes), key points, pro tips, resource cards, and bottom previous/next lesson navigation, fully wired to Sanity content.

---

## Skills Read
- `AGENTS.md` (Project rules, boundaries, UI work guidelines, video embedding, and data model)
- `.agents/skills/sanity-best-practices/SKILL.md` (Schema, GROQ queries, Portable Text, and data fetching)
- `.agents/skills/portable-text-serialization/SKILL.md` (Rendering Portable Text in Next.js)
- `.agents/skills/develop/SKILL.md` (UI track implementation principles and execution flow)

---

## Code Inspected
- `design/ailms-lesson.png`: Source of truth design reference.
- `sanity/schemaTypes/lessonType.ts`, `courseType.ts`, `moduleType.ts`, `resourceType.ts`: Schema structures for lessons, modules, and courses.
- `sanity/lib/queries.ts` & `sanity/lib/data.ts`: Existing GROQ queries (`LESSON_BY_SLUG_QUERY`, `COURSE_BY_SLUG_QUERY`, `LESSON_SLUGS_QUERY`) and data fetchers (`getLessonBySlug`, `getCourseBySlug`).
- `studio/scripts/seed/seed.ndjson`: Real dataset content with lessons, module hierarchies, video URLs, key points, notes, pro tips, and resources.
- `app/courses/[slug]/page.tsx`: Course page structure, breadcrumbs, and metadata patterns.
- `components/course/course-modules-accordion.tsx`: Module accordion logic and duration calculations.
- `components/ui/`: Navbar, breadcrumbs, badges, buttons, and icon library.

---

## Decisions and Assumptions
1. **Routing & Server Data Fetching**:
   - Primary route: `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` (Next.js Server Component).
   - Compatibility route: `app/lessons/[slug]/page.tsx` for direct lesson slug access (resolving the parent course and redirecting or rendering seamlessly).
   - `generateStaticParams` pre-renders all published course-lesson combinations from Sanity.
   - Dynamic `generateMetadata` dynamically generates page title, Open Graph description, and keywords.
   - `getLessonBySlug` fetches the lesson, its parent course, modules, flat lesson order, previous lesson, and next lesson.
   - Graceful fallback: handles alias for `nextjs-for-production` to `nextjs-app-router-in-depth` to guarantee perfect previewing of design reference data.

2. **Left Sidebar (`LessonSidebar`)**:
   - "Back to course" link (`/courses/[courseSlug]`) with small arrow.
   - Course card with dark rounded thumbnail / cover image, course title, and progress percentage indicator ("35% complete" with progress bar).
   - Header: "Module X of Y".
   - Vertical module list:
     - Completed previous modules show an orange checkmark circle (`CheckCircle2`).
     - Active module is expanded, highlighting the module number in a solid orange circle, module title, total duration, and chevron up.
     - Active module renders an interconnected vertical timeline of lessons:
       - Active lesson has a solid orange node, bold title, "Now playing" subtext in orange `#EA580C`, and an orange play icon button.
       - Other lessons show hollow circle nodes, title, duration, and link to `/courses/[courseSlug]/lessons/[lessonSlug]`.
     - Subsequent modules are collapsed with chevron down and can be toggled interactively.
   - Fully responsive: on mobile/tablet viewports, an expandable/collapsible drawer allows effortless sidebar access without cluttering the screen.

3. **Video Player (`LessonVideoPlayer`)**:
   - Embedded video player adhering strictly to Section 7 & 9 of `AGENTS.md` (no custom player, provider embeds on-site).
   - Detects YouTube, Vimeo, Bunny, or direct video URLs.
   - Embeds responsive `16:9` iframe player with provider parameters (`autoplay=1`, `enablejsapi=1`, etc.).
   - Supports timestamp seeking via query parameter `?t=123` or `?start=123` (used when arriving from intelligent search results).
   - Fallback poster container if video URL is missing or pending.

4. **Lesson Header & Breadcrumbs**:
   - Breadcrumbs: `All Courses > [Course Title] > [Module Title] > [Lesson Title]`.
   - Orange badge: `LESSON X.Y` (e.g. `LESSON 5.1`).
   - Lesson title: bold Playfair Display serif font (`font-serif text-3xl sm:text-4xl md:text-[42px] font-bold text-[#0F172A] tracking-tight`).
   - Interactive Bookmark button on the top right.
   - Lesson summary/subtitle.
   - Meta stats row: Duration (`Clock`), Level (`BarChart2`), Students (`Users`).

5. **Tabs & Content (`LessonTabs` & `LessonNotesPortableText`)**:
   - Tab switcher: `Lesson Content` (active default) and `Notes`.
   - **Lesson Content**:
     - `Overview`: Rich text lesson notes rendered with `PortableText` and styled typography for headings, paragraphs, code blocks, lists, and quotes.
     - `In this lesson you will`: Key points list with orange checkmark circle bullet icons.
     - `Pro Tip`: Warm light orange callout box with lightbulb icon, bold "Pro Tip" header, and tip text.
     - `Resources`: Multi-column grid of resource cards (Documentation, GitHub, Article, Tool) with icons, title, description, and external link arrow.
   - **Notes Tab**:
     - Interactive presentational note-taking area with local storage persistence and quick takeaways.

6. **Bottom Navigation (`LessonBottomNav`)**:
   - Previous Lesson button (left): "<- Previous Lesson" with title and duration of the preceding lesson.
   - Next Lesson button (right): "Next Lesson ->" with title and duration of the following lesson in vibrant orange.

7. **PostHog Analytics Instrumentation**:
   - Captures `lesson_viewed`, `lesson_tab_changed`, `lesson_video_started`, and `lesson_navigated` events with standard parameters.

---

## Files to Touch / Create
- `prompts/implement-lesson-page.md` (This implementation prompt)
- `sanity/lib/queries.ts` (Update `LESSON_BY_SLUG_QUERY` with `coverImage`, `level`, `studentCount`, `summary` on modules, and `coalesce` for `isFreePreview`)
- `components/ui/icons.tsx` (Export `Lightbulb`, `Github`, `RotateCcw`, `Maximize`, etc.)
- `components/lesson/lesson-video-player.tsx` (Provider video embed component supporting timestamp seeking)
- `components/lesson/lesson-sidebar.tsx` (Client component for interactive module/lesson sidebar and mobile drawer)
- `components/lesson/lesson-notes-portable-text.tsx` (Portable Text renderer with custom styled blocks)
- `components/lesson/lesson-tabs.tsx` (Client component for tab switching between Lesson Content and Notes)
- `components/lesson/lesson-resources.tsx` (Resource cards component)
- `components/lesson/lesson-bottom-nav.tsx` (Previous/Next lesson navigation footer)
- `components/lesson/lesson-bookmark-button.tsx` (Interactive bookmark toggle button)
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` (Full lesson page implementation wired to Sanity)
- `app/lessons/[slug]/page.tsx` (Direct lesson route resolving parent course and redirecting/rendering)

---

## Security Considerations
- Read-only Sanity data fetching performed entirely on the server using `serverClient` with private tokens. No API tokens or keys exposed to the client.
- Video iframe embeds use standard sanitized provider embed URLs with `sandbox` attributes where appropriate.
- Route parameters are sanitized and validated with Next.js `notFound()`.

---

## Requirements & Acceptance Criteria
- [ ] Next.js App Router dynamic page `/courses/[slug]/lessons/[lessonSlug]` renders real data from Sanity.
- [ ] `generateStaticParams` pre-renders all published course-lesson routes.
- [ ] Breadcrumbs accurately show `All Courses > [Course Title] > [Module Title] > [Lesson Title]`.
- [ ] Left sidebar reproduces exact design: "Back to course" link, course cover + title + progress bar, "Module X of Y", module list with completed checkmarks, expanded active module with vertical timeline, "Now playing" indicator, and lesson links.
- [ ] Video player renders provider iframe embed (YouTube/Vimeo/Bunny) with aspect-video container and start seconds support.
- [ ] Lesson header displays orange `LESSON X.Y` pill, Playfair Display title, summary, meta stats (duration, level, student count), and bookmark button.
- [ ] "Lesson Content" tab displays Overview (Portable Text), "In this lesson you will" key points with orange checkmarks, "Pro Tip" callout box, and "Resources" grid with link icons.
- [ ] "Notes" tab displays interactive presentational learner notes.
- [ ] Bottom navigation provides Previous Lesson and Next Lesson buttons with titles and durations.
- [ ] Responsive down to 375px mobile viewports with collapsible module navigation.
- [ ] `npm run build` and `npm run lint` pass with zero errors.

---

## Checks to Run
1. `npm run lint` - Verify no ESLint errors.
2. `npm run build` - Verify TypeScript compilation, static parameter generation, and server bundle build.
3. Verify `/courses/nextjs-app-router-in-depth/lessons/nextjs-app-router-in-depth-fetching-in-server-components` in the browser.

---

## Exact Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000/courses/nextjs-app-router-in-depth/lessons/nextjs-app-router-in-depth-fetching-in-server-components`.
3. Verify Breadcrumbs: `All Courses > Next.js App Router in Depth > Data Fetching and Caching > Fetching data in server components`.
4. Verify Sidebar: Course thumbnail, "Next.js App Router in Depth", progress bar, Module 3 expanded with active lesson highlighted, previous modules with checkmarks.
5. Verify Video Player: YouTube video embed loads and plays directly on the page.
6. Verify Lesson Header: `LESSON 3.1` badge, Playfair Display title, summary, meta stats (duration, Intermediate, student count), and bookmark button.
7. Verify Tabs: Toggle between "Lesson Content" and "Notes".
8. Verify "Lesson Content": Overview text rendered with rich typography, "In this lesson you will" list with orange checkmarks, "Pro Tip" box, and "Resources" cards.
9. Verify Bottom Navigation: Previous lesson ("Passing data across the boundary") and Next lesson ("Caching and revalidation") with links.
10. Test responsive mobile drawer on small screens (<768px).
