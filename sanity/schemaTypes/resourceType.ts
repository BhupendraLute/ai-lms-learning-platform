import { defineField, defineType } from 'sanity'
import { Link2 } from 'lucide-react'

export const resourceType = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'object',
  icon: Link2,
  fields: [
    defineField({
      name: 'type',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'GitHub Repository', value: 'github' },
          { title: 'Documentation', value: 'docs' },
          { title: 'Article', value: 'article' },
          { title: 'Tool / Utility', value: 'tool' },
          { title: 'Downloadable Asset', value: 'download' },
          { title: 'External Link', value: 'link' },
        ],
      },
      initialValue: 'link',
      validation: (rule) => rule.required().error('Resource type is required'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().error('Resource title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }).error('A valid URL is required'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
    },
  },
})
