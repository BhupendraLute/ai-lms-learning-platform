import { defineQuery } from 'next-sanity'

// ==========================================
// Course Queries
// ==========================================

export const ALL_COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    instructor->{
      _id,
      name,
      slug,
      photo,
      expertise
    },
    category->{
      _id,
      title,
      slug
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

export const POPULAR_COURSES_QUERY = defineQuery(`
  *[_type == "course" && popular == true && defined(slug.current)] | order(title asc) [0...6] {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    instructor->{
      _id,
      name,
      slug,
      photo,
      expertise
    },
    category->{
      _id,
      title,
      slug
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    level,
    price,
    popular,
    studentCount,
    instructor->{
      _id,
      name,
      slug,
      photo,
      expertise,
      bio
    },
    category->{
      _id,
      title,
      slug,
      description
    },
    learningOutcomes[]{
      _key,
      icon,
      title,
      description
    },
    modules[]{
      _key,
      title,
      summary,
      lessons[]->{
        _id,
        _type,
        title,
        slug,
        duration,
        isFreePreview
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)][].slug.current
`)

// ==========================================
// Lesson Queries
// ==========================================

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    videoUrl,
    "poster": coalesce(poster, thumbnail),
    duration,
    "isFreePreview": coalesce(isFreePreview, freePreview, false),
    studentCount,
    keyPoints,
    proTip,
    notes,
    resources[]{
      _key,
      type,
      title,
      description,
      url
    },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      slug,
      coverImage,
      level,
      studentCount,
      instructor->{
        _id,
        name,
        slug,
        photo
      },
      modules[]{
        _key,
        title,
        summary,
        lessons[]->{
          _id,
          title,
          slug,
          duration,
          "isFreePreview": coalesce(isFreePreview, freePreview, false)
        }
      }
    }
  }
`)

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)][].slug.current
`)

// ==========================================
// Category Queries
// ==========================================

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    description,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    description,
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      slug,
      summary,
      coverImage,
      level,
      price,
      popular,
      studentCount,
      instructor->{
        _id,
        name,
        slug,
        photo
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[])
    }
  }
`)

// ==========================================
// Instructor Queries
// ==========================================

export const ALL_INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)] | order(name asc) {
    _id,
    _type,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      slug,
      summary,
      coverImage,
      level,
      price,
      popular,
      studentCount,
      category->{
        _id,
        title,
        slug
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[])
    }
  }
`)

// ==========================================
// Intelligent Search Queries
// ==========================================

export const SEARCH_LESSONS_QUERY = defineQuery(`
  *[_type == "lesson" && (
    title match $term ||
    title match $wildcard ||
    keyPoints[] match $term ||
    keyPoints[] match $wildcard ||
    pt::text(notes) match $term ||
    pt::text(notes) match $wildcard ||
    proTip match $term
  )] {
    _id,
    _type,
    title,
    slug,
    videoUrl,
    "poster": coalesce(poster, thumbnail),
    duration,
    isFreePreview,
    keyPoints,
    proTip,
    "notesText": pt::text(notes),
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      slug,
      coverImage,
      category->{ _id, title, slug },
      modules[]{
        _key,
        title,
        summary,
        lessons[]->{
          _id,
          slug
        }
      }
    }
  }
`)

export const SEARCH_VIDEO_CHAPTERS_QUERY = defineQuery(`
  *[_type == "video" && (
    chapters[].label match $term ||
    chapters[].label match $wildcard
  )] {
    _id,
    _type,
    id,
    url,
    title,
    duration,
    "allChapters": chapters[] {
      _key,
      startSeconds,
      label
    },
    "matchedChapters": chapters[label match $term || label match $wildcard] {
      _key,
      startSeconds,
      label
    },
    "lesson": *[_type == "lesson" && videoUrl == ^.url][0] {
      _id,
      title,
      slug,
      "poster": coalesce(poster, thumbnail),
      duration,
      isFreePreview,
      keyPoints,
      "course": *[_type == "course" && references(^._id)][0] {
        _id,
        title,
        slug,
        coverImage,
        category->{ _id, title, slug },
        modules[]{
          _key,
          title,
          summary,
          lessons[]->{
            _id,
            slug
          }
        }
      }
    }
  }
`)

export const SEARCH_VIDEO_CHUNKS_QUERY = defineQuery(`
  *[_type == "video" && (
    chunks[].text match $term ||
    chunks[].text match $wildcard
  )] {
    _id,
    _type,
    id,
    url,
    title,
    duration,
    "matchedChunks": chunks[text match $term || text match $wildcard][0...3] {
      _key,
      startSeconds,
      text
    },
    "lesson": *[_type == "lesson" && videoUrl == ^.url][0] {
      _id,
      title,
      slug,
      "poster": coalesce(poster, thumbnail),
      duration,
      isFreePreview,
      keyPoints,
      "course": *[_type == "course" && references(^._id)][0] {
        _id,
        title,
        slug,
        coverImage,
        category->{ _id, title, slug },
        modules[]{
          _key,
          title,
          summary,
          lessons[]->{
            _id,
            slug
          }
        }
      }
    }
  }
`)

export const SEARCH_ALL_COURSES_TREE_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] {
    _id,
    title,
    slug,
    summary,
    coverImage,
    category->{ _id, title, slug },
    modules[]{
      _key,
      title,
      summary,
      lessons[]->{
        _id,
        title,
        slug,
        videoUrl,
        "poster": coalesce(poster, thumbnail),
        duration,
        isFreePreview,
        keyPoints,
        "notesText": pt::text(notes),
        proTip
      }
    }
  }
`)

