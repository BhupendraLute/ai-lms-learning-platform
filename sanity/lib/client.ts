import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  stega: {
    studioUrl,
  },
})

/**
 * Server-only Sanity client configured with private read token and CDN disabled for fresh server data
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl,
  },
})
