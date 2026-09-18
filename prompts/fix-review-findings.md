# Implementation Prompt: Address Code Review Findings for Search & Seeding

## Goal
Verify and resolve still-valid code review findings across the search API route, search library, and studio seeding scripts to improve error handling, prevent data leakage, optimize query execution, and adhere to strict grounding principles.

---

## Skills Read
- `AGENTS.md` (Grounding rules, error handling, token permissions, search behavior, and server boundaries)
- `.agents/skills/sanity-best-practices/SKILL.md` (GROQ queries, targeted projections, and error propagation)
- `.agents/skills/debug/SKILL.md` (Minimal surgical fixes and regression validation)

---

## Code Inspected & Finding Verification

1. **`app/api/search/route.ts` (Lines 48–54)**:
   - **Finding**: Search failure response returns exception-derived `error.message`, which could leak internal implementation details.
   - **Verification**: Confirmed valid. The catch block currently extracts `error.message` and returns it in the 500 JSON response.
   - **Fix**: Log the detailed error on the server with `console.error` and return a generic error payload `{ error: 'Search failed', message: 'An unexpected error occurred during search.' }` with status 500.

2. **`sanity/lib/search.ts` (Lines 258–270)**:
   - **Finding A**: `SEARCH_ALL_COURSES_TREE_QUERY` fetches the complete course tree and entire notes corpus on every search request instead of using targeted queries.
   - **Finding B**: Course/lesson query errors are masked with `.catch(() => [])` and video queries don't fail gracefully when all video searches fail.
   - **Verification**: Confirmed valid. `SEARCH_LESSONS_QUERY` is already defined in `queries.ts` to perform targeted matching on `$term` and `$wildcard`, returning only matched lessons with their parent course hierarchy. Course/lesson fetch failure should propagate, while video search should only fail if all video queries fail.
   - **Fix**:
     - Replace `SEARCH_ALL_COURSES_TREE_QUERY` with `SEARCH_LESSONS_QUERY` in `searchLearningPlatform`.
     - Let lesson/course search failure propagate properly. Throw when all video queries fail while preserving partial results if at least one video query succeeds.

3. **`sanity/lib/search.ts` (Lines 68–70) & `components/search/search-results-view.tsx`**:
   - **Finding**: `SearchOptions['sort']` exposes `'newest'`, but the sorting switch in `search.ts` has no branch for `'newest'`.
   - **Verification**: Confirmed valid. `SearchOptions` contains `'relevance' | 'duration' | 'newest'`, but only `'relevance'` and `'duration'` are handled.
   - **Fix**: Remove `'newest'` from `SearchOptions['sort']` and update `search-results-view.tsx` select options to align strictly to `'relevance'` (Most Relevant) and `'duration'` (Longest Duration).

4. **`studio/scripts/seed/seed-context.mjs` & `studio/scripts/seed/seed-videos.mjs`**:
   - **Finding**: Token resolution falls back to `SANITY_API_READ_TOKEN`, which lacks write permissions for mutations.
   - **Verification**: Confirmed valid. Mutation endpoints require write access (`SANITY_API_WRITE_TOKEN` or `SANITY_AUTH_TOKEN`).
   - **Fix**: Remove `SANITY_API_READ_TOKEN` fallback from write scripts and retain only `SANITY_API_WRITE_TOKEN` and `SANITY_AUTH_TOKEN`.

5. **`studio/scripts/seed/seed-videos.mjs` (Lines 159–168 & 192–207)**:
   - **Finding**: Fabricated timestamps and synthetic intervals are generated when source metadata lacks timing, violating grounding principles (Section 7).
   - **Verification**: Confirmed valid. `seed-videos.mjs` mathematically divides durations into arbitrary intervals for key points and notes.
   - **Fix**: Use only source-provided chapters and chunks from `videos.json` (or authentic source captions). If unavailable, do not generate synthetic timestamp intervals.

---

## Decisions and Assumptions
- Keep changes strictly minimal, touching only lines with verified findings.
- Preserve all existing UI layout, typography, and card components.
- Ensure all automated checks (`npx tsc --noEmit` and `npm run lint`) pass cleanly.

---

## Files to Touch
- `app/api/search/route.ts` [MODIFY] (Generic 500 error response)
- `sanity/lib/search.ts` [MODIFY] (Targeted lesson query, error propagation, align sort options)
- `components/search/search-results-view.tsx` [MODIFY] (Align sort options to `'relevance' | 'duration'`)
- `studio/scripts/seed/seed-context.mjs` [MODIFY] (Require write token)
- `studio/scripts/seed/seed-videos.mjs` [MODIFY] (Require write token, eliminate synthetic timestamps)

---

## Security Considerations
- Prevents internal error message leakage to client responses.
- Enforces strict write token checks on seeding mutation scripts.
- Protects search query execution from broad unneeded database fetches.

---

## Acceptance Criteria
1. `/api/search` returns `{ error: 'Search failed', message: 'An unexpected error occurred during search.' }` on uncaught server errors without leaking exception internals.
2. `searchLearningPlatform` executes targeted GROQ searches and propagates structural fetch errors.
3. `SearchOptions` and `search-results-view.tsx` sort options are in 1:1 parity (`'relevance' | 'duration'`).
4. Seeding scripts only accept write-capable tokens (`SANITY_API_WRITE_TOKEN` / `SANITY_AUTH_TOKEN`).
5. `seed-videos.mjs` does not fabricate synthetic timestamps.
6. TypeScript check (`npx tsc --noEmit`) and lint (`npm run lint`) pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- Verify `/api/search?q=data+fetching` returns valid structured data.

---

## Manual Test Steps
1. Request `/api/search?q=data+fetching` and verify search results render properly.
2. Test `/search?q=docker&sort=duration` to verify duration sort works.
3. Verify `npx tsc --noEmit` and `npm run lint` exit with code 0.
