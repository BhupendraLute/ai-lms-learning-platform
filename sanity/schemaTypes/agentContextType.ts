import { defineField, defineType } from 'sanity'
import { Bot } from 'lucide-react'

export const agentContextType = defineType({
  name: 'sanity.agentContext',
  title: 'Agent Context',
  type: 'document',
  icon: Bot,
  fields: [
    defineField({
      name: 'title',
      title: 'Context Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the MCP URL: /context/mcp/:projectId/:dataset/:slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groqFilter',
      title: 'Content Scope Filter (GROQ Expression)',
      type: 'string',
      description: 'A GROQ filter expression scoping the documents the agent can query',
      initialValue: '!(_id in path("drafts.**")) && _type in ["course", "lesson", "video", "instructor", "category"]',
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions / Guidance',
      type: 'text',
      rows: 15,
      description: 'Pure deltas: schema relationships, query tips, and two-stage timestamp search rules',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
