# Implementation Prompt: AI-LMS Intelligent Search Logic

## Goal
Implement the intelligent search backend and data architecture for AI-LMS according to `AGENTS.md` (Sections 5–12) and the user requirement: focus strictly on the search logic (Sanity schema, video document ingestion, Sanity Context configuration, core search engine, and server-side `/api/search` route) without building the UI yet.

---

## Skills Read
- `AGENTS.md` (Architecture boundaries, data model, search behavior, two-stage timestamp resolution, and grounding rules)
- `.agents/skills/create-agent-with-sanity-context/SKILL.md` (Sanity Context MCP connection, `/initial-context` caching, tool calling, and Vercel AI SDK integration)
- `.agents/skills/dial-your-context/SKILL.md` (Context document instructions formatting, `groqFilter`, pure deltas, and schema notes)
- `.agents/skills/shape-your-agent/SKILL.md` (System prompt boundaries, grounding, and concise instruction design)
- `.agents/skills/sanity-best-practices/SKILL.md` (GROQ queries, schema definitions, and server presentation boundaries)

---

## Code Inspected
- `studio/scripts/seed/videos.json`: 120 curated video mappings for all course lessons.
- `studio/scripts/seed/seed.ndjson`: 120 lessons across 10 courses with notes, key points, and video URLs.
- `sanity/schemaTypes/` & `studio/schemaTypes/`: Existing document models (`courseType.ts`, `lessonType.ts`, `instructorType.ts`, `categoryType.ts`).
- `sanity/lib/queries.ts`, `sanity/lib/data.ts`, `sanity/lib/client.ts`, `sanity/lib/token.ts`: Server-only data access layer.
- `app/api/`: API route conventions.
- `.env.local` and `.env.example`: Sanity project ID (`oxyuqwfg`), dataset (`production`), and read tokens.

---

## Decisions and Assumptions

1. **Video Document Schema & Ingestion Tooling (Sections 8 & 9)**:
   - Define `videoType` in `sanity/schemaTypes/videoType.ts` and `studio/schemaTypes/videoType.ts`.
   - Fields:
     - `_id`: String derived from video URL (e.g. `video.9602Yzvd7ik`).
     - `_type`: `'video'`.
     - `url`: String (the canonical YouTube/provider video URL).
     - `title`: Video title.
     - `duration`: Number in seconds.
     - `chapters`: Array of `{ _key, startSeconds: number, label: string }` representing the table of contents.
     - `chunks`: Array of `{ _key, startSeconds: number, text: string }` representing timestamped transcript pieces.
   - Build offline ingestion script `studio/scripts/seed/seed-videos.mjs` that loads lesson notes/key points/videos metadata, generates timestamped chapter markers and transcript chunks for all 120 lessons, and commits them to the private Sanity dataset with batch mutations.

2. **Sanity Context Configuration Document (Sections 8, 10 & Dial-Your-Context)**:
   - Define `agentContextType` (`sanity.agentContext`) in `sanity/schemaTypes/agentContextType.ts` and `studio/schemaTypes/agentContextType.ts`.
   - Seed `sanity.agentContext.default` (slug `default`):
     - `groqFilter`: `!(_id in path("drafts.**")) && _type in ["course", "lesson", "video", "instructor", "category"]`
     - `instructions`: Tailored guidance teaching the agent schema relationships (`course.modules[].lessons[]`, reverse references `*[_type == "course" && references(^._id)]`, video lookup via `*[_type == "video" && url == $lesson.videoUrl]`, two-stage timestamp resolution: chapters first, transcript chunks second).

3. **Core Search Engine (`sanity/lib/search.ts`)**:
   - Multi-path grounded search execution:
     - **Lesson Search**: Matches lesson title, key points, summary notes (plain text projection `pt::text(notes)`), and parent course/module information.
     - **Video Moment Search (Two-stage resolution)**:
       1. Stage 1: Match chapter labels from `video.chapters[]`.
       2. Stage 2 (Fallback): Match transcript text from `video.chunks[]` only if no chapter matches or for deeper context.
     - **Ranking & Merge**:
       - Rank by specificity: Exact title concept match > Lesson notes/key points match > Chapter label match > Transcript chunk match.
       - Deduplicate and compute metadata: module numbering (derived from course module order, e.g. "Lesson 5.1 in Data Fetching & Caching"), course icons, formatted timestamp (e.g. `12:45` for `765` seconds).
   - **AI SDK & Sanity Context MCP Integration**:
     - Connects to the Sanity Context MCP over HTTP when `SANITY_CONTEXT_MCP_URL` / `OPENAI_API_KEY` is configured.
     - Fetches and caches `/initial-context` schema on the server to minimize latency.
     - Gracefully falls back to high-performance grounded GROQ search when MCP/API key is not configured or in local development.

4. **Server-Side Search API Route (`app/api/search/route.ts`)**:
   - `GET /api/search?q=<query>&sort=<relevance|duration|newest>`:
   - Validates and sanitizes the search query (minimum 1 character, trimmed, max 200 characters).
   - Returns structured JSON:
     ```ts
     {
       query: string;
       stats: {
         totalResults: number;
         coursesCount: number;
         videoResultsCount: number;
         lessonResultsCount: number;
       };
       videoResults: Array<{
         id: string;
         courseTitle: string;
         courseSlug: string;
         courseIcon: string;
         moduleTitle: string;
         moduleNumber: number;
         lessonTitle: string;
         lessonSlug: string;
         lessonNumber: string;
         thumbnailUrl?: string;
         duration: string;
         clipLength?: string;
         startSeconds: number;
         formattedTimestamp: string;
         description: string;
         matchType: 'chapter' | 'transcript';
         watchUrl: string; // /courses/[courseSlug]/lessons/[lessonSlug]?start=[seconds]
       }>;
       lessonResults: Array<{
         id: string;
         courseTitle: string;
         courseSlug: string;
         courseIcon: string;
         moduleTitle: string;
         moduleNumber: number;
         lessonTitle: string;
         lessonSlug: string;
         lessonNumber: string;
         keyPoints: string[];
         description: string;
         lessonUrl: string; // /courses/[courseSlug]/lessons/[lessonSlug]
       }>;
     }
     ```

5. **UI Scope**:
   - As requested by the user, **no UI components or search result pages will be built in this step**. All work is concentrated on the search logic, schemas, ingestion, data access, and the server API.

---

## Files to Touch / Create
- `prompts/implement-search-logic.md` (This implementation prompt)
- `sanity/schemaTypes/videoType.ts` (Video document schema in web)
- `sanity/schemaTypes/agentContextType.ts` (Agent context schema in web)
- `sanity/schemaTypes/index.ts` (Register video and agentContext types)
- `studio/schemaTypes/videoType.ts` (Video document schema in studio)
- `studio/schemaTypes/agentContextType.ts` (Agent context schema in studio)
- `studio/schemaTypes/index.ts` (Register types in studio)
- `studio/scripts/seed/seed-videos.mjs` (Offline video document seeder/ingester)
- `studio/scripts/seed/seed-context.mjs` (Agent context document seeder)
- `sanity/lib/queries.ts` (Add GROQ search queries for lessons, video chapters, and chunks)
- `sanity/lib/search.ts` (Search engine with ranking, two-stage timestamp resolution, and MCP/AI SDK support)
- `app/api/search/route.ts` (Server-side search API endpoint)
- `.env.example` (Update with search/AI env vars)
- `package.json` (Add AI SDK dependencies: `ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `zod`)

---

## Security Considerations
- All Sanity data fetching is done server-side via `serverClient` with `SANITY_API_READ_TOKEN`.
- No Sanity tokens, OpenAI keys, or internal video transcript blobs are exposed to client bundles.
- Queries are parameterized in GROQ to prevent injection and safely wildcard search tokens.
- Output from the API endpoint is validated and sanitized before being returned to clients.

---

## Acceptance Criteria
1. `video` and `sanity.agentContext` schemas are defined and integrated into Sanity Studio and web schemas.
2. `seed-videos.mjs` successfully ingests video documents with chapters and chunks for all lessons into Sanity.
3. `seed-context.mjs` creates the Sanity Context document with dialed instructions and content filters.
4. `sanity/lib/search.ts` executes grounded two-stage search over courses, lessons, and video moments.
5. `/api/search?q=data+fetching` returns structured JSON with both `videoResults` (including start timestamps) and `lessonResults` (including key points).
6. TypeScript check (`npm run dev` / `tsc --noEmit`) and linting pass with 0 errors.

---

## Checks to Run
- `npm run studio:seed-videos` (or direct node execution) to verify video ingestion.
- `npm run studio:seed-context` (or direct node execution) to verify agent context seeding.
- Query Sanity to confirm `videoCount > 0` and `agentContextCount > 0`.
- Run curl/node test against `/api/search?q=data+fetching` to verify result structure.
- Run `npx tsc --noEmit` and `npm run lint`.

---

## Manual Test Steps
1. Execute `/api/search?q=data+fetching` and inspect the returned JSON:
   - Verify `stats.totalResults` is calculated correctly.
   - Verify `videoResults` contains valid `startSeconds`, `formattedTimestamp`, and `watchUrl`.
   - Verify `lessonResults` contains `keyPoints`, `courseTitle`, and `lessonUrl`.
2. Execute `/api/search?q=docker` and verify Docker-related lessons and video moments are returned.
3. Execute `/api/search?q=nonexistenttopicxyz` and verify empty result arrays are returned gracefully without error.
