# Implementation Prompt: Move Design System to /design-system Route

## Goal
Relocate the Design System showcase page from `app/page.tsx` to `app/design-system/page.tsx`, and reset `app/page.tsx` to a clean landing page placeholder that links to `/design-system` in preparation for the upcoming Home page build.

---

## Skills Read
- `AGENTS.md` (Project rules, boundaries, and implementation loop)
- `.agents/skills/develop/SKILL.md` (UI development track)

---

## Code Inspected
- `app/page.tsx`: Contains the 14-section interactive design system showcase.
- `app/layout.tsx`: Root layout with font and metadata configuration.
- `components/ui/`: Existing reusable design system components.

---

## Decisions and Assumptions
1. Create `app/design-system/page.tsx` with the complete 14-section Design System showcase.
2. Replace `app/page.tsx` with a lightweight, clean home page placeholder that greets the user, introduces AI-LMS, and provides a quick link to explore the Design System at `/design-system`.
3. Ensure all component imports (`@/components/ui`) and interactions continue working seamlessly on `/design-system`.

---

## Files to Touch / Create
- `app/design-system/page.tsx` [NEW] (Full Design System Showcase)
- `app/page.tsx` [MODIFY] (Clean Home placeholder linking to `/design-system`)

---

## Requirements
- Accessing `http://localhost:3000/design-system` renders the full AI-LMS Design System showcase (all 14 sections).
- Accessing `http://localhost:3000/` renders a clean Home page placeholder.

---

## Security Considerations
- Client-side safe: No sensitive keys or tokens exposed.

---

## Acceptance Criteria
- [ ] `app/design-system/page.tsx` is created and functional.
- [ ] `app/page.tsx` is converted to a clean home placeholder.
- [ ] Next.js linting (`npm run lint`) passes with zero errors.
- [ ] Production build (`npm run build`) passes with zero errors.

---

## Checks to Run
1. `npm run lint`
2. `npm run build`

---

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000/` and verify the clean home placeholder.
2. Click the link to "Explore Design System" or navigate to `http://localhost:3000/design-system`.
3. Verify all 14 design system sections render properly at `/design-system`.
