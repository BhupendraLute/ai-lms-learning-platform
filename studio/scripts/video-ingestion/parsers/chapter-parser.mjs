/**
 * Chapter Parser & Table of Contents Generator
 * Parses timestamped chapter markers from video descriptions, VTT chapter tracks,
 * or derives clean table-of-contents intervals from structured lesson metadata.
 */

import { timecodeToSeconds } from './caption-parser.mjs';

/**
 * Extracts timestamped chapters from description text.
 * Matches patterns like:
 * - 00:00 Introduction
 * - 01:23 - Getting Started
 * - (04:15) Architecture Deep Dive
 * - 1:02:45 Summary & Next Steps
 */
export function parseChaptersFromText(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split('\n');
  const chapters = [];
  const timestampRegex = /(?:^|\s|\()((?:\d{1,2}:)?\d{1,2}:\d{2})(?:\)|\s|-|:|\.)\s*(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(timestampRegex);
    if (match) {
      const timecode = match[1];
      let label = match[2].trim();

      // Clean leading dashes, colons, or punctuation from label
      label = label.replace(/^[-–—:.)\]\s]+/, '').trim();

      if (label) {
        const startSec = timecodeToSeconds(timecode);
        chapters.push({
          startSeconds: startSec,
          label,
        });
      }
    }
  }

  // Sort ascending by startSeconds
  chapters.sort((a, b) => a.startSeconds - b.startSeconds);

  // Deduplicate and format with unique keys
  return formatChapters(chapters);
}

/**
 * Generates structured chapter TOC from lesson metadata (title, keyPoints, duration).
 * Used when external provider description does not contain manual chapter markers.
 */
export function generateFallbackChapters({ title, keyPoints = [], duration = 600 }) {
  const chapters = [];
  const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 600;

  // 1. First chapter: Intro
  chapters.push({
    startSeconds: 0,
    label: `Introduction to ${title || 'Lesson'}`,
  });

  // 2. Middle chapters from key points or core concepts
  if (Array.isArray(keyPoints) && keyPoints.length > 0) {
    const step = Math.floor((safeDuration * 0.8) / (keyPoints.length + 1));
    keyPoints.forEach((kp, idx) => {
      const startSec = Math.min(safeDuration - 30, Math.max(30, (idx + 1) * step));
      chapters.push({
        startSeconds: startSec,
        label: kp,
      });
    });
  } else {
    chapters.push({
      startSeconds: Math.floor(safeDuration * 0.3),
      label: 'Core Concepts & Architecture',
    });
    chapters.push({
      startSeconds: Math.floor(safeDuration * 0.65),
      label: 'Hands-on Implementation & Best Practices',
    });
  }

  // 3. Final chapter: Summary & Key Takeaways
  chapters.push({
    startSeconds: Math.max(Math.floor(safeDuration * 0.88), safeDuration - 45),
    label: 'Summary & Key Takeaways',
  });

  chapters.sort((a, b) => a.startSeconds - b.startSeconds);
  return formatChapters(chapters);
}

/**
 * Formats chapters array with unique _key and ensures ascending order with no negative values.
 */
export function formatChapters(rawChapters) {
  if (!Array.isArray(rawChapters) || rawChapters.length === 0) return [];

  const seenTimes = new Set();
  const formatted = [];

  for (let i = 0; i < rawChapters.length; i++) {
    const ch = rawChapters[i];
    const startSec = Math.max(0, Math.floor(ch.startSeconds || 0));

    if (seenTimes.has(startSec)) {
      // Adjust startSec slightly if duplicate
      continue;
    }
    seenTimes.add(startSec);

    formatted.push({
      _key: `ch-${formatted.length}`,
      startSeconds: startSec,
      label: ch.label || `Chapter ${formatted.length + 1}`,
    });
  }

  return formatted;
}
