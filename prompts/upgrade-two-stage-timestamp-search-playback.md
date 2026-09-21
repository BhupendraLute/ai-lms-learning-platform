# Implementation Prompt: Two-Stage Timestamp Search Resolution & On-Site Timestamped Playback

## Goal
Upgrade the search engine with two-stage timestamp resolution (chapters first, transcript fallback) and on-site timestamped video playback according to `AGENTS.md` (Sections 1, 7, 8, 9, 11, 12). Result cards will deep link to the lesson page at the exact matched second, and the embedded player will seek and play at that timestamp on site without redirecting learners elsewhere.

---

## Skills Read
- `AGENTS.md` (Sections 1, 5, 7, 8, 9, 11, 12, 13)
- `.agents/skills/create-agent-with-sanity-context/SKILL.md` (Sanity Context MCP and search integration)
- `.agents/skills/dial-your-context/SKILL.md` (Two-stage timestamp resolution instructions and content scoping)
- `.agents/skills/sanity-best-practices/SKILL.md` (GROQ projection, client/server boundaries, and typed schemas)

---

## Code Inspected
- `sanity/lib/search.ts`: Core search engine, multi-stage timestamp resolution, scoring algorithms, and search response formatting.
- `sanity/lib/queries.ts`: `SEARCH_LESSONS_QUERY`, `SEARCH_VIDEO_CHAPTERS_QUERY`, `SEARCH_VIDEO_CHUNKS_QUERY`.
- `components/lesson/lesson-video-player.tsx`: Embedded player component supporting YouTube, Vimeo, and Bunny with `startSeconds` handling and PostHog analytics.
- `components/search/video-result-card.tsx`: Video result card displaying thumbnail, duration/clip length, course icon, lesson breadcrumbs, and "Watch from MM:SS" CTA.
- `components/search/lesson-result-card.tsx`: Lesson result card displaying key points and module location.
- `components/search/search-results-view.tsx`: Search results layout with filter counts, sort controls, and unified results feed.
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx`: Lesson detail page handling `start` and `t` search params.
- `app/api/search/route.ts`: Server-side API endpoint for search with caching headers and PostHog event capture.

---

## Decisions and Assumptions

1. **Two-Stage Timestamp Resolution Engine (`sanity/lib/search.ts` & `sanity/lib/queries.ts`)**:
   - **Stage 1 (Chapters / Table of Contents - Primary)**:
     - Search matches `video.chapters[].label` via GROQ wildcard matching.
     - For each matched chapter, extract `startSeconds`, format timestamp (`MM:SS`), and compute `clipLength` by calculating the duration between the matched chapter and the subsequent chapter (or total video duration).
     - Assign `matchType: 'chapter'` and high relevance weight (+50–100 pts).
   - **Stage 2 (Transcript Chunks - Fallback)**:
     - Search matches `video.chunks[].text` via GROQ wildcard matching.
     - Enforce the fallback rule: If a lesson already has matched chapters for the query, transcript chunks for that lesson are suppressed to eliminate noisy duplicates.
     - If no chapters matched for that lesson, extract top matching chunks (capped at 2–3 per video), compute `startSeconds` and `formattedTimestamp`, calculate clip length, and assign `matchType: 'transcript'`.
   - **Topic & Lesson Merging**:
     - Also search lessons on topic (title, notes plain text `pt::text(notes)`, and key points).
     - Rank by specificity: Exact title match > Key points match > Chapter label match > Notes match > Transcript chunk match.

2. **Grounded Deep Linking (`components/search/video-result-card.tsx`)**:
   - Each video result card links directly to:
     `/courses/${courseSlug}/lessons/${lessonSlug}?start=${startSeconds}`
   - Action CTA explicitly reads `Watch from ${formattedTimestamp}` with a play icon.
   - Displays duration/clip badge on thumbnail and module numbering breadcrumb (e.g., `Lesson 5.1 in Data Fetching & Caching`).
   - Clicking tracks PostHog `search_result_opened` event with full metadata (`matchType`, `startSeconds`, `formattedTimestamp`, `position`).

3. **On-Site Timestamped Video Playback (`components/lesson/lesson-video-player.tsx`)**:
   - Embedded player supports YouTube, Vimeo, Bunny, and generic providers.
   - When `startSeconds > 0` (via deep link):
     - Automatically renders the embed with provider-specific start and autoplay parameters:
       - **YouTube**: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&start=${startSeconds}`
       - **Vimeo**: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0#t=${startSeconds}s`
       - **Bunny**: `${url}?autoplay=true&t=${startSeconds}`
     - If player is already loaded and `startSeconds` changes or user seeks, send postMessage commands (`seekTo` for YouTube, `setCurrentTime` for Vimeo) to seek directly without page reload.
     - Playback remains 100% on site; users are never redirected out to external platforms.

4. **Security & Performance**:
   - All Sanity queries execute strictly on the server using private dataset tokens.
   - Transcripts are never returned wholesale; only filtered chunks/chapters are retrieved.
   - URLs and parameters are sanitized with validation and fallback defaults.

---

## Files to Touch
- `sanity/lib/queries.ts`: Update `SEARCH_VIDEO_CHAPTERS_QUERY` and `SEARCH_VIDEO_CHUNKS_QUERY` to project complete chapter list for accurate clip duration calculations.
- `sanity/lib/search.ts`: Upgrade two-stage timestamp resolution, clip duration calculation, scoring rules, deduplication, and fallback handling.
- `components/lesson/lesson-video-player.tsx`: Enhance provider seek handling, autoplay on arrival with startSeconds, and dynamic seek updates.
- `components/search/video-result-card.tsx`: Ensure accurate clip length, timestamp badges, and deep link watch CTA formatting.
- `components/search/search-results-view.tsx`: Verify unified feed sorting and count statistics.

---

## Acceptance Criteria
- [x] Search resolves timestamps in two stages: chapters first, transcript chunks as fallback when no chapters match.
- [x] Clip length and timestamp are calculated accurately and displayed on video result cards.
- [x] Video result cards deep link to `/courses/[courseSlug]/lessons/[lessonSlug]?start=[startSeconds]`.
- [x] Video player on the lesson page embeds the provider player and automatically seeks/plays at `startSeconds`.
- [x] Playback stays entirely on site (no redirects to YouTube/Vimeo/Bunny).
- [x] Type check (`tsc --noEmit`), lint (`eslint`), and build (`next build`) pass cleanly with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `/search?q=caching`.
2. Verify video result cards appear with chapter matches, showing `Watch from MM:SS` and clip length.
3. Click a video result card (e.g. `Watch from 02:45`).
4. Verify navigation to `/courses/[slug]/lessons/[lessonSlug]?start=165`.
5. Verify the video player on the lesson page embeds the video and begins playback at 02:45 directly on the site.
6. Test search with transcript-only query terms and verify fallback to transcript chunks with timestamped deep links.
