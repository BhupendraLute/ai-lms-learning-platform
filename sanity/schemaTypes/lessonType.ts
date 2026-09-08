import { defineArrayMember, defineField, defineType } from 'sanity'
import { Video } from 'lucide-react'

export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: Video,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().error('Lesson title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Lesson slug is required'),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video Embed URL',
      type: 'url',
      description: 'Embed URL for YouTube, Vimeo, or Bunny video player',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('A valid video URL is required'),
    }),
    defineField({
      name: 'poster',
      title: 'Poster / Thumbnail Image',
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
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Formatted duration string (e.g. "12:30", "18m", or "1h 15m")',
      placeholder: '12:30',
    }),
    defineField({
      name: 'isFreePreview',
      title: 'Free Preview',
      type: 'boolean',
      description: 'Whether this lesson can be previewed for free',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count (Display)',
      type: 'number',
      description: 'Number of students who have completed or viewed this lesson',
      initialValue: 0,
      validation: (rule) => rule.integer().min(0).error('Student count must be a non-negative integer'),
    }),
    defineField({
      name: 'keyPoints',
      title: 'In This Lesson You Will (Key Points)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bullet points outlining key takeaways for this lesson',
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      rows: 3,
      description: 'Optional pro tip or insider advice for learners',
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes (Portable Text)',
      type: 'blockContent',
      description: 'Rich text notes, guides, and code snippets for this lesson',
    }),
    defineField({
      name: 'resources',
      title: 'Lesson Resources',
      type: 'array',
      of: [defineArrayMember({ type: 'resource' })],
      description: 'Links to source code repositories, documentation, and tools',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      isFreePreview: 'isFreePreview',
      media: 'poster',
    },
    prepare({ title, duration, isFreePreview, media }) {
      const previewBadge = isFreePreview ? ' [Free Preview]' : ''
      return {
        title: title || 'Untitled Lesson',
        subtitle: `${duration || 'No duration'}${previewBadge}`,
        media,
      }
    },
  },
})
