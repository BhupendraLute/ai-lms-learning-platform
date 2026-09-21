import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'oxyuqwfg';

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error('❌ Error: SANITY_API_WRITE_TOKEN or SANITY_AUTH_TOKEN is not set');
  process.exit(1);
}

const instructionsContent = `### Rules
- Always filter out drafts: use !(_id in path("drafts.**")).
- Ground all facts strictly in database results. Never invent or assume courses, lessons, durations, or timestamps.
- Video documents are an internal lookup only. Never return video documents standalone; always associate them with their parent lesson and course.

### Schema Relationships
- Course Modules: Modules are embedded objects inside courses (\`course.modules[]\`), not standalone documents. Module numbers (e.g., Module 5) and lesson numbers (e.g., Lesson 5.1) are derived from array index order + 1, not stored.
- Lesson to Course Resolution: Lessons do not store a parent course pointer. To resolve the parent course and module for a lesson, use reverse references: \`*[_type == "course" && references(^._id)][0]\`.
- Video Intelligence: Video documents (\`_type == "video"\`) are keyed by video URL (\`lesson.videoUrl == video.url\`). They contain \`chapters[]\` ({ startSeconds, label }) and \`chunks[]\` ({ startSeconds, text }).

### Two-Stage Timestamp Resolution
1. Stage 1 (Chapters Primary): Match query tokens against \`video.chapters[].label\`. Chapter labels are clean, curated markers and take priority.
2. Stage 2 (Transcript Chunks Fallback): If and only if no chapters match for a lesson, match against \`video.chunks[].text\` (retrieve only top 2-3 matched chunks per video).

### Text Search & Query Patterns
- Wildcard Matching: Always tokenize keywords and use wildcard OR patterns (e.g., \`*keyword1* || *keyword2*\`), never full phrases as single strings.
- Portable Text: Match notes using plain text projection: \`pt::text(notes) match $term\`.
- Ranking Specificity: Exact title concept matches rank highest, followed by key points, chapter labels, notes text, and transcript chunks.`;

const agentContextDoc = {
  _id: 'sanity.agentContext.default',
  _type: 'sanity.agentContext',
  title: 'AI-LMS Search Agent Context',
  slug: {
    _type: 'slug',
    current: 'default',
  },
  groqFilter: '!(_id in path("drafts.**")) && _type in ["course", "lesson", "video", "instructor", "category"]',
  instructions: instructionsContent,
};

async function seedContext() {
  console.log('🤖 Seeding Sanity Agent Context Document...');
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [
        {
          createOrReplace: agentContextDoc,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to seed agent context: ${errText}`);
  }

  const result = await res.json();
  console.log('✓ Agent Context document seeded successfully:', result);
}

seedContext().catch((err) => {
  console.error('❌ Context seeding failed:', err);
  process.exit(1);
});
