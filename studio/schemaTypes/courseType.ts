import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookOpen } from 'lucide-react'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookOpen,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().error('Course title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Course slug is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Summary / Description',
      type: 'text',
      rows: 3,
      description: 'A compelling overview of the course content and learning journey',
      validation: (rule) => rule.required().error('Course summary is required'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'level',
      title: 'Skill Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
      },
      initialValue: 'Intermediate',
      validation: (rule) => rule.required().error('Skill level is required'),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      description: 'Course price in USD (leave 0 for free courses)',
      initialValue: 0,
      validation: (rule) => rule.min(0).error('Course price must be 0 or greater'),
    }),
    defineField({
      name: 'popular',
      title: 'Popular Flag',
      type: 'boolean',
      description: 'Highlight this course with a popular badge in catalog & home displays',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count (Display)',
      type: 'number',
      description: 'Display count of enrolled or active students',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0).error('Student count must be a non-negative integer'),
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required().error('Course must have an assigned instructor'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required().error('Course must belong to a category'),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What You'll Learn (Outcomes)",
      type: 'array',
      of: [defineArrayMember({ type: 'learningOutcome' })],
      description: 'Key skills and architectural patterns learners will acquire',
    }),
    defineField({
      name: 'modules',
      title: 'Course Modules',
      type: 'array',
      of: [defineArrayMember({ type: 'module' })],
      description: 'Ordered list of course modules containing lesson references',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      instructorName: 'instructor.name',
      level: 'level',
      media: 'coverImage',
    },
    prepare({ title, instructorName, level, media }) {
      return {
        title: title || 'Untitled Course',
        subtitle: `${level || 'All Levels'}${instructorName ? ` • ${instructorName}` : ''}`,
        media,
      }
    },
  },
})
