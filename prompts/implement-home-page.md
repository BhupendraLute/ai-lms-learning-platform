# Implementation Prompt: AI-LMS Home Page Implementation

## Goal
Implement the AI-LMS Home Page matching the design specification (`design/ailms-home.png`) with pixel-perfect visual fidelity, responsive layouts, exact typography hierarchy, and interactive states using Next.js 16 (App Router), Tailwind CSS v4, and the AI-LMS component library.

---

## Skills Read
- `AGENTS.md` (Project rules, boundaries, UI work guidelines, and implementation loop)
- `.agents/skills/develop/SKILL.md` (UI track implementation principles and execution flow)
- `.agents/skills/sanity-best-practices/SKILL.md` (Content structure alignment and presentation boundaries)

---

## Code Inspected
- `design/ailms-home.png`: Source of truth design reference.
- `app/layout.tsx`: Google fonts (`Playfair_Display` and `Inter`) and root styling.
- `app/globals.css`: Tailwind theme tokens, typography scale classes, and background settings.
- `app/page.tsx`: Current initial landing page.
- `components/ui/navbar.tsx`: Header navigation bar component.
- `components/ui/cards.tsx`: `CourseCard` component with stats and icon support.
- `components/ui/input.tsx`: Search input with ⌘K badge.
- `components/ui/button.tsx`: Button component variants.
- `components/ui/icons.tsx`: Brand logo and icon set.

---

## Decisions and Assumptions
1. **Visual Fidelity & Typography**:
   - Main headline (`Search your learning in plain English.`): Playfair Display (`font-serif`), bold, centered, matching the exact line breaks and scale in the reference.
   - Section heading (`All Courses`): Playfair Display (`font-serif`), semi-bold/bold.
   - Intelligent Learning badge: Uppercase `INTELLIGENT LEARNING`, tracking-wider, orange text `#F97316`, soft warm border `#FED7AA`, and light background `#FFEEE5`.
   - Subtitle: Inter regular, dark neutral `#475569`, centered, max-w-xl.
2. **Navbar Enhancements**:
   - Header with AI-LMS Logo, "Courses", "My Learning" links on the left.
   - Notification bell icon button and circular profile avatar on the right.
3. **Hero Search Bar**:
   - Full-featured search input with search icon, placeholder `Ask anything about your learning...`, and `⌘ K` keyboard shortcut badge.
   - Support keyboard shortcut (⌘K / Ctrl+K) to focus the input.
4. **Course Cards Grid**:
   - 3-column responsive grid showcasing:
     1. **Next.js for Production** (Black rounded square with 'N' logo, Intermediate, 18h 24m, 12 modules)
     2. **Docker Essentials** (Docker whale SVG icon, Beginner, 10h 12m, 8 modules)
     3. **TypeScript Deep Dive** (Blue rounded square with 'TS' logo, Intermediate, 14h 36m, 10 modules)
   - Hover effects, smooth transitions, and exact metadata icons (`BarChart2`, `Clock`, `FileText`).
5. **Notice Row & Bottom Visual Graphic**:
   - Centered notice row: Orange star icon + `New courses and lessons added every week.` with left and right divider rules.
   - Bottom warm orange/peach gradient pillars/cityscape graphic rising from the bottom edge matching the reference illustration.
6. **Mobile Responsiveness**:
   - Sensible stacking on mobile/tablet viewports while preserving exact desktop proportions.

---

## Files to Touch / Create
- `prompts/implement-home-page.md` (Implementation prompt documentation)
- `components/ui/icons.tsx` (Add Docker, Next.js, and TypeScript brand icon helpers)
- `components/ui/navbar.tsx` (Update Navbar to include notification bell and user profile avatar)
- `app/page.tsx` (Implement complete AI-LMS Home Page from `design/ailms-home.png`)

---

## Requirements & Acceptance Criteria
- [ ] Header matches design with logo, "Courses", "My Learning" navigation, notification bell, and user avatar.
- [ ] Hero section renders "INTELLIGENT LEARNING" badge, Playfair Display headline, subtitle, "Explore Courses ->" button, and search input with ⌘K badge.
- [ ] "All Courses" section renders section title and "View all courses ->" link.
- [ ] 3 Course Cards render accurately with their respective brand icons, titles, descriptions, and meta tags (level, duration, modules).
- [ ] "New courses and lessons added every week." divider row is centered with star icon.
- [ ] Bottom decorative warm gradient pillars graphic rendered faithfully.
- [ ] Full responsiveness across desktop, tablet, and mobile.
- [ ] TypeScript compilation (`npm run build`) passes with zero errors.
- [ ] Next.js linting (`npm run lint`) passes with zero errors.

---

## Checks to Run
1. `npm run lint` - Verify no linting errors.
2. `npm run build` - Verify clean production build and TypeScript type-checking.
3. Dev server UI verification for desktop and mobile viewports.

---

## Exact Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000` in the browser.
3. Verify Header: AI-LMS logo, Courses, My Learning, Bell icon, User Avatar.
4. Verify Hero: "INTELLIGENT LEARNING" pill, "Search your learning in plain English." title in Playfair Display, subtitle, "Explore Courses ->" CTA button.
5. Verify Search Bar: Search icon, placeholder, ⌘K shortcut badge, and focus state. Press `⌘K` or `Ctrl+K` to confirm focus.
6. Verify "All Courses" section: 3 course cards with Next.js, Docker, and TypeScript icons, titles, descriptions, and meta badges.
7. Verify weekly notice line with star icon.
8. Verify bottom orange gradient pillars aesthetic illustration.
9. Test mobile layout by shrinking viewport width down to 375px.
