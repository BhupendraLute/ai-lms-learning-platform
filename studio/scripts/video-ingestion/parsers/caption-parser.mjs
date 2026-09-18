/**
 * Caption & Transcript Parser
 * Supports WebVTT (.vtt) and SubRip (.srt) caption formats.
 * Normalizes timecodes to seconds and groups short cues into coherent 15–45s semantic chunks.
 */

/**
 * Converts a timecode string (HH:MM:SS.mmm, MM:SS.mmm, HH:MM:SS,mmm) into seconds (number).
 */
export function timecodeToSeconds(timecode) {
  if (!timecode || typeof timecode !== 'string') return 0;
  const clean = timecode.trim().replace(',', '.');
  const parts = clean.split(':');

  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return Math.round((hours * 3600 + minutes * 60 + seconds) * 100) / 100;
  } else if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return Math.round((minutes * 60 + seconds) * 100) / 100;
  }
  return parseFloat(clean) || 0;
}

/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function secondsToTimecode(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Strips HTML, VTT tags, voice markers (<v Speaker>), and extra whitespace.
 */
export function cleanSubtitleText(text) {
  if (!text) return '';
  return text
    .replace(/<v[^>]*>/g, '') // remove voice tags
    .replace(/<\/v>/g, '')
    .replace(/<[^>]+>/g, '') // remove HTML/VTT tags like <b>, <i>, <c.color>
    .replace(/\{[^\}]+\}/g, '') // remove SSA/ASS override tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\r\n|\r/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses WebVTT content into an array of raw cues: { startSeconds, endSeconds, text }
 */
export function parseWebVTT(vttContent) {
  if (!vttContent) return [];
  const lines = vttContent.replace(/\r\n|\r/g, '\n').split('\n');
  const cues = [];

  let inCue = false;
  let currentStart = 0;
  let currentEnd = 0;
  let currentTextLines = [];

  // Match: 00:00:00.000 --> 00:00:05.000 or 00:00.000 --> 00:05.000
  const timeRegex = /((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{1,3})?)\s*-->\s*((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{1,3})?)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inCue && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: currentStart,
            endSeconds: currentEnd,
            text,
          });
        }
        inCue = false;
        currentTextLines = [];
      }
      continue;
    }

    if (line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE')) {
      continue;
    }

    const match = line.match(timeRegex);
    if (match) {
      // If previous cue didn't terminate with empty line
      if (inCue && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: currentStart,
            endSeconds: currentEnd,
            text,
          });
        }
        currentTextLines = [];
      }

      currentStart = timecodeToSeconds(match[1]);
      currentEnd = timecodeToSeconds(match[2]);
      inCue = true;
      continue;
    }

    if (inCue) {
      currentTextLines.push(line);
    }
  }

  if (inCue && currentTextLines.length > 0) {
    const text = cleanSubtitleText(currentTextLines.join(' '));
    if (text) {
      cues.push({
        startSeconds: currentStart,
        endSeconds: currentEnd,
        text,
      });
    }
  }

  return cues;
}

/**
 * Parses SubRip (.srt) content into raw cues: { startSeconds, endSeconds, text }
 */
export function parseSRT(srtContent) {
  if (!srtContent) return [];
  const lines = srtContent.replace(/\r\n|\r/g, '\n').split('\n');
  const cues = [];

  let inCue = false;
  let currentStart = 0;
  let currentEnd = 0;
  let currentTextLines = [];

  // Match: 00:00:20,000 --> 00:00:24,400
  const timeRegex = /(\d{2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{1,3})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inCue && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: currentStart,
            endSeconds: currentEnd,
            text,
          });
        }
        inCue = false;
        currentTextLines = [];
      }
      continue;
    }

    const match = line.match(timeRegex);
    if (match) {
      if (inCue && currentTextLines.length > 0) {
        const text = cleanSubtitleText(currentTextLines.join(' '));
        if (text) {
          cues.push({
            startSeconds: currentStart,
            endSeconds: currentEnd,
            text,
          });
        }
        currentTextLines = [];
      }

      currentStart = timecodeToSeconds(match[1]);
      currentEnd = timecodeToSeconds(match[2]);
      inCue = true;
      continue;
    }

    // Skip numeric sequence identifiers
    if (/^\d+$/.test(line) && !inCue) {
      continue;
    }

    if (inCue) {
      currentTextLines.push(line);
    }
  }

  if (inCue && currentTextLines.length > 0) {
    const text = cleanSubtitleText(currentTextLines.join(' '));
    if (text) {
      cues.push({
        startSeconds: currentStart,
        endSeconds: currentEnd,
        text,
      });
    }
  }

  return cues;
}

/**
 * Aggregates fine-grained caption cues into 15–45 second semantic transcript chunks.
 * Ensures chunks have readable sentence boundaries and accurate startSeconds.
 *
 * @param {Array<{startSeconds: number, endSeconds: number, text: string}>} cues
 * @param {object} options
 * @param {number} options.minDuration - Minimum duration of chunk in seconds (default: 20)
 * @param {number} options.maxDuration - Maximum duration of chunk in seconds (default: 45)
 * @param {number} options.maxChars - Target maximum characters per chunk (default: 350)
 * @returns {Array<{_key: string, startSeconds: number, text: string}>}
 */
export function chunkCues(cues, options = {}) {
  const {
    minDuration = 20,
    maxDuration = 45,
    maxChars = 350,
  } = options;

  if (!Array.isArray(cues) || cues.length === 0) return [];

  const chunks = [];
  let currentChunk = {
    _key: 'chunk-0',
    startSeconds: cues[0].startSeconds,
    endSeconds: cues[0].endSeconds,
    texts: [cues[0].text],
  };

  for (let i = 1; i < cues.length; i++) {
    const cue = cues[i];
    const durationSoFar = cue.endSeconds - currentChunk.startSeconds;
    const currentLength = currentChunk.texts.join(' ').length;
    const lastText = currentChunk.texts[currentChunk.texts.length - 1] || '';
    const endsWithSentence = /[.!?]$/.test(lastText.trim());

    // Chunk split conditions:
    // 1. Exceeds maxDuration or maxChars
    // 2. Or exceeds minDuration and ends with a sentence boundary
    // 3. Or large gap between cues (> 5 seconds)
    const timeGap = cue.startSeconds - currentChunk.endSeconds;
    const shouldSplit =
      durationSoFar >= maxDuration ||
      currentLength >= maxChars ||
      (durationSoFar >= minDuration && endsWithSentence) ||
      timeGap > 5;

    if (shouldSplit) {
      const combinedText = currentChunk.texts.join(' ').trim();
      if (combinedText) {
        chunks.push({
          _key: `chunk-${chunks.length}`,
          startSeconds: Math.floor(currentChunk.startSeconds),
          text: combinedText,
        });
      }

      currentChunk = {
        _key: `chunk-${chunks.length + 1}`,
        startSeconds: cue.startSeconds,
        endSeconds: cue.endSeconds,
        texts: [cue.text],
      };
    } else {
      currentChunk.texts.push(cue.text);
      currentChunk.endSeconds = Math.max(currentChunk.endSeconds, cue.endSeconds);
    }
  }

  // Push final chunk
  const finalCombinedText = currentChunk.texts.join(' ').trim();
  if (finalCombinedText) {
    chunks.push({
      _key: `chunk-${chunks.length}`,
      startSeconds: Math.floor(currentChunk.startSeconds),
      text: finalCombinedText,
    });
  }

  return chunks;
}
