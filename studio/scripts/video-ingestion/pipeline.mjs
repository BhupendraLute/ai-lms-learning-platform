/**
 * Offline Video Ingestion Pipeline Orchestrator
 *
 * Ingests video intelligence (timestamped transcript chunks and table-of-contents chapter markers)
 * across YouTube, Vimeo, and Bunny providers and commits them as Sanity `video` documents.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

import { isYouTubeUrl, processYouTubeVideo, extractYouTubeId } from './providers/youtube.mjs';
import { isVimeoUrl, processVimeoVideo, extractVimeoId } from './providers/vimeo.mjs';
import { isBunnyUrl, processBunnyVideo, extractBunnyId } from './providers/bunny.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads environment variables from project .env.local files.
 */
export function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(__dirname, '../../.env'),
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

/**
 * Sanitizes a string for use in Sanity document IDs.
 * Sanity allows alphanumeric characters, underscores, and dashes,
 * but each dot-separated element must start and end with an alphanumeric character.
 */
export function sanitizeDocumentId(str) {
  if (!str) return 'video_item';
  let clean = str.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^[-_]+|[-_]+$/g, '');
  if (!clean || !/^[a-zA-Z0-9]/.test(clean)) {
    clean = `v_${clean || 'video'}`;
  }
  return clean;
}

/**
 * Extracts plain text lines from Portable Text blocks.
 */
export function blocksToTextArray(blocks) {
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

/**
 * Executes GROQ query against Sanity HTTP API.
 */
export async function runGroqQuery(query, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`);
  url.searchParams.set('query', query);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(`$${k}`, JSON.stringify(v));
  }

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), { method: 'GET', headers });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GROQ Query error (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.result;
}

/**
 * Sends batch mutations to Sanity HTTP API.
 */
export async function sendMutations(mutations) {
  if (!token) {
    throw new Error('SANITY_API_READ_TOKEN / write token is not set');
  }

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

/**
 * Loads lessons from Sanity dataset or falls back to seed.ndjson.
 */
export async function fetchAllLessons() {
  try {
    const groq = `*[_type == "lesson" && defined(videoUrl)] {
      _id,
      title,
      slug,
      videoUrl,
      duration,
      keyPoints,
      "notesText": pt::text(notes),
      notes
    }`;
    const liveLessons = await runGroqQuery(groq);
    if (Array.isArray(liveLessons) && liveLessons.length > 0) {
      return liveLessons;
    }
  } catch (err) {
    // Fall back to local seed files
  }

  // Fallback to seed.ndjson
  const ndjsonPath = path.resolve(__dirname, '../seed/seed.ndjson');
  if (fs.existsSync(ndjsonPath)) {
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

    return rawDocs.filter((d) => d._type === 'lesson' && d.videoUrl);
  }

  return [];
}

/**
 * Main ingestion pipeline execution routine.
 *
 * @param {object} options
 * @param {boolean} [options.dryRun=false] - If true, logs output without mutating Sanity.
 * @param {string} [options.videoUrl] - Process a specific video URL only.
 * @param {string} [options.lessonSlug] - Process a specific lesson only.
 * @param {string} [options.vttContent] - Optional WebVTT captions string.
 * @param {string} [options.srtContent] - Optional SRT captions string.
 * @param {string} [options.description] - Optional description with chapters.
 */
export async function runIngestionPipeline(options = {}) {
  const {
    dryRun = false,
    videoUrl = null,
    lessonSlug = null,
    vttContent = null,
    srtContent = null,
    description = '',
  } = options;

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' 🚀 AI-LMS OFFLINE VIDEO INGESTION PIPELINE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📌 Target Project: ${projectId}`);
  console.log(`📌 Dataset:        ${dataset}`);
  console.log(`📌 Mode:           ${dryRun ? 'DRY-RUN (No mutations)' : 'LIVE INGESTION'}`);

  // Load video metadata mappings if available
  const videosJsonPath = path.resolve(__dirname, '../seed/videos.json');
  let videosMeta = {};
  if (fs.existsSync(videosJsonPath)) {
    videosMeta = JSON.parse(fs.readFileSync(videosJsonPath, 'utf8'));
  }

  // Fetch all lessons
  let lessons = await fetchAllLessons();
  console.log(`📚 Loaded ${lessons.length} lessons with video sources`);

  if (lessonSlug) {
    lessons = lessons.filter((l) => {
      const slug = typeof l.slug === 'object' ? l.slug.current : l.slug || l._id;
      return slug === lessonSlug || slug === `lesson.${lessonSlug}`;
    });
    console.log(`🎯 Filtered to lesson: ${lessonSlug} (${lessons.length} match)`);
  }

  if (videoUrl) {
    lessons = lessons.filter((l) => l.videoUrl === videoUrl);
    if (lessons.length === 0) {
      // Create ad-hoc entry
      lessons = [{
        _id: 'lesson.adhoc',
        title: 'Ad-hoc Video Ingestion',
        videoUrl,
        duration: 600,
        keyPoints: [],
        notes: [],
      }];
    }
  }

  const processedVideos = [];
  const seenUrls = new Set();

  let totalChapters = 0;
  let totalChunks = 0;

  for (const lesson of lessons) {
    const rawUrl = lesson.videoUrl;
    if (!rawUrl || seenUrls.has(rawUrl)) continue;
    seenUrls.add(rawUrl);

    const slugStr = typeof lesson.slug === 'object' ? lesson.slug.current : (lesson.slug || lesson._id.replace('lesson.', ''));
    const meta = videosMeta[slugStr] || {};
    const title = meta.title || lesson.title;
    const duration = typeof lesson.duration === 'number' ? lesson.duration : (meta.duration || 600);
    const keyPoints = Array.isArray(lesson.keyPoints) ? lesson.keyPoints : [];
    const notesText = typeof lesson.notesText === 'string'
      ? lesson.notesText.split('\n').filter(Boolean)
      : blocksToTextArray(lesson.notes);

    let processed;
    if (isYouTubeUrl(rawUrl)) {
      processed = processYouTubeVideo({
        url: rawUrl,
        title,
        duration,
        description,
        vtt: vttContent,
        srt: srtContent,
        keyPoints,
        notesText,
      });
    } else if (isVimeoUrl(rawUrl)) {
      processed = processVimeoVideo({
        url: rawUrl,
        title,
        duration,
        description,
        vtt: vttContent,
        srt: srtContent,
        keyPoints,
        notesText,
      });
    } else if (isBunnyUrl(rawUrl)) {
      processed = processBunnyVideo({
        url: rawUrl,
        title,
        duration,
        description,
        vtt: vttContent,
        srt: srtContent,
        keyPoints,
        notesText,
      });
    } else {
      // Generic / Provider fallback
      processed = processYouTubeVideo({
        url: rawUrl,
        title,
        duration,
        description,
        vtt: vttContent,
        srt: srtContent,
        keyPoints,
        notesText,
      });
    }

    const docId = `video.${sanitizeDocumentId(processed.id)}`;

    const videoDoc = {
      _id: docId,
      _type: 'video',
      id: processed.id,
      url: processed.url,
      title: processed.title,
      duration: processed.duration,
      chapters: processed.chapters,
      chunks: processed.chunks,
    };

    totalChapters += videoDoc.chapters.length;
    totalChunks += videoDoc.chunks.length;
    processedVideos.push(videoDoc);
  }

  console.log(`\n🎬 Generated ${processedVideos.length} Video Intelligence documents`);
  console.log(`📑 Total Chapter Markers: ${totalChapters}`);
  console.log(`🧩 Total Transcript Chunks: ${totalChunks}`);

  if (dryRun) {
    console.log('\n🔍 Sample Video Document Preview:');
    console.log(JSON.stringify(processedVideos[0], null, 2));
    console.log('\n✅ Dry run completed successfully. No mutations sent.');
    return {
      success: true,
      count: processedVideos.length,
      totalChapters,
      totalChunks,
      dryRun: true,
    };
  }

  console.log(`\n💾 Committing ${processedVideos.length} video documents to Sanity...`);
  const BATCH_SIZE = 25;
  for (let i = 0; i < processedVideos.length; i += BATCH_SIZE) {
    const batch = processedVideos.slice(i, i + BATCH_SIZE);
    const mutations = batch.map((doc) => ({ createOrReplace: doc }));
    await sendMutations(mutations);
    const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(processedVideos.length / BATCH_SIZE);
    console.log(`  ✓ Committed batch ${currentBatch}/${totalBatches} (${batch.length} video docs)`);
  }

  console.log('\n✨ Video intelligence ingestion completed successfully!\n');
  return {
    success: true,
    count: processedVideos.length,
    totalChapters,
    totalChunks,
    dryRun: false,
  };
}
