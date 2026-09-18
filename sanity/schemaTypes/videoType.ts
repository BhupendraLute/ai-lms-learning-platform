import { defineArrayMember, defineField, defineType } from 'sanity'
import { Clapperboard } from 'lucide-react'

export const videoType = defineType({
  name: 'video',
  title: 'Video Intelligence',
  type: 'document',
  icon: Clapperboard,
  fields: [
    defineField({
      name: 'id',
      title: 'Video ID',
      type: 'string',
      description: 'Unique identifier derived from video provider or URL (e.g. YouTube ID)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'Canonical video URL',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (Seconds)',
      type: 'number',
    }),
    defineField({
      name: 'chapters',
      title: 'Table of Contents (Chapters)',
      type: 'array',
      description: 'Timestamped chapter markers for two-stage search resolution',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (Seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Chapter Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              startSeconds: 'startSeconds',
            },
            prepare({ title, startSeconds }) {
              const mins = Math.floor((startSeconds || 0) / 60)
              const secs = (startSeconds || 0) % 60
              return {
                title,
                subtitle: `${mins}:${secs.toString().padStart(2, '0')}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      type: 'array',
      description: 'Short timestamped transcript chunks for search fallback',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chunk',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (Seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'text',
              title: 'Transcript Text',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'text',
              startSeconds: 'startSeconds',
            },
            prepare({ title, startSeconds }) {
              const mins = Math.floor((startSeconds || 0) / 60)
              const secs = (startSeconds || 0) % 60
              return {
                title,
                subtitle: `${mins}:${secs.toString().padStart(2, '0')}`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({ title, url }) {
      return {
        title: title || 'Video Document',
        subtitle: url,
      }
    },
  },
})
