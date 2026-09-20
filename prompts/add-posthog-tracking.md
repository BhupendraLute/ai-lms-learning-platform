# Implementation Prompt: Add PostHog Tracking for AI-LMS Features

## 1. Goal
Implement comprehensive, production-grade PostHog event tracking across all AI-LMS features built to date, following PostHog's and Next.js best practices for event naming, property schemas, and client/server boundaries without tracking PII beyond the Clerk user ID.

---

## 2. Skills and Documentation Referenced
- `AGENTS.md` (Section 5: App structure, Section 6: Tech stack, Section 7: Analytics decisions, Section 12: Private vs Public key rules)
- `node_modules/next/dist/docs/` (Client vs Server component boundaries, Route Handlers)
- PostHog Next.js and Web Analytics best practice guidelines (event naming conventions `object_action`, snake_case properties, client vs server capture).

---

## 3. Code Inspected
- `instrumentation-client.ts` & `components/posthog-identity.tsx`: Initial client-side PostHog setup and Clerk user identity synchronization.
- `app/layout.tsx`: Root layout hosting ClerkProvider and PostHogIdentity.
- `components/search/search-results-view.tsx`, `components/search/video-result-card.tsx`, `components/search/lesson-result-card.tsx`: Search queries, filtering, sorting, and result interaction cards.
- `app/api/search/route.ts` & `sanity/lib/search.ts`: Grounded search execution and API route handler.
- `components/lesson/lesson-video-player.tsx`: Multi-provider video embeds (YouTube, Vimeo, Bunny) with timestamp seeking.
- `components/lesson/lesson-bottom-nav.tsx`: Lesson completion and next/previous progression.
- `components/lesson/lesson-sidebar.tsx`, `components/lesson/lesson-tabs.tsx`, `components/lesson/lesson-resources.tsx`, `components/lesson/lesson-bookmark-button.tsx`: In-lesson user engagement elements.
- `components/course/course-bottom-progress.tsx`, `components/course/course-modules-accordion.tsx`, `app/courses/[slug]/page.tsx`: Course detail and resume progression triggers.
- `app/my-learning/page.tsx`: Learner dashboard and resume learning affordance.
- `components/home/hero-search-bar.tsx` & `app/page.tsx`: Home hero search and course discovery.
- `app/courses/page.tsx`: Catalog browsing view.

---

## 4. Key Decisions & Assumptions
1. **Unified, Type-Safe Analytics Layer**:
   Create a centralized analytics utility `lib/analytics.ts` for client components with strict TypeScript types for every event name and its properties. This eliminates code duplication, prevents typos, and ensures defensive checks (no-ops when PostHog is not initialized or tokens are absent).
2. **Server-Side Tracking Utility**:
   Create `lib/analytics-server.ts` for capturing server-side events (such as direct Search API invocations) using the PostHog REST Capture API with the project token, safely handling errors without blocking request threads.
3. **Event Naming Conventions**:
   Follow PostHog's standard `[object]_[action]` convention in snake_case:
   - Search: `search_performed`, `search_result_opened`
   - Video: `video_played`, `video_watch_depth`
   - Progress & Completion: `resume_used`, `lesson_completed`
   - Engagement & Page Views: `catalog_viewed`, `course_viewed`, `lesson_viewed`, `lesson_resource_clicked`, `lesson_tab_switched`, `lesson_bookmark_toggled`, `course_module_toggled`
4. **Privacy & PII Protection**:
   Strictly avoid sending raw user emails or PII in custom event properties. User identification is already isolated to Clerk user ID via `PostHogIdentity`.
5. **Video Playback & Watch Depth Tracking**:
   - `video_played`: Tracked when the learner clicks the play button or when the player autoplays from a deep-linked timestamp.
   - `video_watch_depth`: Tracked at key milestones (25%, 50%, 75%, 90%, 100%) through an active playback session monitor in `LessonVideoPlayer`, tracking duration and percentage watched.

---

## 5. Files to Create and Modify

### New Files
- `lib/analytics.ts` (Type-safe client analytics helper with methods for all events)
- `lib/analytics-server.ts` (Server-side PostHog capture utility for route handlers)

### Modified Files
- `components/search/search-results-view.tsx` (Wire `trackSearchPerformed`)
- `components/search/video-result-card.tsx` (Wire `trackSearchResultOpened` with video metadata and timestamp)
- `components/search/lesson-result-card.tsx` (Wire `trackSearchResultOpened` with lesson metadata)
- `components/home/hero-search-bar.tsx` (Track search query submission)
- `components/lesson/lesson-video-player.tsx` (Wire `trackVideoPlayed` and milestone `trackVideoWatchDepth`)
- `components/lesson/lesson-bottom-nav.tsx` (Wire `trackLessonCompleted` and navigation)
- `components/course/course-bottom-progress.tsx` (Wire `trackResumeUsed`)
- `app/courses/[slug]/page.tsx` & `components/course/course-hero-cover.tsx` (Wire `trackResumeUsed` and `trackCourseViewed`)
- `app/my-learning/page.tsx` (Wire `trackResumeUsed`)
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` (Wire `trackLessonViewed`)
- `app/courses/page.tsx` (Wire `trackCatalogViewed`)
- `components/lesson/lesson-resources.tsx` (Wire `trackResourceClicked`)
- `components/lesson/lesson-tabs.tsx` (Wire `trackLessonTabSwitched`)
- `components/lesson/lesson-bookmark-button.tsx` (Wire `trackLessonBookmarkToggled`)
- `app/api/search/route.ts` (Wire server-side search tracking)

---

## 6. Detailed Requirements & Property Schemas

### 1. `search_performed`
- **Properties**:
  - `query` (string)
  - `total_results` (number)
  - `courses_count` (number)
  - `video_results_count` (number)
  - `lesson_results_count` (number)
  - `sort` (string: "relevance" | "duration")
  - `has_results` (boolean)
  - `source` (string: "search_page" | "hero_search" | "api")

### 2. `search_result_opened`
- **Properties**:
  - `query` (string)
  - `result_type` ("video" | "lesson")
  - `match_type` ("chapter" | "transcript" | "topic" | "title")
  - `course_slug` (string)
  - `course_title` (string)
  - `lesson_slug` (string)
  - `lesson_title` (string)
  - `start_seconds` (number, optional for video)
  - `formatted_timestamp` (string, optional for video)
  - `destination_url` (string)

### 3. `video_played`
- **Properties**:
  - `course_slug` (string)
  - `lesson_slug` (string)
  - `lesson_title` (string)
  - `video_url` (string)
  - `start_seconds` (number)
  - `is_autoplay` (boolean)
  - `provider` ("youtube" | "vimeo" | "bunny" | "generic")

### 4. `video_watch_depth`
- **Properties**:
  - `course_slug` (string)
  - `lesson_slug` (string)
  - `lesson_title` (string)
  - `depth_percentage` (number: 25 | 50 | 75 | 90 | 100)
  - `seconds_watched` (number)
  - `video_duration_seconds` (number)
  - `provider` (string)

### 5. `resume_used`
- **Properties**:
  - `course_slug` (string)
  - `lesson_slug` (string, optional)
  - `progress_percentage` (number)
  - `source` ("course_bottom_bar" | "course_hero" | "my_learning" | "sidebar")

### 6. `lesson_completed`
- **Properties**:
  - `course_slug` (string)
  - `lesson_slug` (string)
  - `lesson_title` (string)
  - `next_lesson_slug` (string, optional)
  - `is_course_completed` (boolean)
  - `source` ("bottom_nav_next" | "bottom_nav_complete")

### 7. Core Views & Interactions
- `catalog_viewed`: `{ total_courses: number }`
- `course_viewed`: `{ course_slug: string, course_title: string, level: string, module_count: number }`
- `lesson_viewed`: `{ course_slug: string, lesson_slug: string, lesson_title: string, module_index: number, lesson_index: number, start_seconds: number }`
- `lesson_resource_clicked`: `{ lesson_slug: string, resource_title: string, resource_type: string, resource_url: string }`
- `lesson_tab_switched`: `{ lesson_slug: string, tab: "content" | "notes" }`
- `lesson_bookmark_toggled`: `{ lesson_slug: string, lesson_title: string, bookmarked: boolean }`

---

## 7. Security Considerations
- Keep server-side PostHog private keys off client bundles.
- Only expose `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to the browser.
- No user emails, passwords, or personal identity details in event property payloads.

---

## 8. Acceptance Criteria
1. Search queries performed via search input, URL params, or hero search bar fire `search_performed` with query and result counts.
2. Clicking video cards and lesson cards fires `search_result_opened` with result type, course slug, and timestamp.
3. Initiating video playback fires `video_played` with provider and start time.
4. Video playback session records milestone progress firing `video_watch_depth` at 25%, 50%, 75%, 90%, and 100%.
5. Clicking "Continue Learning" or "Resume Learning" across the course page, progress bar, or My Learning fires `resume_used`.
6. Clicking "Next Lesson" or "Complete Course" fires `lesson_completed`.
7. Page views, resource clicks, bookmark toggles, and tab switches fire properly typed events.
8. `npm run build` and TypeScript check pass cleanly with 0 errors.

---

## 9. Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Manual inspection of events in development console.

---

## 10. Exact Manual Test Steps
1. Open `/` and type "data fetching" in the hero search bar -> submit search.
2. Verify `search_performed` is logged with query, counts, and sort order.
3. Click a video result card (e.g. "Fetching in Server Components" at 02:40) -> verify `search_result_opened` with `result_type: "video"`, `start_seconds: 160`.
4. On the lesson page, observe video player -> click play button -> verify `video_played` is captured. Let video run or simulate duration progress -> verify `video_watch_depth` milestone events.
5. Click "Next Lesson" at the bottom -> verify `lesson_completed` is captured with current and next lesson slugs.
6. Return to `/courses/nextjs-for-production` -> click "Continue Learning" on the bottom progress bar -> verify `resume_used` is captured.
7. Open `/my-learning` -> click "Resume Learning" -> verify `resume_used` with `source: "my_learning"`.
8. Click "Notes" tab and click an external resource link -> verify `lesson_tab_switched` and `lesson_resource_clicked` events.
