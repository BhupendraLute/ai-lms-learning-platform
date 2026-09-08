import { defineArrayMember, defineField, defineType } from 'sanity'
import { Layers } from 'lucide-react'

export const moduleType = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  icon: Layers,
  fields: [
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: (rule) => rule.required().error('Module title is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Module Summary',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      description: 'Ordered list of lessons belonging to this module',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      summary: 'summary',
      lessons: 'lessons',
    },
    prepare({ title, summary, lessons }) {
      const lessonCount = Array.isArray(lessons) ? lessons.length : 0
      return {
        title: title || 'Untitled Module',
        subtitle: `${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}${summary ? ` • ${summary}` : ''}`,
      }
    },
  },
})
