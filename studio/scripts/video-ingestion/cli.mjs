#!/usr/bin/env node

/**
 * AI-LMS Video Ingestion CLI
 *
 * Command line tool for offline video ingestion and verification.
 * Usage:
 *   node studio/scripts/video-ingestion/cli.mjs [options]
 */

import fs from 'node:fs';
import path from 'node:path';
import { runIngestionPipeline } from './pipeline.mjs';

function printHelp() {
  console.log(`
AI-LMS Offline Video Ingestion CLI

Usage:
  node studio/scripts/video-ingestion/cli.mjs [options]

Options:
  --all               Ingest video intelligence for all courses and lessons
  --dry-run           Preview processed video docs without sending Sanity mutations
  --verify            Verify dataset integrity and search query compatibility
  --url <url>         Ingest a specific video URL (YouTube, Vimeo, Bunny)
  --slug <slug>       Ingest a specific lesson by slug
  --vtt <filePath>    Ingest WebVTT subtitle/caption file
  --srt <filePath>    Ingest SubRip (.srt) subtitle/caption file
  --help, -h          Show this help message

Examples:
  npm run ingest:videos
  node studio/scripts/video-ingestion/cli.mjs --dry-run
  node studio/scripts/video-ingestion/cli.mjs --slug nextjs-app-router-in-depth-caching-and-revalidation
  node studio/scripts/video-ingestion/cli.mjs --vtt ./captions/lesson-1.vtt --url https://www.youtube.com/watch?v=VBlSe8tvg4U
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--verify')) {
    await import('./verify.mjs');
    return;
  }

  const dryRun = args.includes('--dry-run');

  let videoUrl = null;
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    videoUrl = args[urlIdx + 1];
  }

  let lessonSlug = null;
  const slugIdx = args.indexOf('--slug');
  if (slugIdx !== -1 && args[slugIdx + 1]) {
    lessonSlug = args[slugIdx + 1];
  }

  let vttContent = null;
  const vttIdx = args.indexOf('--vtt');
  if (vttIdx !== -1 && args[vttIdx + 1]) {
    const vttPath = path.resolve(process.cwd(), args[vttIdx + 1]);
    if (fs.existsSync(vttPath)) {
      vttContent = fs.readFileSync(vttPath, 'utf8');
      console.log(`📄 Loaded WebVTT captions from: ${vttPath}`);
    } else {
      console.error(`❌ File not found: ${vttPath}`);
      process.exit(1);
    }
  }

  let srtContent = null;
  const srtIdx = args.indexOf('--srt');
  if (srtIdx !== -1 && args[srtIdx + 1]) {
    const srtPath = path.resolve(process.cwd(), args[srtIdx + 1]);
    if (fs.existsSync(srtPath)) {
      srtContent = fs.readFileSync(srtPath, 'utf8');
      console.log(`📄 Loaded SubRip SRT captions from: ${srtPath}`);
    } else {
      console.error(`❌ File not found: ${srtPath}`);
      process.exit(1);
    }
  }

  const result = await runIngestionPipeline({
    dryRun,
    videoUrl,
    lessonSlug,
    vttContent,
    srtContent,
  });

  if (!result.success) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Pipeline execution error:', err);
  process.exit(1);
});
