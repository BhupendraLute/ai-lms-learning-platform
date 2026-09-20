import posthog from "posthog-js";

/**
 * Checks whether PostHog is initialized and configured in client environment.
 */
function isPostHogReady(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
  );
}

/**
 * Safely captures a PostHog event in browser context with error boundary.
 */
function safeCapture(eventName: string, properties: Record<string, unknown> = {}) {
  try {
    if (isPostHogReady()) {
      posthog.capture(eventName, properties);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PostHog Analytics] Failed to capture event "${eventName}":`, error);
    }
  }
}

// ---------------------------------------------------------------------------
// Typed Event Parameter Schemas
// ---------------------------------------------------------------------------

export interface TrackSearchPerformedParams {
  query: string;
  totalResults?: number;
  coursesCount?: number;
  videoResultsCount?: number;
  lessonResultsCount?: number;
  sort?: string;
  hasResults?: boolean;
  source?: "search_page" | "hero_search" | "api" | "topic_chip";
}

export interface TrackSearchResultOpenedParams {
  query?: string;
  resultType: "video" | "lesson";
  matchType?: "chapter" | "transcript" | "topic" | "title";
  courseSlug?: string;
  courseTitle?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  startSeconds?: number;
  formattedTimestamp?: string;
  destinationUrl?: string;
  position?: number;
}

export interface TrackVideoPlayedParams {
  courseSlug?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  videoUrl?: string;
  startSeconds?: number;
  isAutoplay?: boolean;
  provider?: "youtube" | "vimeo" | "bunny" | "generic";
}

export interface TrackVideoWatchDepthParams {
  courseSlug?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  depthPercentage: 25 | 50 | 75 | 90 | 100;
  secondsWatched?: number;
  videoDurationSeconds?: number;
  provider?: string;
}

export interface TrackResumeUsedParams {
  courseSlug?: string;
  lessonSlug?: string;
  progressPercentage?: number;
  source: "course_bottom_bar" | "course_hero" | "my_learning" | "sidebar";
}

export interface TrackLessonCompletedParams {
  courseSlug?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  nextLessonSlug?: string;
  isCourseCompleted?: boolean;
  source?: "bottom_nav_next" | "bottom_nav_complete" | "milestone";
}

export interface TrackCatalogViewedParams {
  totalCourses?: number;
}

export interface TrackCourseViewedParams {
  courseSlug: string;
  courseTitle?: string;
  level?: string;
  moduleCount?: number;
  duration?: string;
  studentCount?: number;
}

export interface TrackLessonViewedParams {
  courseSlug?: string;
  lessonSlug: string;
  lessonTitle?: string;
  moduleIndex?: number;
  lessonIndex?: number;
  startSeconds?: number;
}

export interface TrackLessonResourceClickedParams {
  lessonSlug?: string;
  resourceTitle: string;
  resourceType: string;
  resourceUrl: string;
}

export interface TrackLessonTabSwitchedParams {
  lessonSlug?: string;
  tab: "content" | "notes";
}

export interface TrackLessonBookmarkToggledParams {
  lessonSlug?: string;
  lessonTitle?: string;
  bookmarked: boolean;
}

export interface TrackCourseModuleToggledParams {
  courseSlug?: string;
  moduleIndex: number;
  lessonCount?: number;
  expanded: boolean;
}

export interface TrackAuthStartedParams {
  event: "sign_in_started" | "sign_up_started";
  source: "desktop_navigation" | "mobile_navigation";
}

// ---------------------------------------------------------------------------
// Exported Analytics Tracking Helpers
// ---------------------------------------------------------------------------

export function trackSearchPerformed(params: TrackSearchPerformedParams) {
  const hasResults =
    params.hasResults !== undefined
      ? params.hasResults
      : params.totalResults !== undefined
      ? params.totalResults > 0
      : undefined;

  safeCapture("search_performed", {
    query: params.query,
    total_results: params.totalResults,
    courses_count: params.coursesCount,
    video_results_count: params.videoResultsCount,
    lesson_results_count: params.lessonResultsCount,
    sort: params.sort || "relevance",
    has_results: hasResults,
    source: params.source || "search_page",
  });
}

export function trackSearchResultOpened(params: TrackSearchResultOpenedParams) {
  safeCapture("search_result_opened", {
    query: params.query || "",
    result_type: params.resultType,
    match_type: params.matchType,
    course_slug: params.courseSlug,
    course_title: params.courseTitle,
    lesson_slug: params.lessonSlug,
    lesson_title: params.lessonTitle,
    start_seconds: params.startSeconds,
    formatted_timestamp: params.formattedTimestamp,
    destination_url: params.destinationUrl,
    position: params.position,
  });
}

export function trackVideoPlayed(params: TrackVideoPlayedParams) {
  safeCapture("video_played", {
    course_slug: params.courseSlug,
    lesson_slug: params.lessonSlug,
    lesson_title: params.lessonTitle,
    video_url: params.videoUrl,
    start_seconds: params.startSeconds || 0,
    is_autoplay: Boolean(params.isAutoplay),
    provider: params.provider || "generic",
  });
}

export function trackVideoWatchDepth(params: TrackVideoWatchDepthParams) {
  safeCapture("video_watch_depth", {
    course_slug: params.courseSlug,
    lesson_slug: params.lessonSlug,
    lesson_title: params.lessonTitle,
    depth_percentage: params.depthPercentage,
    seconds_watched: params.secondsWatched,
    video_duration_seconds: params.videoDurationSeconds,
    provider: params.provider,
  });
}

export function trackResumeUsed(params: TrackResumeUsedParams) {
  safeCapture("resume_used", {
    course_slug: params.courseSlug,
    lesson_slug: params.lessonSlug,
    progress_percentage: params.progressPercentage,
    source: params.source,
  });
}

export function trackLessonCompleted(params: TrackLessonCompletedParams) {
  safeCapture("lesson_completed", {
    course_slug: params.courseSlug,
    lesson_slug: params.lessonSlug,
    lesson_title: params.lessonTitle,
    next_lesson_slug: params.nextLessonSlug,
    is_course_completed: Boolean(params.isCourseCompleted),
    source: params.source || "bottom_nav_next",
  });
}

export function trackCatalogViewed(params: TrackCatalogViewedParams = {}) {
  safeCapture("catalog_viewed", {
    total_courses: params.totalCourses,
  });
}

export function trackCourseViewed(params: TrackCourseViewedParams) {
  safeCapture("course_viewed", {
    course_slug: params.courseSlug,
    course_title: params.courseTitle,
    level: params.level,
    module_count: params.moduleCount,
    duration: params.duration,
    student_count: params.studentCount,
  });
}

export function trackLessonViewed(params: TrackLessonViewedParams) {
  safeCapture("lesson_viewed", {
    course_slug: params.courseSlug,
    lesson_slug: params.lessonSlug,
    lesson_title: params.lessonTitle,
    module_index: params.moduleIndex,
    lesson_index: params.lessonIndex,
    start_seconds: params.startSeconds || 0,
  });
}

export function trackLessonResourceClicked(params: TrackLessonResourceClickedParams) {
  safeCapture("lesson_resource_clicked", {
    lesson_slug: params.lessonSlug,
    resource_title: params.resourceTitle,
    resource_type: params.resourceType,
    resource_url: params.resourceUrl,
  });
}

export function trackLessonTabSwitched(params: TrackLessonTabSwitchedParams) {
  safeCapture("lesson_tab_switched", {
    lesson_slug: params.lessonSlug,
    tab: params.tab,
  });
}

export function trackLessonBookmarkToggled(params: TrackLessonBookmarkToggledParams) {
  safeCapture("lesson_bookmark_toggled", {
    lesson_slug: params.lessonSlug,
    lesson_title: params.lessonTitle,
    bookmarked: params.bookmarked,
  });
}

export function trackCourseModuleToggled(params: TrackCourseModuleToggledParams) {
  safeCapture("course_module_toggled", {
    course_slug: params.courseSlug,
    module_index: params.moduleIndex,
    lesson_count: params.lessonCount,
    expanded: params.expanded,
  });
}

export function trackAuthStarted(params: TrackAuthStartedParams) {
  safeCapture(params.event, {
    source: params.source,
  });
}
