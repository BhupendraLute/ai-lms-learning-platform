import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
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

function blocksToTextArray(blocks) {
  if (!Array.isArray(blocks)) return [];
  const lines = [];
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      const text = block.children.map((c) => c.text || '').join('').trim();
      if (text) lines.push(text);
    }
  }
  return lines;
}

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

function sanitizeId(str) {
  const clean = str.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '');
  return clean || 'video';
}

async function sendMutations(mutations) {
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity mutation error (${res.status}): ${errText}`);
  }

  return await res.json();
}

async function seedVideos() {
  console.log('🎥 Starting Video Intelligence Ingestion...');
  console.log(`📌 Target Project: ${projectId}`);
  console.log(`📌 Dataset:        ${dataset}`);

  const ndjsonPath = path.resolve(__dirname, 'seed.ndjson');
  const videosJsonPath = path.resolve(__dirname, 'videos.json');

  let videosMeta = {};
  if (fs.existsSync(videosJsonPath)) {
    videosMeta = JSON.parse(fs.readFileSync(videosJsonPath, 'utf8'));
    console.log(`📄 Loaded ${Object.keys(videosMeta).length} video metadata entries`);
  }

  const rawDocs = [];
  const fileStream = fs.createReadStream(ndjsonPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rawDocs.push(JSON.parse(trimmed));
    } catch (e) {
      // ignore
    }
  }

  const lessons = rawDocs.filter((d) => d._type === 'lesson');
  console.log(`📚 Found ${lessons.length} lessons in dataset`);

  const videoDocs = [];
  const seenVideoUrls = new Set();

  for (const lesson of lessons) {
    const videoUrl = lesson.videoUrl;
    if (!videoUrl || seenVideoUrls.has(videoUrl)) continue;
    seenVideoUrls.add(videoUrl);

    const slugStr = typeof lesson.slug === 'object' ? lesson.slug.current : lesson._id.replace('lesson.', '');
    const meta = videosMeta[slugStr] || {};
    const ytId = extractYouTubeId(videoUrl) || meta.id || sanitizeId(slugStr);
    const duration = typeof lesson.duration === 'number' ? lesson.duration : (meta.duration || 600);
    const videoId = sanitizeId(`video.${ytId}`);

    const keyPoints = Array.isArray(lesson.keyPoints) ? lesson.keyPoints : [];
    const notesText = blocksToTextArray(lesson.notes);

    // 1. Build Table of Contents (Chapters)
    const chapters = [];
    chapters.push({
      _key: 'ch-0',
      startSeconds: 0,
      label: `Introduction to ${lesson.title}`,
    });

    if (keyPoints.length > 0) {
      const step = Math.floor((duration * 0.8) / (keyPoints.length + 1));
      keyPoints.forEach((kp, idx) => {
        const startSec = Math.min(duration - 30, Math.max(30, (idx + 1) * step));
        chapters.push({
          _key: `ch-${idx + 1}`,
          startSeconds: startSec,
          label: kp,
        });
      });
    } else {
      chapters.push({
        _key: 'ch-1',
        startSeconds: Math.floor(duration * 0.3),
        label: `Core Concepts & Architecture`,
      });
      chapters.push({
        _key: 'ch-2',
        startSeconds: Math.floor(duration * 0.65),
        label: `Hands-on Implementation & Best Practices`,
      });
    }

    chapters.push({
      _key: `ch-summary`,
      startSeconds: Math.max(Math.floor(duration * 0.88), duration - 45),
      label: `Summary & Key Takeaways`,
    });

    // Sort chapters ascending by startSeconds
    chapters.sort((a, b) => a.startSeconds - b.startSeconds);

    // 2. Build Transcript Chunks (timestamped segments every ~30-45s)
    const chunks = [];
    const combinedTexts = [...notesText];
    if (combinedTexts.length === 0) {
      combinedTexts.push(`${lesson.title}. In this video we explore key techniques and implementation details.`);
    }

    const chunkInterval = Math.max(25, Math.floor(duration / Math.max(4, combinedTexts.length)));
    combinedTexts.forEach((txt, cIdx) => {
      const startSec = Math.min(duration - 10, cIdx * chunkInterval);
      chunks.push({
        _key: `chunk-${cIdx}`,
        startSeconds: startSec,
        text: txt,
      });
    });

    videoDocs.push({
      _id: videoId,
      _type: 'video',
      id: ytId,
      url: videoUrl,
      title: meta.title || lesson.title,
      duration,
      chapters,
      chunks,
    });
  }

  console.log(`\n💾 Committing ${videoDocs.length} video documents to Sanity...`);
  const BATCH_SIZE = 25;
  for (let i = 0; i < videoDocs.length; i += BATCH_SIZE) {
    const batch = videoDocs.slice(i, i + BATCH_SIZE);
    const mutations = batch.map((doc) => ({ createOrReplace: doc }));
    await sendMutations(mutations);
    console.log(`  ✓ Committed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(videoDocs.length / BATCH_SIZE)} (${batch.length} videos)`);
  }

  console.log('✨ Video documents ingestion complete!\n');
}

seedVideos().catch((err) => {
  console.error('❌ Ingestion failed:', err);
  process.exit(1);
});
