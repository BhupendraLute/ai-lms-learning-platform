# Implementation Prompt: Add Clerk Authentication

## Goal
Set up and configure Clerk authentication for the AI-LMS project using the Clerk CLI, linking to Clerk application `app_3IPvy5sWgJrNVqZ26xJM9Nmmt3o`. Ensure seamless Next.js App Router integration with middleware/proxy matcher, root `<ClerkProvider>`, and auth controls (`SignInButton`, `SignUpButton`, `UserButton`, `Show`) in the navigation bar.

---

## Skills Read
- `AGENTS.md` (Architecture, auth boundaries, private token rules, implementation loop)
- `.agents/skills/clerk/SKILL.md` (Clerk router and general patterns)
- `.agents/skills/clerk-cli/SKILL.md` (CLI commands, agent mode flags, app linking, `clerk init`, `clerk doctor`)
- `.agents/skills/clerk-nextjs-patterns/SKILL.md` (Next.js server/client auth, `clerkMiddleware`, `<Show>` / `<SignedIn>` / `<SignedOut>`, `await auth()`)
- `.agents/skills/clerk-setup/SKILL.md` (Official setup guide and quickstart conventions)

---

## Code Inspected
- `package.json`: Next.js 16.3.3, React 19.2.8, Tailwind CSS v4, Lucide icons.
- `app/layout.tsx`: Root layout with font configuration and `<body>` structure.
- `app/page.tsx`: Home page rendering the `Navbar` and hero/catalog content.
- `components/ui/navbar.tsx`: Header navigation component currently showing static placeholder user controls.
- `.gitignore`: Configured to ignore `.env*` files.

---

## Decisions and Assumptions
1. **Clerk CLI Execution**:
   - Check if `clerk` CLI is installed and up to date, or invoke via `npx -y clerk@latest` / `npm install -g clerk`.
   - Run `clerk auth login` if required, followed by `clerk init --app app_3IPvy5sWgJrNVqZ26xJM9Nmmt3o`.
   - Ensure development credentials (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) are written to `.env.local` without committing secrets.
2. **Next.js Integration**:
   - Install `@clerk/nextjs` SDK if not already done by `clerk init`.
   - Configure `proxy.ts` / `middleware.ts` with `clerkMiddleware()` and matcher containing `/(api|trpc)(.*)` and `/__clerk/:path*`.
   - Wrap application content in `app/layout.tsx` with `<ClerkProvider>` placed inside `<body>` (never wrapping `<html>`).
3. **UI Auth Controls**:
   - Update `components/ui/navbar.tsx` to include interactive Clerk authentication controls:
     - When signed out: Render `SignInButton` and `SignUpButton` with styled buttons matching AI-LMS design tokens.
     - When signed in: Render `UserButton` with custom avatar appearance alongside existing notification bell.
   - Use `<Show when="signed-in">` / `<Show when="signed-out">` or `<SignedIn>` / `<SignedOut>`.
4. **Security & Boundary Rules**:
   - `CLERK_SECRET_KEY` remains strictly server-side.
   - Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is exposed to the browser.
   - Public browsing remains available across catalog and home pages, with user state cleanly separated.

---

## Files to Touch / Create
- `prompts/add-clerk-authentication.md` (Implementation prompt documentation)
- `.env.local` / `.env.example` (Clerk environment variables and committed template)
- `proxy.ts` / `middleware.ts` (Next.js middleware with `clerkMiddleware` and Clerk matchers)
- `app/layout.tsx` (Wrap body contents with `ClerkProvider`)
- `components/ui/navbar.tsx` (Integrate `SignInButton`, `SignUpButton`, `UserButton`, and auth state handling)

---

## Requirements & Acceptance Criteria
- [ ] Clerk CLI checked / installed and authenticated with `clerk auth login`.
- [ ] Project initialized and linked with Clerk app `app_3IPvy5sWgJrNVqZ26xJM9Nmmt3o`.
- [ ] `.env.local` contains valid Clerk keys; `.env.example` lists required environment variables.
- [ ] `proxy.ts` or `middleware.ts` configured with `clerkMiddleware` and `/__clerk/:path*` in `config.matcher`.
- [ ] Root layout wraps body with `<ClerkProvider>`.
- [ ] Navbar displays Sign In and Sign Up buttons when signed out, and UserButton when signed in.
- [ ] `clerk doctor` health check passes.
- [ ] TypeScript compilation (`npm run build`) and linting (`npm run lint`) pass with zero errors.

---

## Checks to Run
1. `clerk doctor` - Verify Clerk CLI configuration, instance health, and environment keys.
2. `npm run lint` - Verify no ESLint errors.
3. `npm run build` - Verify full Next.js production build and TypeScript type-checking.
4. Verify dev server (`npm run dev`) loads cleanly with Clerk auth controls active.

---

## Exact Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000` in the browser.
3. Verify Header when signed out:
   - "Sign In" and "Sign Up" buttons appear in the top right navigation.
4. Click "Sign Up" or "Sign In" button:
   - Verify the Clerk authentication modal / page opens cleanly.
   - Complete sign-up / sign-in with a test account.
5. Verify Header when signed in:
   - User avatar (`UserButton`) appears in place of sign-in buttons.
   - Clicking `UserButton` opens the Clerk user profile dropdown / modal.
6. Test signing out from the `UserButton` menu:
   - Verify the state returns to signed-out with "Sign In" / "Sign Up" buttons visible.
