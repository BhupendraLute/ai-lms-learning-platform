import type { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  _type?: 'image'
  asset?: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: { current: string }
  description?: string
  courseCount?: number
}

export interface Instructor {
  _id: string
  _type: 'instructor'
  name: string
  slug: { current: string }
  photo?: SanityImage
  expertise?: string
  bio?: string
  courseCount?: number
  courses?: CourseSummary[]
}

export interface LearningOutcome {
  _key?: string
  icon?: string
  title: string
  description?: string
}

export interface Resource {
  _key?: string
  type: 'github' | 'docs' | 'article' | 'tool' | 'download' | 'link' | string
  title: string
  description?: string
  url: string
}

export interface LessonSummary {
  _id: string
  _type: 'lesson'
  title: string
  slug: { current: string }
  duration?: string
  isFreePreview?: boolean
}

export interface Lesson extends LessonSummary {
  videoUrl?: string
  poster?: SanityImage
  studentCount?: number
  keyPoints?: string[]
  proTip?: string
  notes?: PortableTextBlock[]
  resources?: Resource[]
}

export interface Module {
  _key?: string
  title: string
  summary?: string
  lessons?: LessonSummary[]
}

export interface CourseSummary {
  _id: string
  _type: 'course'
  title: string
  slug: { current: string }
  summary: string
  coverImage?: SanityImage
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price?: number
  popular?: boolean
  studentCount?: number
  instructor?: Pick<Instructor, '_id' | 'name' | 'slug' | 'photo' | 'expertise'>
  category?: Pick<Category, '_id' | 'title' | 'slug'>
  moduleCount?: number
  lessonCount?: number
  duration?: string
}

export interface Course extends CourseSummary {
  learningOutcomes?: LearningOutcome[]
  modules?: Module[]
}

export interface LessonDetailWithContext extends Lesson {
  course?: {
    _id: string
    title: string
    slug: { current: string }
    instructor?: Pick<Instructor, '_id' | 'name' | 'slug' | 'photo'>
    modules?: {
      title: string
      lessons: LessonSummary[]
    }[]
  }
  moduleTitle?: string
  moduleIndex?: number
  lessonIndex?: number
  prevLesson?: {
    title: string
    slug: { current: string }
  }
  nextLesson?: {
    title: string
    slug: { current: string }
  }
}
