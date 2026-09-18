import { NextRequest, NextResponse } from 'next/server'
import { searchLearningPlatform, SearchOptions } from '@/sanity/lib/search'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || searchParams.get('query') || ''
    const sort = (searchParams.get('sort') || 'relevance') as SearchOptions['sort']
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    // Sanitize input
    const cleanQuery = q.trim().slice(0, 200)

    if (!cleanQuery) {
      return NextResponse.json(
        {
          query: '',
          stats: {
            totalResults: 0,
            coursesCount: 0,
            videoResultsCount: 0,
            lessonResultsCount: 0,
          },
          videoResults: [],
          lessonResults: [],
        },
        { status: 200 }
      )
    }

    const results = await searchLearningPlatform(cleanQuery, {
      sort,
      limit,
    })

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    })
  } catch (error: unknown) {
    console.error('❌ Search API error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during search.'
    return NextResponse.json(
      {
        error: 'Search failed',
        message,
      },
      { status: 500 }
    )
  }
}
