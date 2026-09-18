/**
 * Vimeo Video Provider Adapter
 * Handles Vimeo URL parsing, ID extraction, chapter parsing, and transcript ingestion.
 */

import { parseChaptersFromText, generateFallbackChapters } from '../parsers/chapter-parser.mjs';
import { parseWebVTT, parseSRT, chunkCues } from '../parsers/caption-parser.mjs';

/**
 * Extracts Vimeo video ID from various Vimeo URL patterns.
 */
export function extractVimeoId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)|player\.vimeo\.com\/video\/)(\d+)/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Checks if a URL is a Vimeo URL.
 */
export function isVimeoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /(?:vimeo\.com|player\.vimeo\.com)/i.test(url);
}

/**
 * Normalizes a Vimeo URL to canonical format.
 */
export function getCanonicalVimeoUrl(idOrUrl) {
  const id = extractVimeoId(idOrUrl) || idOrUrl;
  return `https://vimeo.com/${id}`;
}

/**
 * Processes a Vimeo video source into structured video document properties.
 */
export function processVimeoVideo({
  url,
  title = 'Video Lesson',
  duration = 600,
  description = '',
  vtt = null,
  srt = null,
  keyPoints = [],
  notesText = [],
}) {
  const vimeoId = extractVimeoId(url) || 'vimeo-video';
  const canonicalUrl = getCanonicalVimeoUrl(vimeoId);
  const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 600;

  // 1. Chapters
  let chapters = [];
  if (description) {
    chapters = parseChaptersFromText(description);
  }
  if (chapters.length === 0) {
    chapters = generateFallbackChapters({ title, keyPoints, duration: safeDuration });
  }

  // 2. Transcript Chunks
  let chunks = [];
  if (vtt) {
    const rawCues = parseWebVTT(vtt);
    chunks = chunkCues(rawCues, { maxDuration: 40 });
  } else if (srt) {
    const rawCues = parseSRT(srt);
    chunks = chunkCues(rawCues, { maxDuration: 40 });
  }

  if (chunks.length === 0) {
    const combinedTexts = [...notesText];
    if (combinedTexts.length === 0) {
      if (keyPoints.length > 0) {
        combinedTexts.push(...keyPoints);
      } else {
        combinedTexts.push(`${title}. In this video lesson we explore key concepts and practical implementations.`);
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
    provider: 'vimeo',
    id: `vimeo_${vimeoId}`,
    url: canonicalUrl,
    title,
    duration: safeDuration,
    chapters,
    chunks,
  };
}
