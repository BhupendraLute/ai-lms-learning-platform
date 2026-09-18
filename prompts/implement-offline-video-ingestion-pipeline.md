# Implementation Prompt: Offline Video Ingestion Pipeline

## Goal
Implement a robust, modular, and production-grade offline video ingestion pipeline for AI-LMS that builds Sanity `video` documents with timestamped transcript chunks and table-of-contents chapter markers across YouTube, Vimeo, and Bunny video providers. Ensure both ingestion and in-browser seek/playback support for all 3 providers per `AGENTS.md` (Sections 5, 7, 8, 9, 11, 12, 13).

---

## Skills Read
- `AGENTS.md` (Section 5 Architecture Boundaries, Section 7 Grounded Decisions, Section 8 Content Model, Section 9 Video Transcript & Chapter Ingestion, Section 11 Search Behavior, Section 12 Gotchas, Section 13 Checks)
- `.agents/skills/sanity-best-practices/SKILL.md` (Schema definitions, GROQ queries, document mutations, typegen)
- `.agents/skills/sanity-migration/SKILL.md` (Deterministic IDs, `createOrReplace` batch mutations, validation, idempotent migration workflows)
- `.agents/skills/create-agent-with-sanity-context/SKILL.md` (Two-stage timestamp resolution, chapter vs transcript chunk querying)
- `.agents/skills/dial-your-context/SKILL.md` (Context document querying rules over video chapters and chunks)

---

## Code Inspected
- `sanity/schemaTypes/videoType.ts` & `studio/schemaTypes/videoType.ts`: Sanity `video` document schema (`id`, `url`, `title`, `duration`, `chapters` array with `{ startSeconds, label }`, `chunks` array with `{ startSeconds, text }`).
- `sanity/lib/queries.ts`: `SEARCH_VIDEO_CHAPTERS_QUERY` and `SEARCH_VIDEO_CHUNKS_QUERY` demonstrating how the search engine queries video documents.
- `components/lesson/lesson-video-player.tsx`: In-browser lesson embed player handling YouTube, Vimeo, and Bunny playback and timestamp seeking.
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx`: Lesson detail page passing `startSeconds` query param (`?start=` or `?t=`) to `LessonVideoPlayer`.
- `studio/scripts/seed/seed-videos.mjs` & `studio/scripts/seed/videos.json`: Existing video seeding reference data for 120 lessons.
- `.env.local` & `studio/.env.local`: Sanity project credentials (`SANITY_API_READ_TOKEN`, project ID `oxyuqwfg`, dataset `production`).
- `package.json` & `studio/package.json`: Root and Studio workspace scripts.

---

## Decisions and Assumptions

1. **Pipeline Architecture & Location (Offline Tooling)**:
   - In accordance with `AGENTS.md` Section 5, the video pipeline is offline tooling that never runs in the web request path.
   - Create a clean, modular pipeline under `studio/scripts/video-ingestion/`:
     - `parsers/caption-parser.mjs`: Parses WebVTT (`.vtt`) and SubRip (`.srt`) files/cues, normalizes timestamps into seconds, and aggregates short lines into coherent 15–45 second semantic transcript chunks.
     - `parsers/chapter-parser.mjs`: Parses timestamped chapter text (e.g. `00:00 Intro`, `02:15 Architecture`), VTT chapter tracks, and falls back to structured lesson key points.
     - `providers/youtube.mjs`: YouTube adapter (URL parsing, ID extraction, chapter extraction, caption processing).
     - `providers/vimeo.mjs`: Vimeo adapter (URL parsing, ID extraction, VTT/SRT caption ingestion, chapter marker generation).
     - `providers/bunny.mjs`: Bunny Stream adapter (URL parsing, video/library ID extraction, subtitle track ingestion, chapter markers).
     - `pipeline.mjs`: Core ingestion orchestrator that queries lessons from Sanity (or fallback local dataset), deduplicates video URLs, generates structured video documents, and executes batched `createOrReplace` mutations.
     - `verify.mjs`: Automated verification tool that checks 100% video-to-lesson coverage, validates ascending timestamps, verifies non-empty chapters and chunks, and runs test GROQ queries.
     - `cli.mjs`: Unified CLI entry point supporting `--all`, `--dry-run`, `--verify`, `--vtt <path>`, `--srt <path>`, `--url <videoUrl>`, and `--slug <lessonSlug>`.

2. **Supported Providers & Playback / Seek Support**:
   - In accordance with `AGENTS.md` Section 9 ("Do not treat a provider as supported until both ingestion and playback exist for it"):
     - **YouTube**: Ingestion extracts video ID and chapters/chunks. Playback embeds via `youtube-nocookie.com/embed/<id>?autoplay=1&enablejsapi=1&start=<startSeconds>`.
     - **Vimeo**: Ingestion extracts numeric video ID and chapters/chunks. Playback embeds via `player.vimeo.com/video/<id>?autoplay=1#t=<startSeconds>s`.
     - **Bunny Stream**: Ingestion extracts Bunny video/library ID and chapters/chunks. Playback embeds via `https://iframe.mediadelivery.net/embed/<libId>/<vidId>?autoplay=true&t=<startSeconds>` or preserves direct embed URLs with `?t=`/`&t=`.
   - Update `components/lesson/lesson-video-player.tsx` to ensure Bunny Stream start parameters (`?t=` / `&t=`) are cleanly applied alongside YouTube and Vimeo.

3. **Data Shape & Storage Rules**:
   - `_id`: String derived from video URL/ID, sanitized to strip any characters rejected by Sanity datastore (`video.<sanitizedId>`).
   - `_type`: `'video'`.
   - `id`: Unique video identifier (e.g. `9602Yzvd7ik`, `vimeo-123456`, `bunny-abc`).
   - `url`: Canonical video URL.
   - `title`: Video title.
   - `duration`: Number in seconds.
   - `chapters`: Array of `{ _key: string, startSeconds: number, label: string }`.
   - `chunks`: Array of `{ _key: string, startSeconds: number, text: string }`.
   - *Never* store the full transcript in a monolithic field (protects LLM context window).

4. **Security & Performance**:
   - Tokens (`SANITY_API_READ_TOKEN` / write token) are loaded from `.env.local` strictly in Node.js runtime and never exposed to the client.
   - Batch mutations into chunks of 25 to respect Sanity rate limits and ensure atomic execution.

---

## Files to Touch / Create

- `prompts/implement-offline-video-ingestion-pipeline.md` [NEW]
- `studio/scripts/video-ingestion/parsers/caption-parser.mjs` [NEW]
- `studio/scripts/video-ingestion/parsers/chapter-parser.mjs` [NEW]
- `studio/scripts/video-ingestion/providers/youtube.mjs` [NEW]
- `studio/scripts/video-ingestion/providers/vimeo.mjs` [NEW]
- `studio/scripts/video-ingestion/providers/bunny.mjs` [NEW]
- `studio/scripts/video-ingestion/pipeline.mjs` [NEW]
- `studio/scripts/video-ingestion/verify.mjs` [NEW]
- `studio/scripts/video-ingestion/cli.mjs` [NEW]
- `components/lesson/lesson-video-player.tsx` [MODIFY]
- `package.json` [MODIFY]
- `studio/package.json` [MODIFY]

---

## Requirements & Acceptance Criteria

- [ ] Modular video ingestion pipeline with dedicated provider adapters for YouTube, Vimeo, and Bunny Stream.
- [ ] Built-in WebVTT and SubRip (SRT) parsers that normalize timestamps and create 15–45 second semantic transcript chunks.
- [ ] Chapter parser supporting timestamped descriptions, VTT chapters, and structured TOC points.
- [ ] Idempotent `createOrReplace` batch ingestion for all unique course lesson videos into Sanity `production` dataset.
- [ ] Video documents strictly follow schema with sanitized IDs, canonical URLs, duration in seconds, `chapters` array, and `chunks` array.
- [ ] In-browser lesson player (`LessonVideoPlayer`) verified for seeking and playback across YouTube (`&start=`), Vimeo (`#t=s`), and Bunny (`?t=`).
- [ ] Verification script (`npm run verify:videos`) passes with 100% coverage, 0 orphaned lesson videos, and valid GROQ search compatibility.
- [ ] Next.js lint and type checks pass with 0 errors.

---

## Checks to Run

1. `node studio/scripts/video-ingestion/cli.mjs --dry-run` - Test pipeline processing without mutations.
2. `node studio/scripts/video-ingestion/cli.mjs --all` - Execute full ingestion to Sanity `production` dataset.
3. `node studio/scripts/video-ingestion/verify.mjs` - Run dataset integrity verification.
4. `npm run lint` - Verify ESLint passes.
5. `npx tsc --noEmit` - Verify TypeScript compiler passes.
6. `npm run build` - Verify Next.js production build passes.

---

## Exact Manual Test Steps

1. Run `npm run ingest:videos` from workspace root to ingest video documents.
2. Run `npm run verify:videos` to verify video documents in Sanity.
3. Open a lesson page with a timestamp param (e.g. `http://localhost:3000/courses/nextjs-app-router-in-depth/lessons/nextjs-app-router-in-depth-caching-and-revalidation?start=120`) and confirm video starts playing from 2:00.
4. Perform search queries and verify two-stage timestamped video results link directly to exact video moments.
