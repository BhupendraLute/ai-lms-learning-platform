# Implementation Prompt: Move Studio to Standalone Studio Workspace

## Goal
Extract and move Sanity Studio from the embedded Next.js route (`/app/studio/[[...tool]]/page.tsx`) into a standalone Studio workspace in `studio/`, preserving independent Vite builds, auto-updates, TypeGen watch mode, and clean boundary separation as mandated by `AGENTS.md` (Section 5) and Sanity best practices.

---

## Skills Read
- `AGENTS.md` (Section 5: "How the app is structured - The project is two standalone workspaces in one repo. Build it this way and do not embed the Studio inside Next.js.")
- `.agents/skills/sanity-best-practices/references/project-structure.md` (Standalone studio and monorepo structure, schema folder patterns)
- `.agents/skills/sanity-best-practices/references/nextjs.md` (Standalone vs embedded rationale, clean data fetching)
- `.agents/skills/sanity-best-practices/references/typegen.md` (TypeGen configuration across workspaces)

---

## Code Inspected
- `app/studio/[[...tool]]/page.tsx`: Embedded Studio route in Next.js.
- `sanity.config.ts` & `sanity.cli.ts`: Current root configuration.
- `sanity/schemaTypes/`: Schema definitions (`courseType`, `lessonType`, `instructorType`, `categoryType`, `moduleType`, `learningOutcomeType`, `resourceType`, `blockContentType`).
- `sanity/structure.ts`: Desk structure.
- `package.json`: Current root dependencies.

---

## Decisions and Assumptions
1. **Standalone `studio/` Workspace Architecture**:
   - Create a dedicated `studio/` directory containing its own `package.json`, `sanity.config.ts`, `sanity.cli.ts`, `tsconfig.json`, `structure.ts`, and `schemaTypes/`.
   - `studio/sanity.config.ts`: Configured without `basePath: '/studio'` (runs at root of Studio on `localhost:3333` or deployed standalone).
   - `studio/sanity.cli.ts`: Configured with project/dataset from environment or configuration, and TypeGen paths pointing to the web app queries.
   - Schemas in `studio/schemaTypes/` remain the single source of truth for Sanity content authoring.
2. **Web App Cleanup**:
   - Remove `app/studio/[[...tool]]/page.tsx` from Next.js web application so `next build` does not compile Studio UI.
   - Keep `sanity/lib/` (`client.ts`, `live.ts`, `queries.ts`, `data.ts`, `token.ts`, `image.ts`) and `sanity/types.ts` inside the web app for server-side read client and data access.
3. **Scripts & Tooling**:
   - Add convenience scripts to root `package.json` to manage both workspaces easily (`npm run studio:dev`, `npm run studio:build`).

---

## Files to Touch / Create
- `prompts/move-studio-to-standalone.md` [NEW]
- `studio/package.json` [NEW]
- `studio/tsconfig.json` [NEW]
- `studio/sanity.config.ts` [NEW]
- `studio/sanity.cli.ts` [NEW]
- `studio/structure.ts` [NEW]
- `studio/schemaTypes/index.ts` [NEW]
- `studio/schemaTypes/courseType.ts` [NEW]
- `studio/schemaTypes/lessonType.ts` [NEW]
- `studio/schemaTypes/instructorType.ts` [NEW]
- `studio/schemaTypes/categoryType.ts` [NEW]
- `studio/schemaTypes/moduleType.ts` [NEW]
- `studio/schemaTypes/learningOutcomeType.ts` [NEW]
- `studio/schemaTypes/resourceType.ts` [NEW]
- `studio/schemaTypes/blockContentType.ts` [NEW]
- `app/studio/[[...tool]]/page.tsx` [DELETE]
- `sanity.config.ts` [DELETE / CLEANUP]
- `package.json` [MODIFY]

---

## Requirements & Acceptance Criteria
- [ ] Standalone Studio workspace created in `studio/` with own `package.json`, `sanity.config.ts`, `sanity.cli.ts`, `tsconfig.json`, and schema definitions.
- [ ] Embedded Next.js studio route `app/studio/[[...tool]]/page.tsx` removed.
- [ ] Next.js server-side data fetching (`sanity/lib/data.ts`, `queries.ts`, `client.ts`) remains intact and functional.
- [ ] Web application builds cleanly with `npm run build` and zero errors.
- [ ] TypeScript check (`npx tsc --noEmit`) passes with zero errors in web application.
- [ ] Lint check (`npm run lint`) passes with zero errors.

---

## Checks to Run
1. `npx tsc --noEmit` - In web root to confirm clean TypeScript compilation.
2. `npm run lint` - In web root to confirm lint compliance.
3. `npm run build` - In web root to confirm Next.js build passes without compiling embedded Studio.

---

## Exact Manual Test Steps
1. Navigate to `studio/` directory and run `npm install` (or verify dependencies).
2. Run `npm run dev` inside `studio/` to start the standalone Sanity Studio on `http://localhost:3333`.
3. Verify Studio UI loads with Courses, Lessons, Instructors, and Categories.
4. Run `npm run dev` in the web root to start Next.js on `http://localhost:3000`.
5. Verify web app runs and queries data via server-side client without embedding Studio.
