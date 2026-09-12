/**
 * Duration parsing and formatting utilities
 */

// Helper to convert "MM:SS", "HH:MM:SS", or "Xm", "Xh Ym" into seconds
export function parseDurationToSeconds(dur?: string): number {
  if (!dur) return 0;
  const str = dur.trim();

  // Pattern "MM:SS" or "HH:MM:SS"
  if (str.includes(":")) {
    const parts = str.split(":").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  // Pattern "1h 24m" or "45m"
  let totalSecs = 0;
  const hoursMatch = str.match(/(\d+)\s*h/i);
  const minsMatch = str.match(/(\d+)\s*m/i);
  const secsMatch = str.match(/(\d+)\s*s/i);

  if (hoursMatch) totalSecs += parseInt(hoursMatch[1], 10) * 3600;
  if (minsMatch) totalSecs += parseInt(minsMatch[1], 10) * 60;
  if (secsMatch) totalSecs += parseInt(secsMatch[1], 10);

  return totalSecs > 0 ? totalSecs : 0;
}

// Format seconds into human readable string like "45m" or "1h 12m"
export function formatSecondsToHuman(seconds: number): string {
  if (seconds <= 0) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${Math.max(1, minutes)}m`;
}

// Calculate total duration for a list of lessons
export function getLessonsDuration(lessons?: Array<{ duration?: string }>): string {
  if (!lessons || lessons.length === 0) return "0m";
  const totalSecs = lessons.reduce((acc, l) => acc + parseDurationToSeconds(l.duration), 0);
  return formatSecondsToHuman(totalSecs);
}

// Calculate total duration for an entire course
export function calculateCourseDuration(course: {
  modules?: Array<{ lessons?: Array<{ duration?: string }> }>;
  duration?: string;
}): string {
  if (course.duration) return course.duration;
  if (!course.modules || course.modules.length === 0) return "18h 24m";

  let totalSeconds = 0;
  for (const mod of course.modules) {
    if (mod.lessons) {
      for (const lesson of mod.lessons) {
        if (lesson.duration) {
          totalSeconds += parseDurationToSeconds(lesson.duration);
        }
      }
    }
  }

  return totalSeconds > 0 ? formatSecondsToHuman(totalSeconds) : "18h 24m";
}
