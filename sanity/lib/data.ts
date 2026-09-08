import { sanityFetch } from './live'
import {
  ALL_CATEGORIES_QUERY,
  ALL_COURSES_QUERY,
  ALL_INSTRUCTORS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  COURSE_BY_SLUG_QUERY,
  COURSE_SLUGS_QUERY,
  INSTRUCTOR_BY_SLUG_QUERY,
  LESSON_BY_SLUG_QUERY,
  LESSON_SLUGS_QUERY,
  POPULAR_COURSES_QUERY,
} from './queries'
import type {
  Category,
  Course,
  CourseSummary,
  Instructor,
  LessonDetailWithContext,
} from '../types'

/**
 * Fetch all available courses with instructor and category summaries
 */
export async function getAllCourses(): Promise<CourseSummary[]> {
  try {
    const { data } = await sanityFetch({
      query: ALL_COURSES_QUERY,
    })
    return (data as unknown as CourseSummary[]) || []
  } catch (error) {
    console.error('Error fetching all courses from Sanity:', error)
    return []
  }
}

/**
 * Fetch popular courses for home page / highlights
 */
export async function getPopularCourses(): Promise<CourseSummary[]> {
  try {
    const { data } = await sanityFetch({
      query: POPULAR_COURSES_QUERY,
    })
    return (data as unknown as CourseSummary[]) || []
  } catch (error) {
    console.error('Error fetching popular courses from Sanity:', error)
    return []
  }
}

/**
 * Fetch full course details by slug, resolving modules and nested lesson documents
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const { data } = await sanityFetch({
      query: COURSE_BY_SLUG_QUERY,
      params: { slug },
    })
    return (data as unknown as Course) || null
  } catch (error) {
    console.error(`Error fetching course "${slug}" from Sanity:`, error)
    return null
  }
}

/**
 * Fetch list of all course slugs for static generation
 */
export async function getCourseSlugs(): Promise<string[]> {
  try {
    const { data } = await sanityFetch({
      query: COURSE_SLUGS_QUERY,
    })
    return (data as unknown as string[]) || []
  } catch (error) {
    console.error('Error fetching course slugs from Sanity:', error)
    return []
  }
}

/**
 * Fetch lesson by slug and resolve reverse reference to parent course context
 */
export async function getLessonBySlug(
  slug: string
): Promise<LessonDetailWithContext | null> {
  try {
    const { data } = await sanityFetch({
      query: LESSON_BY_SLUG_QUERY,
      params: { slug },
    })

    if (!data) return null

    const lessonData = data as unknown as LessonDetailWithContext

    // Calculate module index, lesson index, previous lesson, and next lesson
    if (lessonData.course?.modules) {
      const modules = lessonData.course.modules
      const flatLessons: {
        title: string
        slug: { current: string }
        moduleTitle: string
        moduleIdx: number
        lessonIdx: number
      }[] = []

      modules.forEach((mod, modIdx) => {
        if (Array.isArray(mod.lessons)) {
          mod.lessons.forEach((les, lesIdx) => {
            flatLessons.push({
              title: les.title,
              slug: les.slug,
              moduleTitle: mod.title,
              moduleIdx: modIdx + 1,
              lessonIdx: lesIdx + 1,
            })
          })
        }
      })

      const currentIndex = flatLessons.findIndex(
        (l) => l.slug?.current === lessonData.slug?.current
      )

      if (currentIndex !== -1) {
        const currentMeta = flatLessons[currentIndex]
        lessonData.moduleTitle = currentMeta.moduleTitle
        lessonData.moduleIndex = currentMeta.moduleIdx
        lessonData.lessonIndex = currentMeta.lessonIdx

        if (currentIndex > 0) {
          lessonData.prevLesson = {
            title: flatLessons[currentIndex - 1].title,
            slug: flatLessons[currentIndex - 1].slug,
          }
        }

        if (currentIndex < flatLessons.length - 1) {
          lessonData.nextLesson = {
            title: flatLessons[currentIndex + 1].title,
            slug: flatLessons[currentIndex + 1].slug,
          }
        }
      }
    }

    return lessonData
  } catch (error) {
    console.error(`Error fetching lesson "${slug}" from Sanity:`, error)
    return null
  }
}

/**
 * Fetch list of all lesson slugs for static generation
 */
export async function getLessonSlugs(): Promise<string[]> {
  try {
    const { data } = await sanityFetch({
      query: LESSON_SLUGS_QUERY,
    })
    return (data as unknown as string[]) || []
  } catch (error) {
    console.error('Error fetching lesson slugs from Sanity:', error)
    return []
  }
}

/**
 * Fetch all categories with course count
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data } = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    })
    return (data as unknown as Category[]) || []
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error)
    return []
  }
}

/**
 * Fetch category details by slug including associated courses
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data } = await sanityFetch({
      query: CATEGORY_BY_SLUG_QUERY,
      params: { slug },
    })
    return (data as unknown as Category) || null
  } catch (error) {
    console.error(`Error fetching category "${slug}" from Sanity:`, error)
    return null
  }
}

/**
 * Fetch all instructors with course count
 */
export async function getAllInstructors(): Promise<Instructor[]> {
  try {
    const { data } = await sanityFetch({
      query: ALL_INSTRUCTORS_QUERY,
    })
    return (data as unknown as Instructor[]) || []
  } catch (error) {
    console.error('Error fetching instructors from Sanity:', error)
    return []
  }
}

/**
 * Fetch instructor details by slug including courses taught
 */
export async function getInstructorBySlug(slug: string): Promise<Instructor | null> {
  try {
    const { data } = await sanityFetch({
      query: INSTRUCTOR_BY_SLUG_QUERY,
      params: { slug },
    })
    return (data as unknown as Instructor) || null
  } catch (error) {
    console.error(`Error fetching instructor "${slug}" from Sanity:`, error)
    return null
  }
}
