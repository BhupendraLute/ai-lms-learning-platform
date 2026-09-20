# Implementation Prompt: Fix Review Findings for PostHog Analytics and Video Player

## 1. Goal
Address and resolve the 4 verified review findings:
1. Bind server-side search event capture to the request lifecycle in `app/api/search/route.ts` using Next.js `after()`.
2. Implement provider API postMessage playback tracking (YouTube, Vimeo, Bunny) in `components/lesson/lesson-video-player.tsx`, deriving milestones from reported current time and duration, with play/pause event handling and milestone deduplication.
3. Validate `response.ok` on the server-side PostHog capture fetch in `lib/analytics-server.ts` and throw on non-2xx status codes.
4. Standardize the `total_courses` property name across `lib/analytics.ts` and `components/course/catalog-view-tracker.tsx`.

---

## 2. Skills and Documentation Referenced
- `AGENTS.md` (Section 5: App structure, Section 7: Analytics decisions, Section 12: Private vs Public key rules)
- Next.js Server Functions & `after()` documentation (`next/server`)
- YouTube IFrame Player API postMessage protocol (`enablejsapi=1`, `onStateChange`, `infoDelivery`, `listening`)
- Vimeo Player Web postMessage protocol (`play`, `pause`, `timeupdate`, `ended`)
- Bunny Stream embed player message specifications

---

## 3. Code Inspected
- `app/api/search/route.ts`: Unawaited fire-and-forget `captureServerEvent` call in GET handler.
- `components/lesson/lesson-video-player.tsx`: Playback session monitor and iframe embed structure.
- `lib/analytics-server.ts`: Fetch request to `${host}/capture/`.
- `lib/analytics.ts`: `TrackCatalogViewedParams` interface and `trackCatalogViewed` emitting `total_courses_count`.
- `components/course/catalog-view-tracker.tsx`: Client tracking wrapper for catalog view.

---

## 4. Key Decisions & Assumptions
1. **Next.js Request Lifecycle (`after()`)**:
   Use `after()` imported from `next/server` in `app/api/search/route.ts` to schedule `captureServerEvent` cleanly after the HTTP response stream has been sent to the client, preventing unhandled background promise drops on serverless platforms.
2. **Provider API PostMessage Integration**:
   - For YouTube: Listen for `infoDelivery` (which supplies `currentTime`, `duration`, `playerState`) and `onStateChange` (1 = playing, 2 = paused, 0 = ended). Send `{"event":"listening"}` handshake on iframe load.
   - For Vimeo: Listen for `play`, `pause`, `ended`, and `timeupdate` (providing `seconds`, `duration`, `percent`). Send subscription messages on iframe load.
   - For Bunny / Generic: Listen for standard player message events and manage play/pause state transitions.
   - Calculate milestone percentages (`25%`, `50%`, `75%`, `90%`, `100%`) directly from reported `currentTime / duration`. Deduplicate using `milestonesFired` set so each milestone is sent at most once per lesson.
3. **Response Validation in Server Analytics**:
   In `lib/analytics-server.ts`, check `res.ok`. If not ok, throw `new Error(\`PostHog capture failed with HTTP status \${res.status} \${res.statusText}\`)`, allowing the surrounding catch block to log the failure in development without crashing user requests.
4. **Property Standardization**:
   Update `TrackCatalogViewedParams` to `{ totalCourses?: number }` and emit `{ total_courses: params.totalCourses }`. Update `CatalogViewTracker` and `app/courses/page.tsx` to match.

---

## 5. Files to Modify
- `app/api/search/route.ts` (Use Next.js `after()` for `captureServerEvent`)
- `components/lesson/lesson-video-player.tsx` (Provider API postMessage play/pause and time tracking)
- `lib/analytics-server.ts` (Validate `res.ok` and throw with status)
- `lib/analytics.ts` (Standardize `total_courses` in `TrackCatalogViewedParams`)
- `components/course/catalog-view-tracker.tsx` (Update to `totalCourses`)
- `app/courses/page.tsx` (Pass `totalCourses`)

---

## 6. Security Considerations
- Validate origins or message structures defensively in `window.addEventListener("message")` with JSON try/catch.
- Maintain private key / token boundaries on server-side tracking.

---

## 7. Acceptance Criteria
1. `app/api/search/route.ts` uses `after()` to execute `captureServerEvent`.
2. `LessonVideoPlayer` listens to postMessage events from YouTube, Vimeo, Bunny, starts/stops tracking on play/pause, and calculates milestones from reported player timestamps.
3. `captureServerEvent` validates `res.ok` and throws on HTTP errors.
4. `catalog_viewed` event payload uses `total_courses`.
5. `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass with 0 errors and 0 warnings.

---

## 8. Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## 9. Exact Manual Test Steps
1. Navigate to `/search?q=caching` -> verify `search_performed` is recorded via `after()` without delaying response.
2. Open `/courses` -> verify `catalog_viewed` event payload contains `total_courses`.
3. Open a lesson page with a YouTube / Vimeo video -> play video -> verify postMessage handshake logs `video_played` and milestone `video_watch_depth` events at 25%, 50%, 75%, 90%, 100%.
4. Pause video -> verify progress tracking pauses. Resume video -> verify tracking resumes without duplicate milestones.
