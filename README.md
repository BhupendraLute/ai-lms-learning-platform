# AI-LMS 🎓⚡

**AI-LMS** is a production-grade, AI-powered learning management platform built with Next.js 16 (App Router), React 19, and Sanity Studio v5.

What sets AI-LMS apart is its **intelligent grounded search**: learners type natural language queries and receive ranked, clickable result cards that link directly to the **exact second** in a lesson's video where that topic is taught, with embedded video playback directly on-site.

---

## 🌟 Key Features

- **🔍 AI-Powered Grounded Video Search**:
  - Semantic and keyword search ranking lessons and precise video moments.
  - Two-stage timestamp resolution: matches authored video chapters first, falling back to timestamped transcript chunks.
  - Grounded output: queries resolve against structured Sanity documents and the Sanity Context MCP without hallucinated timestamps or courses.
  - Rich result cards with clip lengths, lesson contexts, module paths, and direct deep-links.

- **🎥 Dedicated Video Intelligence & Offline Ingestion**:
  - Offline ingestion CLI supporting **YouTube**, **Vimeo**, and **Bunny** video sources.
  - Automatically breaks full transcripts into timestamped chunks and extracts table-of-contents chapter markers into dedicated `video` documents.
  - Embeds provider players (YouTube, Vimeo, Bunny) on lesson pages and seeks to query timestamps automatically.

- **📚 Structured Content Model & Standalone Sanity Studio v5**:
  - Multi-tier course architecture: Courses, Modules, Lessons, Instructors, Categories, and Video Intelligence documents.
  - Rich Portable Text notes with custom callouts (Pro Tips, Key Points, Downloadable Resources).
  - Standalone Studio workspace (`/studio`) maintaining independent deployment, clean separation of concerns, and full Sanity TypeGen support.

- **👤 Authentication & Progress Tracking with Clerk**:
  - Seamless authentication powered by Clerk with middleware-based route protection.
  - Per-learner progress tracking (completed lessons, course enrollment, and resume positions).
  - Secure server-only mutation endpoints ensuring clients never write directly to private datastores.

- **📊 Product Analytics with PostHog**:
  - Comprehensive telemetry tracking catalog views, lesson engagement, search queries, video watch depths, and lesson completions.
  - Client and server-side event tracking with strict separation between public project keys and private server credentials.

- **🎨 Modern Clean Light-Mode Design System**:
  - Crisp, modern light-mode UI aesthetic crafted with Tailwind CSS v4, refined typography, subtle borders, and Lucide icons.
  - Fully responsive across desktop, tablet, and mobile breakpoints with collapsible sidebars and sticky navigation.

---

## 🏗️ Architecture & Workspace Structure

The repository is structured as two decoupled workspaces in a single repository to ensure independent deployment, Studio auto-updates, and type safety:

```
ai-lms/
├── app/                      # Next.js App Router (Pages, API Routes, Layouts)
│   ├── api/search/           # Server-side AI search endpoint (MCP / OpenCode Zen AI SDK)
│   ├── courses/              # Course details and module exploration
│   ├── lessons/              # Lesson view (video player, notes, resources, progress)
│   ├── search/               # Search results page with video & lesson cards
│   ├── my-learning/          # Learner dashboard and progress overview
│   ├── sign-in/ & sign-up/   # Clerk authentication flows
│   └── design-system/        # UI component preview and design tokens
├── components/               # React UI components (course, lesson, search, home, ui)
├── lib/                      # Utilities, analytics helpers, duration parsers
├── sanity/                   # Next.js Sanity client, queries, search logic, and TypeGen types
├── studio/                   # Standalone Sanity Studio v5 Workspace
│   ├── schemaTypes/          # Sanity schemas (course, module, lesson, video, instructor, etc.)
│   ├── scripts/
│   │   ├── seed/             # Seed scripts for courses, videos, and context config
│   │   └── video-ingestion/  # Offline video ingestion pipeline (YouTube, Vimeo, Bunny)
│   └── sanity.config.ts      # Studio configuration and structure
├── prompts/                  # Implementation plans, design prompts, and change specifications
└── AGENTS.md                 # Agent guidelines, data contracts, and architectural rules
```

### Security & Data Boundaries
- **Server-Only Data Access**: Sanity read/write tokens and Clerk secret keys remain strictly on the server.
- **No Client LLM Calls**: The browser never directly contacts the LLM or Context MCP; all search queries pass through server routes.
- **Grounded Verification**: Transcripts and chunks are processed offline into dedicated video documents, preventing context window overflow.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/), [Lucide React](https://lucide.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **CMS & Data** | [Sanity Studio v5](https://www.sanity.io/), `next-sanity`, `@portabletext/react` |
| **Authentication** | [Clerk](https://clerk.com/) (`@clerk/nextjs`) |
| **AI / Search** | [Vercel AI SDK](https://sdk.vercel.ai/), `@ai-sdk/openai`, Sanity Context MCP |
| **Analytics** | [PostHog](https://posthog.com/) (`posthog-js`) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or later
- **npm** (or pnpm / yarn)
- A **Sanity** account and project
- A **Clerk** application account
- An **OpenCode Zen** or **OpenAI** API key (for search capabilities)
- A **PostHog** account (optional for local analytics)

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/ai-lms.git
cd ai-lms

# Install root (Next.js web app) dependencies
npm install

# Install Studio workspace dependencies
cd studio
npm install
cd ..
```

---

### Step 2: Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Redirect Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2026-09-02"

# Sanity Server Tokens (Private Dataset Access)
SANITY_API_READ_TOKEN="your_sanity_read_token"
SANITY_API_WRITE_TOKEN="your_sanity_write_token"

# Sanity Context MCP (Optional)
SANITY_CONTEXT_MCP_URL="https://api.sanity.io/v2026-03-03/context/mcp/:projectId/:dataset/default"

# OpenCode Zen / LLM API Configuration
OPENCODE_ZEN_API_KEY="your_api_key"
OPENCODE_ZEN_BASE_URL="https://api.opencode.ai/v1"
OPENCODE_ZEN_MODEL="big-pickle"

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

Create `studio/.env.local` in the `studio/` directory:

```env
SANITY_STUDIO_PROJECT_ID="your_sanity_project_id"
SANITY_STUDIO_DATASET="production"
```

---

### Step 3: Seed Sanity Dataset & Ingest Videos

Seed initial courses, instructors, lessons, and video intelligence documents into your Sanity dataset:

```bash
# 1. Seed courses, lessons, and instructors
npm run studio:seed

# 2. Seed video documents with chapters and transcript chunks
npm run studio:seed-videos

# 3. Seed agent context document for MCP search tuning
npm run studio:seed-context
```

To run or verify the video ingestion pipeline against real URLs:

```bash
# Run the video ingestion CLI to process transcripts and chapters
npm run ingest:videos

# Verify video document integrity and chunk indexing
npm run verify:videos
```

---

### Step 4: Run Development Servers

Start both the Next.js web application and the Sanity Studio:

```bash
# Terminal 1: Run Next.js Web App (http://localhost:3000)
npm run dev

# Terminal 2: Run Sanity Studio (http://localhost:3333)
npm run studio:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Starts the Next.js development server at `localhost:3000` |
| `npm run build` | `next build` | Compiles the production build for the Next.js web app |
| `npm run start` | `next start` | Starts the production server |
| `npm run lint` | `eslint` | Runs ESLint checks across the codebase |
| `npm run studio:dev` | `npm --prefix studio run dev` | Starts the Sanity Studio dev server at `localhost:3333` |
| `npm run studio:build`| `npm --prefix studio run build` | Builds the Sanity Studio bundle for production deployment |
| `npm run studio:typegen`| `npm --prefix studio run typegen`| Generates TypeScript types from Sanity schemas and GROQ queries |
| `npm run studio:seed` | `node studio/scripts/seed/seed.mjs` | Seeds courses, instructors, categories, and lessons |
| `npm run studio:seed-videos` | `node studio/scripts/seed/seed-videos.mjs` | Seeds timestamped video chapters and transcripts |
| `npm run studio:seed-context`| `node studio/scripts/seed/seed-context.mjs` | Seeds the Sanity Context MCP configuration document |
| `npm run ingest:videos` | `node studio/scripts/video-ingestion/cli.mjs --all` | Ingests video metadata, chapters, and captions |
| `npm run verify:videos` | `node studio/scripts/video-ingestion/cli.mjs --verify` | Verifies stored video documents in Sanity |

---

## 🧠 How Search Works

1. **User Query**: Learner enters a query (e.g., *"How do I invalidate cache tags in Next.js?"*).
2. **AI Inference & Context Resolution**: The server route (`/api/search`) connects to Sanity and evaluates relevant lessons and video documents.
3. **Two-Stage Timestamp Ranking**:
   - **Stage 1 (Chapters)**: Matches against clean chapter markers (`{ startSeconds, label }`).
   - **Stage 2 (Transcript Chunks)**: If no exact chapter matches, matches across timestamped transcript chunks (`{ startSeconds, text }`).
4. **Structured Results Presentation**: Results are returned as typed cards:
   - **Video Result Cards**: Course badge, module path, duration, clip preview, and deep-link to the exact playback second.
   - **Lesson Cards**: Summary, key takeaways, and direct link to the lesson notes.
5. **On-Site Playback**: Clicking a video result opens `/lessons/[slug]?t=[seconds]`, seamlessly jumping the embedded provider player to that timestamp without leaving the site.

---

## 🔒 Security & Privacy Practices

- **Zero Client Tokens**: Private Sanity tokens and Clerk secrets are never sent to or bundled with the client.
- **Middleware Protection**: Private routes (e.g. `/my-learning`, progress endpoints) are protected via Clerk middleware.
- **Server Mutation Gateways**: Progress tracking records are keyed by Clerk User IDs and written exclusively through authenticated server routes.

---

## 📄 License

This project is licensed under the MIT License.
