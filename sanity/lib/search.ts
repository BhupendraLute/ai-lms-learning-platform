import { serverClient } from './client'
import {
  SEARCH_ALL_COURSES_TREE_QUERY,
  SEARCH_VIDEO_CHAPTERS_QUERY,
  SEARCH_VIDEO_CHUNKS_QUERY,
} from './queries'
import { urlForImage } from './image'
import type { SanityImageSource } from '@sanity/image-url'
import { createOpenAI } from '@ai-sdk/openai'

export function getSlugString(slug?: { current?: string } | string | null): string {
  if (!slug) return ''
  if (typeof slug === 'string') return slug
  return slug.current || ''
}

export interface SearchResultVideo {
  id: string;
  courseTitle: string;
  courseSlug: string;
  courseIcon: string;
  moduleTitle: string;
  moduleNumber: number;
  lessonTitle: string;
  lessonSlug: string;
  lessonNumber: string;
  thumbnailUrl?: string;
  duration: string;
  clipLength?: string;
  startSeconds: number;
  formattedTimestamp: string;
  description: string;
  matchType: 'chapter' | 'transcript' | 'topic';
  watchUrl: string;
  score: number;
}

export interface SearchResultLesson {
  id: string;
  courseTitle: string;
  courseSlug: string;
  courseIcon: string;
  moduleTitle: string;
  moduleNumber: number;
  lessonTitle: string;
  lessonSlug: string;
  lessonNumber: string;
  keyPoints: string[];
  description: string;
  lessonUrl: string;
  score: number;
}

export interface SearchStats {
  totalResults: number;
  coursesCount: number;
  videoResultsCount: number;
  lessonResultsCount: number;
}

export interface SearchResponse {
  query: string;
  stats: SearchStats;
  videoResults: SearchResultVideo[];
  lessonResults: SearchResultLesson[];
}

export interface SearchOptions {
  sort?: 'relevance' | 'duration' | 'newest';
  limit?: number;
}

// Map course/category name to iconic badge name
export function getCourseIconType(title: string, slug?: string): string {
  const combined = `${title || ''} ${slug || ''}`.toLowerCase();
  if (combined.includes('next') || combined.includes('nextjs') || combined.includes('next.js')) return 'nextjs';
  if (combined.includes('react')) return 'react';
  if (combined.includes('docker') || combined.includes('devops') || combined.includes('kubernetes') || combined.includes('k8s')) return 'docker';
  if (combined.includes('typescript') || combined.includes('ts')) return 'typescript';
  if (combined.includes('node') || combined.includes('backend') || combined.includes('express')) return 'nodejs';
  if (combined.includes('javascript') || combined.includes('js')) return 'javascript';
  if (combined.includes('python') || combined.includes('data') || combined.includes('pandas')) return 'python';
  if (combined.includes('rag') || combined.includes('ai') || combined.includes('llm') || combined.includes('vector')) return 'ai';
  if (combined.includes('security') || combined.includes('auth')) return 'security';
  return 'code';
}

// Format seconds into MM:SS or HH:MM:SS
export function formatSeconds(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Convert string duration (e.g. "12:45" or "10m") to seconds
export function parseDurationToSeconds(durationStr: string | number): number {
  if (typeof durationStr === 'number') return durationStr;
  if (!durationStr || typeof durationStr !== 'string') return 600;
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  if (parts.length === 3) {
    const hrs = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    const secs = parseInt(parts[2], 10) || 0;
    return hrs * 3600 + mins * 60 + secs;
  }
  const match = durationStr.match(/(\d+)\s*m(?:in)?/i);
  if (match) return parseInt(match[1], 10) * 60;
  return 600;
}

// OpenCode Zen Client initialization helper
export function getOpenCodeClient() {
  const apiKey = process.env.OPENCODE_ZEN_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseURL = process.env.OPENCODE_ZEN_BASE_URL || 'https://api.opencode.ai/v1';
  return createOpenAI({
    baseURL,
    apiKey,
  });
}

export interface CourseTreeLesson {
  _id: string;
  title: string;
  slug?: { current?: string } | string;
  videoUrl?: string;
  poster?: unknown;
  duration?: string;
  isFreePreview?: boolean;
  keyPoints?: string[];
  notesText?: string;
  proTip?: string;
}

export interface CourseTreeModule {
  _key?: string;
  title: string;
  summary?: string;
  lessons?: CourseTreeLesson[];
}

export interface CourseTreeItem {
  _id: string;
  title: string;
  slug?: { current?: string } | string;
  summary?: string;
  coverImage?: unknown;
  category?: { _id: string; title: string; slug?: { current?: string } | string };
  modules?: CourseTreeModule[];
}

export interface VideoChapterMatch {
  _key?: string;
  startSeconds?: number;
  label?: string;
}

export interface VideoChapterQueryResult {
  _id: string;
  _type: string;
  id?: string;
  url?: string;
  title?: string;
  duration?: number;
  matchedChapters?: VideoChapterMatch[];
  lesson?: CourseTreeLesson & { course?: CourseTreeItem };
}

export interface VideoChunkMatch {
  _key?: string;
  startSeconds?: number;
  text?: string;
}

export interface VideoChunkQueryResult {
  _id: string;
  _type: string;
  id?: string;
  url?: string;
  title?: string;
  duration?: number;
  matchedChunks?: VideoChunkMatch[];
  lesson?: CourseTreeLesson & { course?: CourseTreeItem };
}

// Cache for initial-context schema
let cachedInitialContext: unknown = null;
let lastContextFetch = 0;

export async function fetchSanityInitialContext(): Promise<unknown> {
  const now = Date.now();
  if (cachedInitialContext && now - lastContextFetch < 1000 * 60 * 30) {
    return cachedInitialContext;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oxyuqwfg';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!token) return null;

  const url = `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}/initial-context`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      cachedInitialContext = await res.json();
      lastContextFetch = now;
      return cachedInitialContext;
    }
  } catch {
    // If studio is not deployed, fallback gracefully
  }
  return null;
}

/**
 * Intelligent Grounded Search Engine
 * Searches courses, lessons, and video moments with two-stage timestamp resolution.
 */
export async function searchLearningPlatform(
  rawQuery: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const query = (rawQuery || '').trim();
  if (!query) {
    return {
      query: '',
      stats: { totalResults: 0, coursesCount: 0, videoResultsCount: 0, lessonResultsCount: 0 },
      videoResults: [],
      lessonResults: [],
    };
  }

  const cleanQuery = query.toLowerCase();
  const searchTokens = cleanQuery
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const term = `*${cleanQuery}*`;
  const wildcard = searchTokens.length > 0 ? `*${searchTokens.join('* *')}*` : `*${cleanQuery}*`;

  // Fetch structural course tree and timestamped video matches in parallel
  const [coursesTree, videoChaptersResult, videoChunksResult] = await Promise.all([
    serverClient.fetch<CourseTreeItem[]>(SEARCH_ALL_COURSES_TREE_QUERY).catch((err) => {
      console.error('Error fetching course tree for search:', err);
      return [];
    }),
    serverClient.fetch<VideoChapterQueryResult[]>(SEARCH_VIDEO_CHAPTERS_QUERY, { term, wildcard }).catch((err) => {
      console.error('Error fetching video chapters for search:', err);
      return [];
    }),
    serverClient.fetch<VideoChunkQueryResult[]>(SEARCH_VIDEO_CHUNKS_QUERY, { term, wildcard }).catch((err) => {
      console.error('Error fetching video chunks for search:', err);
      return [];
    }),
  ]);

  const videoResultsMap = new Map<string, SearchResultVideo>();
  const lessonResultsMap = new Map<string, SearchResultLesson>();
  const touchedCourses = new Set<string>();

  // Helper map: lesson ID / slug -> { course, module, moduleIndex, lessonIndex, lesson }
  interface LessonLocation {
    course: CourseTreeItem;
    module: CourseTreeModule;
    moduleIndex: number;
    lessonIndex: number;
    lesson: CourseTreeLesson;
    lessonNumber: string;
  }

  const lessonLookup = new Map<string, LessonLocation>();
  const lessonByVideoUrl = new Map<string, LessonLocation>();

  if (Array.isArray(coursesTree)) {
    for (const course of coursesTree) {
      if (!course?.modules) continue;
      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const mod = course.modules[mIdx];
        if (!mod?.lessons) continue;
        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const les = mod.lessons[lIdx];
          if (!les) continue;
          const lessonNumber = `Lesson ${mIdx + 1}.${lIdx + 1}`;
          const loc: LessonLocation = {
            course,
            module: mod,
            moduleIndex: mIdx + 1,
            lessonIndex: lIdx + 1,
            lesson: les,
            lessonNumber,
          };
          const lessonSlugStr = getSlugString(les.slug);
          if (les._id) lessonLookup.set(les._id, loc);
          if (lessonSlugStr) lessonLookup.set(lessonSlugStr, loc);
          if (les.videoUrl) lessonByVideoUrl.set(les.videoUrl, loc);
        }
      }
    }
  }

  // 1. STAGE 1: Match Video Chapters (Primary Timestamp Resolution)
  if (Array.isArray(videoChaptersResult)) {
    for (const item of videoChaptersResult) {
      const videoUrl = item.url;
      const loc = (videoUrl ? lessonByVideoUrl.get(videoUrl) : null) || (item.lesson?._id ? lessonLookup.get(item.lesson._id) : null);
      if (!loc) continue;

      const matchedChapters = item.matchedChapters || [];
      for (const ch of matchedChapters) {
        const startSeconds = typeof ch.startSeconds === 'number' ? ch.startSeconds : 0;
        const formattedTimestamp = formatSeconds(startSeconds);
        const courseSlug = getSlugString(loc.course.slug);
        const lessonSlug = getSlugString(loc.lesson.slug);
        const courseIcon = getCourseIconType(loc.course.title, courseSlug);
        const thumbUrl = urlForImage(loc.lesson.poster as SanityImageSource) || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

        // Calculate score
        const labelLower = (ch.label || '').toLowerCase();
        let score = 50;
        if (labelLower === cleanQuery) score += 50;
        else if (labelLower.includes(cleanQuery)) score += 30;
        searchTokens.forEach((tok) => {
          if (labelLower.includes(tok)) score += 10;
        });

        const key = `${loc.lesson._id}-ch-${startSeconds}`;
        videoResultsMap.set(key, {
          id: key,
          courseTitle: loc.course.title,
          courseSlug,
          courseIcon,
          moduleTitle: loc.module.title,
          moduleNumber: loc.moduleIndex,
          lessonTitle: loc.lesson.title,
          lessonSlug,
          lessonNumber: loc.lessonNumber,
          thumbnailUrl: thumbUrl,
          duration: loc.lesson.duration || '10:00',
          startSeconds,
          formattedTimestamp,
          description: ch.label || `Learn ${loc.lesson.title} in depth.`,
          matchType: 'chapter',
          watchUrl: `/courses/${courseSlug}/lessons/${lessonSlug}?start=${startSeconds}`,
          score,
        });

        touchedCourses.add(courseSlug);
      }
    }
  }

  // 2. STAGE 2: Match Video Transcript Chunks (Fallback Timestamp Resolution)
  if (Array.isArray(videoChunksResult)) {
    for (const item of videoChunksResult) {
      const videoUrl = item.url;
      const loc = (videoUrl ? lessonByVideoUrl.get(videoUrl) : null) || (item.lesson?._id ? lessonLookup.get(item.lesson._id) : null);
      if (!loc) continue;

      const courseSlug = getSlugString(loc.course.slug);
      const lessonSlug = getSlugString(loc.lesson.slug);

      // If we already have chapter matches for this lesson, skip chunk noise (Section 7 Two-Stage rule)
      const hasChapterMatch = Array.from(videoResultsMap.values()).some(
        (vr) => vr.lessonSlug === lessonSlug && vr.matchType === 'chapter'
      );
      if (hasChapterMatch) continue;

      const matchedChunks = item.matchedChunks || [];
      for (const chunk of matchedChunks) {
        const startSeconds = typeof chunk.startSeconds === 'number' ? chunk.startSeconds : 0;
        const formattedTimestamp = formatSeconds(startSeconds);
        const courseIcon = getCourseIconType(loc.course.title, courseSlug);
        const thumbUrl = urlForImage(loc.lesson.poster as SanityImageSource) || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

        const chunkLower = (chunk.text || '').toLowerCase();
        let score = 30;
        if (chunkLower.includes(cleanQuery)) score += 20;
        searchTokens.forEach((tok) => {
          if (chunkLower.includes(tok)) score += 5;
        });

        const key = `${loc.lesson._id}-chunk-${startSeconds}`;
        if (!videoResultsMap.has(key)) {
          videoResultsMap.set(key, {
            id: key,
            courseTitle: loc.course.title,
            courseSlug,
            courseIcon,
            moduleTitle: loc.module.title,
            moduleNumber: loc.moduleIndex,
            lessonTitle: loc.lesson.title,
            lessonSlug,
            lessonNumber: loc.lessonNumber,
            thumbnailUrl: thumbUrl,
            duration: loc.lesson.duration || '10:00',
            startSeconds,
            formattedTimestamp,
            description: chunk.text || `Discussion in ${loc.lesson.title}.`,
            matchType: 'transcript',
            watchUrl: `/courses/${courseSlug}/lessons/${lessonSlug}?start=${startSeconds}`,
            score,
          });
        }

        touchedCourses.add(courseSlug);
      }
    }
  }

  // 3. Match Lessons on Topic (Title, Key Points, Notes, Summary)
  if (Array.isArray(coursesTree)) {
    for (const course of coursesTree) {
      if (!course?.modules) continue;
      const courseSlug = getSlugString(course.slug);
      const courseIcon = getCourseIconType(course.title, courseSlug);

      for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
        const mod = course.modules[mIdx];
        if (!mod?.lessons) continue;
        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const les = mod.lessons[lIdx];
          if (!les) continue;
          const lessonSlug = getSlugString(les.slug);
          const lessonNumber = `Lesson ${mIdx + 1}.${lIdx + 1}`;

          const titleLower = (les.title || '').toLowerCase();
          const notesLower = (les.notesText || '').toLowerCase();
          const proTipLower = (les.proTip || '').toLowerCase();
          const keyPointsArr: string[] = Array.isArray(les.keyPoints) ? les.keyPoints : [];
          const keyPointsLower = keyPointsArr.join(' ').toLowerCase();
          const moduleLower = (mod.title || '').toLowerCase();
          const courseLower = (course.title || '').toLowerCase();

          let score = 0;
          let isMatch = false;

          // Exact phrase match in lesson title
          if (titleLower === cleanQuery) {
            score += 120;
            isMatch = true;
          } else if (titleLower.includes(cleanQuery)) {
            score += 80;
            isMatch = true;
          }

          // Match in key points
          if (keyPointsLower.includes(cleanQuery)) {
            score += 60;
            isMatch = true;
          }

          // Match in notes / pro tip
          if (notesLower.includes(cleanQuery) || proTipLower.includes(cleanQuery)) {
            score += 40;
            isMatch = true;
          }

          // Match in module or course title
          if (moduleLower.includes(cleanQuery) || courseLower.includes(cleanQuery)) {
            score += 25;
            isMatch = true;
          }

          // Individual token matching
          for (const tok of searchTokens) {
            if (titleLower.includes(tok)) {
              score += 20;
              isMatch = true;
            }
            if (keyPointsLower.includes(tok)) {
              score += 15;
              isMatch = true;
            }
            if (notesLower.includes(tok)) {
              score += 10;
              isMatch = true;
            }
          }

          if (isMatch) {
            touchedCourses.add(courseSlug);

            // Add as Lesson Result card
            const description =
              les.proTip ||
              (keyPointsArr.length > 0 ? keyPointsArr[0] : null) ||
              mod.summary ||
              `In-depth guide to ${les.title}.`;

            lessonResultsMap.set(les._id || lessonSlug, {
              id: les._id || lessonSlug,
              courseTitle: course.title,
              courseSlug,
              courseIcon,
              moduleTitle: mod.title,
              moduleNumber: mIdx + 1,
              lessonTitle: les.title,
              lessonSlug,
              lessonNumber,
              keyPoints: keyPointsArr.slice(0, 3),
              description,
              lessonUrl: `/courses/${courseSlug}/lessons/${lessonSlug}`,
              score,
            });

            // Also ensure a high-quality video moment card is created if not already matched
            const videoKey = `${les._id}-top`;
            if (!videoResultsMap.has(videoKey)) {
              const startSeconds = 0;
              const formattedTimestamp = formatSeconds(startSeconds);
              const thumbUrl = urlForImage(les.poster as SanityImageSource) || `https://i.ytimg.com/vi/default/hqdefault.jpg`;

              videoResultsMap.set(videoKey, {
                id: videoKey,
                courseTitle: course.title,
                courseSlug,
                courseIcon,
                moduleTitle: mod.title,
                moduleNumber: mIdx + 1,
                lessonTitle: les.title,
                lessonSlug,
                lessonNumber,
                thumbnailUrl: thumbUrl,
                duration: les.duration || '10:00',
                startSeconds,
                formattedTimestamp,
                description: les.notesText?.slice(0, 140) || description,
                matchType: 'topic',
                watchUrl: `/courses/${courseSlug}/lessons/${lessonSlug}?start=0`,
                score: score - 5,
              });
            }
          }
        }
      }
    }
  }

  // Convert to arrays and sort
  let videoResults = Array.from(videoResultsMap.values());
  let lessonResults = Array.from(lessonResultsMap.values());

  const sortOrder = options.sort || 'relevance';
  if (sortOrder === 'relevance') {
    videoResults.sort((a, b) => b.score - a.score);
    lessonResults.sort((a, b) => b.score - a.score);
  } else if (sortOrder === 'duration') {
    videoResults.sort((a, b) => parseDurationToSeconds(b.duration) - parseDurationToSeconds(a.duration));
  }

  if (options.limit && options.limit > 0) {
    videoResults = videoResults.slice(0, options.limit);
    lessonResults = lessonResults.slice(0, options.limit);
  }

  const totalResults = videoResults.length + lessonResults.length;

  return {
    query,
    stats: {
      totalResults,
      coursesCount: touchedCourses.size,
      videoResultsCount: videoResults.length,
      lessonResultsCount: lessonResults.length,
    },
    videoResults,
    lessonResults,
  };
}
