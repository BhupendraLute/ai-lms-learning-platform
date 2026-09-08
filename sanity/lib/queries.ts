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
    poster,
    duration,
    isFreePreview,
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
      instructor->{
        _id,
        name,
        slug,
        photo
      },
      modules[]{
        title,
        lessons[]->{
          _id,
          title,
          slug,
          duration,
          isFreePreview
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
