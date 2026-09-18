# Implementation Prompt: AI-LMS Search Page

## Goal
Implement the AI-LMS intelligent search results page (`/search`) replicating the exact visual design from `design/ailms-search.png` and wired to live Sanity content and the grounded search engine (`sanity/lib/search.ts` / `/api/search`).

---

## Skills Read
- `AGENTS.md` (Sections 1–14: Search behavior, grounded results, video moment links with timestamps, PostHog analytics, responsive mobile layout, server/client boundaries)
- `.agents/skills/create-agent-with-sanity-context/SKILL.md` (Sanity Context MCP connection, `/initial-context` caching, tool calling, and Vercel AI SDK integration)
- `.agents/skills/dial-your-context/SKILL.md` (Sanity Context query guidance and content filters)
- `.agents/skills/shape-your-agent/SKILL.md` (System prompt boundaries and grounding)
- `.agents/skills/sanity-best-practices/SKILL.md` (GROQ queries, schema relationships, image URLs, and Next.js integration)
- `.agents/skills/portable-text-serialization/SKILL.md` (Portable text handling and plain text projections)

---

## Code Inspected
- `design/ailms-search.png`: Source-of-truth visual design showing header, search results pill, heading (`Results for "data fetching"` in serif and orange highlight), count subtitle, interactive search bar with `⌘ K`, result counter and sort dropdown (`Most Relevant`), video result cards with start timestamps and thumbnails, lesson result cards with key points block, and bottom "Can't find what you're looking for?" CTA banner.
- `sanity/lib/search.ts`: Grounded multi-path search engine supporting video chapters (Stage 1), transcript chunks (Stage 2), lesson topic matching, relevance scoring, and course categorization.
- `app/api/search/route.ts`: Server-side search API endpoint returning structured video and lesson results with statistics.
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` & `components/lesson/lesson-video-player.tsx`: Lesson playback page and video player supporting `?start=[seconds]` timestamp seeking.
- `components/home/hero-search-bar.tsx`: Homepage search bar with `⌘ K` listener.
- `components/ui/navbar.tsx` & `components/ui/icons.tsx`: App navigation and icon primitives.
- `instrumentation-client.ts`: PostHog analytics configuration.

---

## Decisions and Assumptions

1. **Route Structure (`app/search/page.tsx` & `components/search/search-results-view.tsx`)**:
   - `app/search/page.tsx`: Server component that parses `searchParams` (`q`, `sort`, `limit`), fetches search results on the server via `searchLearningPlatform(q, { sort })` for immediate SSR and SEO, and passes initial data to the interactive client view.
   - `components/search/search-results-view.tsx`: Rich interactive client component managing:
     - Real-time search query input and debounced navigation.
     - Global `⌘ K` / `Ctrl+K` keyboard shortcut to focus the search bar.
     - Sort selection (`Most Relevant`, `Duration: Longest`, `Duration: Shortest`).
     - PostHog event instrumentation (`search_performed`, `search_result_clicked`).

2. **Visual Fidelity (Matching `design/ailms-search.png`)**:
   - **Header**: Standard `Navbar activePath="/courses"` with AI-LMS logo, navigation links, notification bell, and Clerk UserButton / sign-in button.
   - **Badge**: `SEARCH RESULTS` capsule pill (`bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] text-xs font-semibold px-3.5 py-1 rounded-full tracking-wider uppercase`).
   - **Heading**: `Results for "<query>"` with serif typography (`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A]`) with query highlighted in vibrant orange (`#EA580C`).
   - **Subtitle**: `Found X results across Y courses` (`text-[#64748B] text-sm sm:text-base mt-2`).
   - **Search Bar**: Large rounded input (`rounded-2xl border border-[#E2E8F0] bg-white shadow-sm h-14 pl-12 pr-16`) with search icon and `⌘ K` badge.
   - **Controls Bar**: Result count display on left (`X results`), sort select dropdown on right (`Most Relevant` with down chevron).
   - **Video Result Card**:
     - Left: 16:9 thumbnail preview with dark background, frosted glass center Play icon button, and bottom-right duration badge (`12:45`).
     - Right: Course badge/icon (Next.js `[N]`, React `[⚛]`, Node.js `[⬡]`, JS `[JS]`, etc.) + Course title (`Next.js for Production`) with `VIDEO` tag on right (`bg-[#FFF1F2] text-[#E11D48]` or `bg-[#FFEDD5] text-[#EA580C]`).
     - Title: Bold lesson title (`Data Fetching in Server Components`).
     - Description: Clear 2-line summary.
     - Footer: Document icon + `Lesson 5.1` • Folder icon + `Data Fetching & Caching` on left, and orange `Watch from 12:45 >` link on right.
     - Links to: `/courses/[courseSlug]/lessons/[lessonSlug]?start=[startSeconds]`.
   - **Lesson Result Card**:
     - Left: Key points container (`bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4`) displaying bullet list of lesson key concepts with dark checkmark circle badge at bottom-right.
     - Right: Course badge/icon + Course title with `LESSON` tag on right (`bg-[#EEF2FF] text-[#4F46E5]`).
     - Title: Bold lesson title (`Data Fetching & Caching`).
     - Description: Lesson overview summary.
     - Footer: `Module 5` on left, and orange `View lesson ↗ >` link on right.
     - Links to: `/courses/[courseSlug]/lessons/[lessonSlug]`.
   - **Bottom CTA Card**:
     - `Can't find what you're looking for?`
     - Orange circular search icon, prompt text, and `Browse all courses ->` button linking to `/courses`.
   - **Empty State**:
     - Clean, encouraging empty state when a search has 0 results, offering search tips and quick links to popular topics (Next.js, Docker, TypeScript, React, Node.js).

3. **Global Search Integration**:
   - Update `components/home/hero-search-bar.tsx` to submit form / navigate to `/search?q=...` on Enter.
   - Ensure all search entry points seamlessly connect to the search results page.

4. **Analytics Instrumentation (PostHog)**:
   - Capture `search_performed` with `{ query, total_results, courses_count }`.
   - Capture `search_result_clicked` with `{ query, result_type: 'video' | 'lesson', lesson_slug, course_slug, start_seconds }`.

---

## Files to Touch / Create
- `prompts/implement-search-page.md` (This implementation prompt)
- `app/search/page.tsx` [NEW] (Search route server component with metadata, SSR data fetching, and layout)
- `components/search/search-results-view.tsx` [NEW] (Main interactive search client component with query state, sort, and PostHog capture)
- `components/search/video-result-card.tsx` [NEW] (Video moment result card with thumbnail, play overlay, course icon, timestamps, and deep link)
- `components/search/lesson-result-card.tsx` [NEW] (Lesson topic result card with key points block, check badge, and course navigation)
- `components/search/course-icon-badge.tsx` [NEW] (Course technology icons: Next.js, React, Node.js, JS, Docker, TypeScript, Python, AI)
- `components/home/hero-search-bar.tsx` [MODIFY] (Connect hero search input to navigate to `/search?q=...`)

---

## Security Considerations
- All Sanity data access remains server-side via `searchLearningPlatform` and `serverClient`.
- Client components only receive sanitized search result objects; no Sanity tokens or internal API keys are exposed.
- User input is sanitized and sliced to prevent oversized query strings or injection attacks.

---

## Acceptance Criteria
1. Navigating to `/search?q=data+fetching` renders the page matching `design/ailms-search.png` exactly in layout, typography, colors, and badge styles.
2. Video result cards render with accurate video duration, thumbnail, start timestamp (e.g. `Watch from 12:45 >`), and link to the lesson with `?start=[seconds]`.
3. Lesson result cards render with the key points list container, check circle, course badges, and direct lesson links.
4. Search input allows typing new queries and updates the results seamlessly.
5. Sort dropdown works (`Most Relevant`, `Duration: Longest`, `Duration: Shortest`).
6. Bottom "Can't find what you're looking for?" CTA card correctly links to `/courses`.
7. Responsive mobile layout stacks columns cleanly while preserving desktop perfection.
8. TypeScript check (`npx tsc --noEmit`) and lint pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit` (TypeScript type check across web workspace)
- `npm run lint` (ESLint validation)
- Browser validation of `/search?q=data+fetching` and empty search states.

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/search?q=data+fetching`:
   - Verify header shows `SEARCH RESULTS` pill and `Results for "data fetching"` with orange highlighted search term.
   - Verify result count and course count display (e.g. `Found X results across Y courses`).
   - Verify video result cards show course icon, `VIDEO` badge, description, lesson/module meta, and `Watch from MM:SS >`.
   - Verify lesson result cards show key points list, dark checkmark badge, `LESSON` badge, and `View lesson ↗ >`.
2. Click `Watch from MM:SS >` on a video result:
   - Verify it navigates to `/courses/[slug]/lessons/[lessonSlug]?start=[seconds]` and the video player starts at the exact second.
3. Test search bar interaction:
   - Type `docker` and hit Enter -> verifies results update to Docker lessons and video moments.
   - Press `⌘ K` / `Ctrl+K` -> verifies search input receives focus.
4. Test empty search query:
   - Search for `nonexistentxyz123` -> verifies empty state with tips and link to catalog.
5. Click "Browse all courses" on the bottom CTA card -> verifies navigation to `/courses`.
