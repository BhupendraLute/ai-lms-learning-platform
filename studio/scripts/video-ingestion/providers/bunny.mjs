/**
 * Bunny Stream Video Provider Adapter
 * Handles Bunny Stream URL parsing, ID extraction, chapter parsing, and transcript ingestion.
 */

import { parseChaptersFromText, generateFallbackChapters } from '../parsers/chapter-parser.mjs';
import { parseWebVTT, parseSRT, chunkCues } from '../parsers/caption-parser.mjs';

/**
 * Extracts Bunny video and library ID from Bunny Stream URL patterns.
 */
export function extractBunnyId(url) {
  if (!url || typeof url !== 'string') return null;

  // Match: iframe.mediadelivery.net/embed/12345/abc-def-ghi or /play/12345/abc-def-ghi
  const embedMatch = url.match(/mediadelivery\.net\/(?:embed|play)\/([^\/]+)\/([^\/?#]+)/i);
  if (embedMatch) {
    return {
      libraryId: embedMatch[1],
      videoId: embedMatch[2],
      fullId: `${embedMatch[1]}_${embedMatch[2]}`,
    };
  }

  // Match: video.bunnycdn.com/play/12345/abc-def
  const bunnyCdnMatch = url.match(/video\.bunnycdn\.com\/play\/([^\/]+)\/([^\/?#]+)/i);
  if (bunnyCdnMatch) {
    return {
      libraryId: bunnyCdnMatch[1],
      videoId: bunnyCdnMatch[2],
      fullId: `${bunnyCdnMatch[1]}_${bunnyCdnMatch[2]}`,
    };
  }

  // Direct pullzone pattern: *.b-cdn.net/video-id/...
  const bCdnMatch = url.match(/([a-zA-Z0-9_-]+)\.b-cdn\.net/i);
  if (bCdnMatch) {
    return {
      libraryId: 'bunny',
      videoId: bCdnMatch[1],
      fullId: `bunny_${bCdnMatch[1]}`,
    };
  }

  return null;
}

/**
 * Checks if a URL is a Bunny Stream URL.
 */
export function isBunnyUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /(?:mediadelivery\.net|bunnycdn\.com|b-cdn\.net)/i.test(url);
}

/**
 * Normalizes a Bunny Stream URL to canonical embed format.
 */
export function getCanonicalBunnyUrl(libraryId, videoId) {
  if (!libraryId || !videoId) return null;
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
}

/**
 * Processes a Bunny Stream video source into structured video document properties.
 */
export function processBunnyVideo({
  url,
  title = 'Video Lesson',
  duration = 600,
  description = '',
  vtt = null,
  srt = null,
  keyPoints = [],
  notesText = [],
}) {
  const bunnyInfo = extractBunnyId(url);
  const videoId = bunnyInfo ? bunnyInfo.fullId : 'bunny-video';
  const canonicalUrl = bunnyInfo
    ? getCanonicalBunnyUrl(bunnyInfo.libraryId, bunnyInfo.videoId)
    : url;
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
        combinedTexts.push(`${title}. In this video lesson we explore key techniques and practical implementations.`);
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
    provider: 'bunny',
    id: `bunny_${videoId}`,
    url: canonicalUrl || url,
    title,
    duration: safeDuration,
    chapters,
    chunks,
  };
}
