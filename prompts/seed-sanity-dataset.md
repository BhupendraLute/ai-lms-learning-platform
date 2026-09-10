# Implementation Prompt: Seed Sanity Sample Dataset

## Goal
Seed the Sanity dataset (`production`) with rich, realistic production data: 6 categories, 5 instructors, and 10 complete courses spanning web development, AI engineering, backend/infrastructure, data engineering, TypeScript, system design, databases, DevOps, and web security. The dataset comprises 40 modules and 120 lessons with strictly consistent relationships (each module equals the sum of its lessons, each course equals the sum of its modules, and each course references its assigned instructor and category). Image assets (cover images, instructor photos, lesson posters/thumbnails) are uploaded directly to Sanity Asset Storage, and rich lesson notes are provided in Portable Text.

---

## Skills Read
- `AGENTS.md` (Section 8 Content Model, Section 9 Video ingestion, Section 12 Gotchas, Section 13 Checks)
- `.agents/skills/sanity-best-practices/SKILL.md` (Schema definitions, GROQ queries, type generation, asset handling)
- `.agents/skills/sanity-migration/SKILL.md` (Deterministic IDs, `createOrReplace` mutations, asset uploading, reference resolution, validation)
- `.agents/skills/content-modeling-best-practices/SKILL.md` (Separation of concerns, references vs embedded objects)
- `.agents/skills/portable-text-conversion/SKILL.md` (Portable text block formatting)

---

## Code Inspected
- `studio/scripts/seed/seed.ndjson`: 142 structured documents covering categories, instructors, courses, modules, and lessons.
- `studio/scripts/seed/videos.json`: 120 metadata objects mapping to all 120 lessons.
- `studio/schemaTypes/` & `sanity/schemaTypes/`: Schema definitions for `course`, `lesson`, `instructor`, `category`, `module`, `learningOutcome`, `resource`, and `blockContent`.
- `sanity/lib/queries.ts` & `sanity/types.ts` & `sanity.types.ts`: Application GROQ queries and TypeScript type definitions.
- `.env.local` & `studio/.env.local`: Project ID (`oxyuqwfg`), dataset (`production`), and token credentials (`SANITY_API_READ_TOKEN` with write/mutate permissions).
- `app/page.tsx` & `app/courses/[slug]/page.tsx`: Existing frontend pages and components consuming course, module, and lesson data.

---

## Decisions and Assumptions
1. **Content Scope & Entities**:
   - **6 Categories**:
     1. Web Development (`category.web-development`)
     2. AI Engineering (`category.ai-engineering`)
     3. Backend & Infrastructure (`category.backend-infrastructure`)
     4. Data (`category.data`)
     5. Languages (`category.languages`)
     6. Security (`category.security`)
   - **5 Instructors**:
     1. Mira Kovac (`instructor.mira-kovac`) — React, Next.js, Web Performance, Rendering
     2. Daniel Okafor (`instructor.daniel-okafor`) — TypeScript, PostgreSQL, API Design, Data Modelling
     3. Priya Raman (`instructor.priya-raman`) — LLMs, RAG, Prompt Engineering, Evaluation
     4. Tomas Berg (`instructor.tomas-berg`) — Python, pandas, System Design, Distributed Systems
     5. Alina Costa (`instructor.alina-costa`) — Docker, Kubernetes, CI/CD, Application Security
   - **10 Courses, 40 Modules, 120 Lessons**:
     - *Next.js App Router in Depth* (4 modules, 12 lessons)
     - *React Performance Engineering* (4 modules, 12 lessons)
     - *TypeScript for Application Developers* (4 modules, 12 lessons)
     - *Building AI Apps with LLMs* (4 modules, 12 lessons)
     - *Retrieval-Augmented Generation from Scratch* (4 modules, 12 lessons)
     - *Python for Data Work* (4 modules, 12 lessons)
     - *System Design Foundations* (4 modules, 12 lessons)
     - *PostgreSQL for Developers* (4 modules, 12 lessons)
     - *DevOps with Docker and Kubernetes* (4 modules, 12 lessons)
     - *Practical Web Security* (4 modules, 12 lessons)

2. **Relational Consistency**:
   - Every course has 4 embedded `module` objects.
   - Every module has 3 ordered `lesson` references.
   - Every one of the 120 lessons is referenced in exactly one course module (no dangling or orphaned references).
   - Module and lesson numbers (e.g., Module 1, Lesson 1.1) are derived dynamically from position order.

3. **Field & Asset Harmonization**:
   - Image assets (`_sanityAsset: "image@https://..."`) are downloaded and uploaded to Sanity's Image Asset API (`sanity.imageAsset`) to produce valid Sanity `_ref` values, and cached locally to prevent redundant downloads.
   - Both `poster` and `thumbnail` fields on lessons are populated to guarantee full backward and forward compatibility with schema and queries.
   - Both `isFreePreview` and `freePreview` boolean flags are preserved.
   - `duration` is stored both as formatted string (e.g., `"5:50"`, `"12:30"`) and seconds as needed.
   - Rich notes are populated as standard Portable Text blocks.

4. **Deterministic & Idempotent Execution**:
   - The script uses `createOrReplace` mutations with deterministic IDs (`category.<slug>`, `instructor.<slug>`, `course.<slug>`, `lesson.<slug>`), ensuring that re-running the seed script is safe, reproducible, and converges without duplicate records.
   - Run in logical dependency order: Categories & Instructors -> Lessons -> Courses.

5. **Security Considerations**:
   - Environment variables (`SANITY_API_READ_TOKEN`, project ID, dataset) are loaded strictly from `.env.local`.
   - Token is never exposed to client-side bundles or checked into version control.

---

## Files to Touch / Create
- `prompts/seed-sanity-dataset.md` [NEW]
- `studio/scripts/seed/seed.mjs` [NEW] (Self-contained, robust seeding script)
- `package.json` [MODIFY] (Add `"seed"` script)
- `studio/package.json` [MODIFY] (Add `"seed"` script)

---

## Requirements & Acceptance Criteria
- [ ] Exactly 6 categories created in Sanity `production` dataset.
- [ ] Exactly 5 instructors created with photos, expertise, and bio.
- [ ] Exactly 10 courses created with cover images, learning outcomes, instructor refs, and category refs.
- [ ] Exactly 120 lessons created with video embed URLs, poster/thumbnail image assets, key points, resources, and Portable Text notes.
- [ ] Exactly 40 modules distributed 4 per course, with 3 lessons per module.
- [ ] Zero broken references across the entire dataset.
- [ ] Seed script executes idempotently with clean logging and summary report.
- [ ] Next.js type check, linting, and build pass with 0 errors.

---

## Checks to Run
1. `node studio/scripts/seed/seed.mjs` - Run the seed process to upload assets and create documents.
2. GROQ validation query via client to verify 6 categories, 5 instructors, 10 courses, 120 lessons, and 0 broken references.
3. `npm run lint` in root - Verify ESLint passes.
4. `npm run build` in root - Verify Next.js production build succeeds.
5. `npm --prefix studio run build` in studio - Verify Sanity Studio builds cleanly.

---

## Exact Manual Test Steps
1. Run `npm run seed` from root workspace.
2. Inspect terminal output to verify upload of image assets and mutation of 142 documents without errors.
3. Run verification check script to confirm all categories, instructors, courses, modules, and lessons are dereferenceable.
4. Open Sanity Studio (`npm run studio:dev`) at `http://localhost:3333` and browse Courses, Lessons, Instructors, and Categories.
5. Open Next.js web application (`npm run dev`) at `http://localhost:3000` and confirm course catalog and course details show live data.
