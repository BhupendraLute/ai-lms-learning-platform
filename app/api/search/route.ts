import { NextRequest, NextResponse, after } from 'next/server'
import { searchLearningPlatform, SearchOptions } from '@/sanity/lib/search'
import { captureServerEvent } from '@/lib/analytics-server'

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

    // Track server-side search event bound to request lifecycle
    after(async () => {
      try {
        await captureServerEvent({
          event: 'search_performed',
          properties: {
            query: cleanQuery,
            total_results: results.stats.totalResults,
            courses_count: results.stats.coursesCount,
            video_results_count: results.stats.videoResultsCount,
            lesson_results_count: results.stats.lessonResultsCount,
            sort: sort || 'relevance',
            has_results: results.stats.totalResults > 0,
            source: 'api',
          },
        });
      } catch {}
    });

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    })
  } catch (error: unknown) {
    console.error('❌ Search API error:', error)
    return NextResponse.json(
      {
        error: 'Search failed',
        message: 'An unexpected error occurred during search.',
      },
      { status: 500 }
    )
  }
}
