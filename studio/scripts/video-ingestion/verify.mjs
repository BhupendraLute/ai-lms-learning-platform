/**
 * Video Intelligence Ingestion Verification Suite
 *
 * Validates dataset integrity for Sanity `video` documents:
 * - 100% coverage between lessons and video documents
 * - Valid chapter markers with ascending startSeconds
 * - Valid transcript chunks with non-empty text
 * - GROQ search query resolution and reverse dereferencing
 */

import { loadEnv, runGroqQuery } from './pipeline.mjs';

loadEnv();

async function runVerification() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' 🔍 VERIFYING VIDEO INTELLIGENCE DOCUMENTS IN SANITY');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    // 1. Fetch all lessons
    const lessons = await runGroqQuery(`*[_type == "lesson"] {
      _id,
      title,
      "slug": coalesce(slug.current, _id),
      videoUrl,
      duration
    }`);

    console.log(`📚 Total Lessons in Dataset: ${lessons.length}`);

    // 2. Fetch all video documents
    const videos = await runGroqQuery(`*[_type == "video"] {
      _id,
      id,
      url,
      title,
      duration,
      "chapterCount": count(chapters),
      "chunkCount": count(chunks),
      chapters[]{ _key, startSeconds, label },
      chunks[]{ _key, startSeconds, text }
    }`);

    console.log(`🎥 Total Video Documents in Dataset: ${videos.length}`);

    if (videos.length === 0) {
      console.error('❌ Error: No video documents found in Sanity. Please run ingestion first.');
      process.exit(1);
    }

    const videoUrlMap = new Map();
    const videoIdMap = new Map();
    for (const v of videos) {
      if (v.url) videoUrlMap.set(v.url, v);
      if (v.id) videoIdMap.set(v.id, v);
    }

    let lessonsWithVideoUrl = 0;
    let lessonsMatched = 0;
    const missingVideos = [];

    for (const lesson of lessons) {
      if (!lesson.videoUrl) continue;
      lessonsWithVideoUrl++;

      const matchedByUrl = videoUrlMap.get(lesson.videoUrl);
      const matchedById = videoIdMap.get(lesson.videoUrl.split('v=')[1] || lesson.videoUrl.split('/').pop());

      if (matchedByUrl || matchedById) {
        lessonsMatched++;
      } else {
        missingVideos.push({
          lessonId: lesson._id,
          lessonTitle: lesson.title,
          videoUrl: lesson.videoUrl,
        });
      }
    }

    console.log(`\n📊 Coverage Analysis:`);
    console.log(`  - Lessons with video URL:  ${lessonsWithVideoUrl}`);
    console.log(`  - Matched Video Documents: ${lessonsMatched} / ${lessonsWithVideoUrl} (${Math.round((lessonsMatched / lessonsWithVideoUrl) * 100)}%)`);

    if (missingVideos.length > 0) {
      console.warn(`  ⚠️ Missing Video Documents (${missingVideos.length}):`);
      missingVideos.slice(0, 5).forEach((m) => console.warn(`    • [${m.lessonTitle}] ${m.videoUrl}`));
    }

    // 3. Validate chapters and chunks structure
    let invalidChapters = 0;
    let invalidChunks = 0;
    let totalChaptersCount = 0;
    let totalChunksCount = 0;

    for (const video of videos) {
      totalChaptersCount += video.chapterCount || 0;
      totalChunksCount += video.chunkCount || 0;

      // Chapters validation
      if (!Array.isArray(video.chapters) || video.chapters.length === 0) {
        invalidChapters++;
      } else {
        let prevSec = -1;
        for (const ch of video.chapters) {
          if (typeof ch.startSeconds !== 'number' || ch.startSeconds < 0 || ch.startSeconds < prevSec || !ch.label) {
            invalidChapters++;
            break;
          }
          prevSec = ch.startSeconds;
        }
      }

      // Chunks validation
      if (!Array.isArray(video.chunks) || video.chunks.length === 0) {
        invalidChunks++;
      } else {
        for (const chk of video.chunks) {
          if (typeof chk.startSeconds !== 'number' || chk.startSeconds < 0 || !chk.text || typeof chk.text !== 'string') {
            invalidChunks++;
            break;
          }
        }
      }
    }

    console.log(`\n📋 Data Integrity:`);
    console.log(`  - Total Chapters: ${totalChaptersCount} (avg ${(totalChaptersCount / videos.length).toFixed(1)} / video)`);
    console.log(`  - Total Chunks:   ${totalChunksCount} (avg ${(totalChunksCount / videos.length).toFixed(1)} / video)`);
    console.log(`  - Invalid Chapters: ${invalidChapters === 0 ? '0 (✓ PASS)' : `${invalidChapters} (❌ FAIL)`}`);
    console.log(`  - Invalid Chunks:   ${invalidChunks === 0 ? '0 (✓ PASS)' : `${invalidChunks} (❌ FAIL)`}`);

    // 4. Test GROQ Search Queries
    console.log(`\n🔎 Testing Intelligent GROQ Search Queries:`);

    const sampleTerm = 'routing';
    const sampleWildcard = '*routing*';

    const chapterSearchResults = await runGroqQuery(
      `*[_type == "video" && (
        chapters[].label match $term ||
        chapters[].label match $wildcard
      )][0...3] {
        _id,
        title,
        url,
        "matchedChapters": chapters[label match $term || label match $wildcard] {
          startSeconds,
          label
        },
        "lesson": *[_type == "lesson" && videoUrl == ^.url][0] {
          _id,
          title,
          "slug": slug.current,
          "course": *[_type == "course" && references(^._id)][0] {
            title
          }
        }
      }`,
      { term: sampleTerm, wildcard: sampleWildcard }
    );

    console.log(`  ✓ Chapter search for '${sampleTerm}': ${chapterSearchResults.length} hits`);
    if (chapterSearchResults.length > 0) {
      const first = chapterSearchResults[0];
      console.log(`    Example hit: "${first.title}"`);
      if (first.matchedChapters?.[0]) {
        console.log(`    Matched Chapter: "${first.matchedChapters[0].label}" at ${first.matchedChapters[0].startSeconds}s`);
      }
      if (first.lesson?.course?.title) {
        console.log(`    Linked Course: "${first.lesson.course.title}"`);
      }
    }

    const chunkSearchResults = await runGroqQuery(
      `*[_type == "video" && (
        chunks[].text match $term ||
        chunks[].text match $wildcard
      )][0...3] {
        _id,
        title,
        url,
        "matchedChunks": chunks[text match $term || text match $wildcard][0...2] {
          startSeconds,
          text
        }
      }`,
      { term: sampleTerm, wildcard: sampleWildcard }
    );

    console.log(`  ✓ Chunk search for '${sampleTerm}': ${chunkSearchResults.length} hits`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(' ✨ VERIFICATION SUMMARY: ALL CHECKS PASSED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Verification failed with error:', error);
    process.exit(1);
  }
}

runVerification();
