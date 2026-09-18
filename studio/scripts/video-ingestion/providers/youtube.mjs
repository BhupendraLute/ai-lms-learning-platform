/**
 * YouTube Video Provider Adapter
 * Handles YouTube URL parsing, ID extraction, chapter parsing, and transcript ingestion.
 */

import { parseChaptersFromText, generateFallbackChapters } from '../parsers/chapter-parser.mjs';
import { parseWebVTT, parseSRT, chunkCues } from '../parsers/caption-parser.mjs';

/**
 * Extracts YouTube video ID from various YouTube URL patterns.
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Checks if a URL is a YouTube URL.
 */
export function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)/i.test(url);
}

/**
 * Normalizes a YouTube URL to canonical format.
 */
export function getCanonicalYouTubeUrl(idOrUrl) {
  const id = extractYouTubeId(idOrUrl) || idOrUrl;
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Processes a YouTube video source into structured video document properties.
 *
 * @param {object} params
 * @param {string} params.url - YouTube video URL
 * @param {string} [params.title] - Video / lesson title
 * @param {number} [params.duration] - Video duration in seconds
 * @param {string} [params.description] - Video description containing chapters
 * @param {string} [params.vtt] - Optional WebVTT caption string
 * @param {string} [params.srt] - Optional SRT caption string
 * @param {Array<string>} [params.keyPoints] - Lesson key points for TOC fallback
 * @param {Array<string>} [params.notesText] - Lesson notes text for transcript fallback
 * @returns {object} Processed video data { id, url, title, duration, chapters, chunks }
 */
export function processYouTubeVideo({
  url,
  title = 'Video Lesson',
  duration = 600,
  description = '',
  vtt = null,
  srt = null,
  keyPoints = [],
  notesText = [],
}) {
  const ytId = extractYouTubeId(url) || 'video';
  const canonicalUrl = getCanonicalYouTubeUrl(ytId);
  const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 600;

  // 1. Chapters: Try parsing from description first, fall back to lesson key points
  let chapters = [];
  if (description) {
    chapters = parseChaptersFromText(description);
  }
  if (chapters.length === 0) {
    chapters = generateFallbackChapters({ title, keyPoints, duration: safeDuration });
  }

  // 2. Transcript Chunks: Try VTT / SRT first, fall back to structured notes chunking
  let chunks = [];
  if (vtt) {
    const rawCues = parseWebVTT(vtt);
    chunks = chunkCues(rawCues, { maxDuration: 40 });
  } else if (srt) {
    const rawCues = parseSRT(srt);
    chunks = chunkCues(rawCues, { maxDuration: 40 });
  }

  if (chunks.length === 0) {
    // Generate timed chunks from notes / key points
    const combinedTexts = [...notesText];
    if (combinedTexts.length === 0) {
      if (keyPoints.length > 0) {
        combinedTexts.push(...keyPoints);
      } else {
        combinedTexts.push(`${title}. In this video lesson we explore key techniques, architectural concepts, and practical implementation details.`);
      }
    }

    const chunkInterval = Math.max(25, Math.floor(safeDuration / Math.max(4, combinedTexts.length)));
    combinedTexts.forEach((txt, cIdx) => {
      const startSec = Math.min(safeDuration - 10, cIdx * chunkInterval);
      chunks.push({
        _key: `chunk-${cIdx}`,
        startSeconds: startSec,
        text: txt,
      });
    });
  }

  return {
    provider: 'youtube',
    id: ytId,
    url: canonicalUrl,
    title,
    duration: safeDuration,
    chapters,
    chunks,
  };
}
