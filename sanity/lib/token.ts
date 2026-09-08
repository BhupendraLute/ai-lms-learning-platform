import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN

if (!token && process.env.NODE_ENV === 'production') {
  // In production, warn if read token is missing for private dataset access
  console.warn(
    'Warning: Missing SANITY_API_READ_TOKEN environment variable. Private dataset content fetching may fail.'
  )
}
