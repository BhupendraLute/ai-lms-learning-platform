# Implementation Prompt: Sanity Content Model, Studio & Server Data Layer

## Goal
Implement the Sanity content model schemas (`course`, `module`, `lesson`, `instructor`, `category`, and supporting object types like `learningOutcome`, `resource`, and `blockContent`), configure Sanity Studio structure with clear document lists and previews, and establish a secure, server-side data access layer with GROQ queries, TypeScript types, server client fetching with private token handling, and image URL utilities for the AI-LMS platform.

---

## Skills Read
- `AGENTS.md` (Project rules, boundaries, schema specifications in Section 8, private token security in Section 12, check steps in Section 13)
- `.agents/skills/sanity-best-practices/SKILL.md` (Schema design, `defineType`/`defineField`/`defineArrayMember`, structure, queries, Next.js live fetch)
- `.agents/skills/content-modeling-best-practices/SKILL.md` (Separation of concerns, references vs embedding, clean data boundaries)
- `.agents/skills/sanity-best-practices/references/schema.md` (Type definitions, array keys, validation rules, previews)
- `.agents/skills/sanity-best-practices/references/nextjs.md` (Server-only data fetching, token handling, Live Content API)
- `.agents/skills/sanity-best-practices/references/groq.md` (GROQ projection, dereferencing, reverse references)

---

## Code Inspected
- `sanity.config.ts`: Sanity Studio config mounted at `/studio`.
- `sanity.cli.ts`: CLI config linking project and dataset.
- `sanity/schemaTypes/index.ts`: Schema types registry.
- `sanity/structure.ts`: Desk structure configuration.
- `sanity/lib/client.ts`: Sanity client initialization.
- `sanity/lib/image.ts`: Image URL helper with `@sanity/image-url`.
- `sanity/lib/live.ts`: `next-sanity/live` wrapper.
- `.env.example` & `.env.local`: Environment variables configuration.
- `app/courses/[slug]/page.tsx`: Existing course details UI inspecting fields and layout expectations.

---

## Decisions and Assumptions
1. **Content Modeling Architecture (strictly adhering to Section 8 of `AGENTS.md`)**:
   - `category` (Document): `title` (string, required), `slug` (slug, required, source: 'title'), `description` (text).
   - `instructor` (Document): `name` (string, required), `slug` (slug, required, source: 'name'), `photo` (image with hotspot), `expertise` (string), `bio` (text).
   - `lesson` (Document): `title` (string, required), `slug` (slug, required, source: 'title'), `videoUrl` (url, embed URL for YouTube/Vimeo/Bunny), `poster` (image with hotspot), `duration` (string/number, formatted duration or seconds), `isFreePreview` (boolean), `studentCount` (number), `notes` (portable text `blockContent`), `keyPoints` (array of strings for 'in this lesson you will'), `proTip` (text), `resources` (array of `resource` objects). Lessons do NOT store their parent course directly; course relationships are derived via reverse references in GROQ.
   - `module` (Embedded Object): `title` (string, required), `summary` (text), `lessons` (array of references to `lesson`). Numbers (e.g. Module 1, Lesson 1.2) are derived dynamically from ordering.
   - `course` (Document): `title` (string, required), `slug` (slug, required, source: 'title'), `summary` (text), `coverImage` (image with hotspot), `level` (string, options: 'Beginner' | 'Intermediate' | 'Advanced'), `price` (number), `popular` (boolean), `studentCount` (number), `learningOutcomes` (array of `learningOutcome` objects with `icon`, `title`, `description`), `instructor` (reference to `instructor`), `category` (reference to `category`), `modules` (array of embedded `module` objects).
   - Supporting Objects: `learningOutcome` (object), `resource` (object: `type`, `title`, `description`, `url`), `blockContent` (array of blocks with links, headings, and code).

2. **Sanity Studio Organization**:
   - Update `sanity/structure.ts` to provide a clean desk structure grouping Content: Courses, Lessons, Instructors, Categories.
   - Add schema previews and custom icons (`BookOpen`, `Video`, `User`, `Folder`, etc.) for intuitive authoring.

3. **Server-Side Data Layer & Security Boundaries**:
   - `SANITY_API_READ_TOKEN` stays strictly server-side in `sanity/lib/token.ts` and `sanity/lib/client.ts` for private dataset queries.
   - Define type-safe GROQ queries in `sanity/lib/queries.ts`:
     - `ALL_COURSES_QUERY`: Fetches all courses with populated instructor, category, module count, and lesson overview.
     - `COURSE_BY_SLUG_QUERY`: Fetches full course details including resolved instructor, category, and all nested lessons within modules.
     - `LESSON_BY_SLUG_QUERY`: Fetches lesson details, resolves reverse reference to parent course and module context, notes portable text, and resources.
     - `ALL_CATEGORIES_QUERY` & `ALL_INSTRUCTORS_QUERY`: Fetch categories and instructors with their associated courses.
     - `COURSE_SLUGS_QUERY` & `LESSON_SLUGS_QUERY`: For Next.js dynamic routing and static generation.
   - Define TypeScript interfaces in `sanity/types.ts` representing domain models.
   - Provide server helper functions (`getCourses`, `getCourseBySlug`, `getLessonBySlug`, `getCategories`, `getInstructorBySlug`) using `sanityFetch` / `client.fetch`.

---

## Files to Touch / Create
- `prompts/implement-sanity-content-model-and-data-layer.md` [NEW]
- `sanity/schemaTypes/categoryType.ts` [NEW]
- `sanity/schemaTypes/instructorType.ts` [NEW]
- `sanity/schemaTypes/lessonType.ts` [NEW]
- `sanity/schemaTypes/moduleType.ts` [NEW]
- `sanity/schemaTypes/courseType.ts` [NEW]
- `sanity/schemaTypes/learningOutcomeType.ts` [NEW]
- `sanity/schemaTypes/resourceType.ts` [NEW]
- `sanity/schemaTypes/blockContentType.ts` [NEW]
- `sanity/schemaTypes/index.ts` [MODIFY]
- `sanity/structure.ts` [MODIFY]
- `sanity/lib/token.ts` [NEW]
- `sanity/lib/client.ts` [MODIFY]
- `sanity/lib/queries.ts` [NEW]
- `sanity/lib/image.ts` [MODIFY]
- `sanity/lib/live.ts` [MODIFY]
- `sanity/lib/data.ts` [NEW]
- `sanity/types.ts` [NEW]
- `.env.example` [MODIFY]

---

## Requirements & Acceptance Criteria
- [ ] Content schemas created with strict `defineType`, `defineField`, `defineArrayMember` syntax matching `AGENTS.md` Section 8.
- [ ] Embedded module pattern implemented inside courses; lessons modeled as independent documents with reverse references.
- [ ] Studio structure updated with custom icons, titles, and preview builders.
- [ ] All TypeScript types created for Course, Module, Lesson, Instructor, Category, LearningOutcome, Resource, and PortableText.
- [ ] Type-safe GROQ queries created with proper projections and reverse lookups.
- [ ] Server-only token resolution ensures private dataset credentials never reach the browser.
- [ ] Server data fetching functions implemented with Next.js App Router compatibility.
- [ ] TypeScript compilation (`npm run build` or `tsc --noEmit`) passes with 0 errors.
- [ ] Next.js linting (`npm run lint`) passes with 0 errors.

---

## Checks to Run
1. `npx tsc --noEmit` - Verify full TypeScript type safety across schemas, queries, and data layer.
2. `npm run lint` - Verify no linting violations.
3. `npm run build` - Ensure Next.js build succeeds with new Sanity schemas, Studio route, and server modules.

---

## Exact Manual Test Steps
1. Run `npm run dev` to start the local Next.js server.
2. Open `http://localhost:3000/studio` in the browser to load Sanity Studio.
3. Verify that Courses, Lessons, Instructors, and Categories appear in the Studio sidebar.
4. Verify creating a Category, Instructor, Lesson, and Course (with embedded Modules and references to Lessons).
5. Verify that all fields (coverImage, learningOutcomes, proTip, notes Portable Text, resources) display appropriately in the Studio forms.
6. Verify that server queries in `sanity/lib/data.ts` can be imported and called safely from Next.js server components without exposing tokens.
