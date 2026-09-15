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
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error('❌ Error: SANITY_API_READ_TOKEN or write token is not set');
  process.exit(1);
}

const instructionsContent = `### Content Model & Schema Relationships
- Courses (\`course\`): Top-level entities containing metadata, instructor, category, and an array of embedded \`modules[]\`.
- Modules: Embedded objects inside courses (\`course.modules[]\`), containing \`title\`, \`summary\`, and an array of lesson references (\`lessons[]._ref\`). Module numbers (e.g. Module 5) are derived from array index + 1.
- Lessons (\`lesson\`): Standalone documents with \`title\`, \`slug\`, \`videoUrl\`, \`duration\`, \`poster\`, \`isFreePreview\`, \`keyPoints\`, \`proTip\`, \`notes\` (Portable Text), and \`resources\`.
- Lesson to Course Resolution: Lessons do not store a parent course reference. Resolve the parent course and module via reverse reference: \`*[_type == "course" && references(^._id)][0]\`.
- Video Intelligence (\`video\`): Standalone documents keyed by video ID with \`url\`, \`chapters[]\` ({ startSeconds, label }), and \`chunks[]\` ({ startSeconds, text }).

### Search & Timestamp Rules
- Grounding: Only return facts, lessons, courses, and timestamps that exist in the database. Never hallucinate lessons or timestamps.
- Two-Stage Video Timestamp Resolution:
  1. Primary: Match query tokens against \`video.chapters[].label\`. Chapter labels are concise and accurate.
  2. Fallback: Match against \`video.chunks[].text\` only if no chapter matches.
- Portable Text Search: Match against plain text using \`pt::text(notes)\` or wildcard token matching \`notes[].children[].text match $term\`.
- Ranking: Exact title matches rank highest, followed by lesson notes/key points matches, followed by video chapter moments, followed by transcript chunk matches.`;

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
