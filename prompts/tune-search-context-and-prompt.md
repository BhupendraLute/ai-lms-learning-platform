# Implementation Prompt: Tune Search Context Document Scope Filter, Instructions & System Prompt

## Goal
Tune the AI-LMS search configuration by defining the Sanity Context document's `groqFilter` and `instructions` using `dial-your-context`, and shaping the canonical search agent `systemPrompt` using `shape-your-agent` according to `AGENTS.md` (Sections 4, 7, 8, 10, 11, 12).

---

## Skills Read
- `.claude/skills/dial-your-context/SKILL.md` (Pure deltas, schema relationship guidance, required filters, two-stage query patterns)
- `.claude/skills/shape-your-agent/SKILL.md` (System prompt voice, boundaries, grounding rules, and uncertainty handling)
- `.claude/skills/create-agent-with-sanity-context/SKILL.md` (MCP tool integration, `/initial-context` caching, and system prompt injection)
- `.claude/skills/sanity-best-practices/SKILL.md` (GROQ queries, schema types, and server boundaries)
- `AGENTS.md` (Sections 4, 7, 8, 10, 11, 12)

---

## Code Inspected
- `sanity/schemaTypes/agentContextType.ts` & `studio/schemaTypes/agentContextType.ts`: Document schema for `sanity.agentContext`.
- `studio/scripts/seed/seed-context.mjs`: Script that seeds the `sanity.agentContext.default` document.
- `sanity/lib/search.ts`: Core search engine, query projections, scoring, and initial context loader.
- `sanity/lib/queries.ts`: Search queries for lessons, video chapters, and transcript chunks.

---

## Decisions and Assumptions

1. **Context Document Content Scope Filter (`groqFilter`)**:
   - Scope to content documents only:
     ```groq
     !(_id in path("drafts.**")) && _type in ["course", "lesson", "video", "instructor", "category"]
     ```
   - Excludes system documents, drafts, migrations, settings, and progress records.

2. **Context Document Instructions (`instructions`) via `dial-your-context`**:
   - Focus exclusively on **pure deltas** (what the schema doesn't make obvious):
     - **Schema Relationships**:
       - `course.modules[]`: Embedded objects (not standalone documents). Numbers (e.g. Module 5, Lesson 5.1) are derived from array index order + 1, not stored.
       - `lesson`: Standalone documents without parent course pointers. Must be resolved via reverse reference: `*[_type == "course" && references(^._id)][0]`.
       - `video`: Standalone documents keyed by video URL (`lesson.videoUrl == video.url`). Contains `chapters[]` ({ startSeconds, label }) and `chunks[]` ({ startSeconds, text }). Internal lookup only — never return standalone.
     - **Two-Stage Timestamp Resolution**:
       - Stage 1: Match `chapters[].label` first (clean table of contents markers).
       - Stage 2: Fall back to `chunks[].text` only if no chapter matches for that lesson.
     - **Text Search & Projection**:
       - Wildcard token match with OR across tokens (`*token1* || *token2*`).
       - Portable Text must be queried via plain text projection: `pt::text(notes) match $term`.
     - **Ranking**: Exact title match > Key points match > Chapter label match > Notes text match > Transcript chunk match.

3. **Shaping the System Prompt (`systemPrompt`) via `shape-your-agent`**:
   - **Role**: AI-LMS intelligent learning assistant and search agent.
   - **Voice**:
     - Concise, educational, direct, and structured.
     - Never use conversational filler or marketing fluff.
   - **Boundaries & Guardrails**:
     - Grounded facts only: strictly output lessons, courses, and timestamps present in Sanity. Never invent or hallucinate.
     - Always link video results to parent course and lesson; never expose video documents in isolation.
     - Grounded two-stage timestamp resolution: chapters first, transcript chunks as backstop.
     - When no matching content exists, state clearly that no results were found and guide to the course catalog.
   - Dual-placement rule (AGENTS.md Section 11 & 12): Place critical query and ranking rules in both the inline system prompt and Context document.

4. **Integration in Codebase**:
   - Update `studio/scripts/seed/seed-context.mjs` with the tuned `groqFilter` and `instructions`.
   - Create `sanity/lib/search-agent-config.ts` exporting `SEARCH_AGENT_SYSTEM_PROMPT` and `SEARCH_AGENT_CONTEXT_INSTRUCTIONS`.
   - Update `sanity/lib/search.ts` to utilize the configured prompt and instructions.

---

## Files to Touch
- `sanity/lib/search-agent-config.ts`: [NEW] Define canonical system prompt and Context document instructions.
- `studio/scripts/seed/seed-context.mjs`: [MODIFY] Update Context document seed script with refined scope filter and instructions.
- `sanity/lib/search.ts`: [MODIFY] Reference `SEARCH_AGENT_SYSTEM_PROMPT` and export configuration helpers.

---

## Acceptance Criteria
- [x] Context document `groqFilter` cleanly limits scope to `course`, `lesson`, `video`, `instructor`, `category`, and excludes drafts.
- [x] Context document `instructions` follows `dial-your-context` principles (pure deltas: reverse references, module indexing, two-stage timestamps, Portable Text projection).
- [x] Search agent system prompt follows `shape-your-agent` principles (role, voice, strict grounding, boundaries, fallback behavior).
- [x] Seed script updates cleanly.
- [x] Type check (`npx tsc --noEmit`), lint (`npm run lint`), and build (`npm run build`) pass cleanly with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Inspect `sanity/lib/search-agent-config.ts` to verify the system prompt and instructions adhere to `shape-your-agent` and `dial-your-context`.
2. Run `npm run studio:seed-context` or inspect `seed-context.mjs` to verify valid mutation payload and clean GROQ filter.
3. Run `npm run build` to verify clean build without regressions.
