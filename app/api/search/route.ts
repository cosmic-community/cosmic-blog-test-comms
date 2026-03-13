import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchPosts(query)

    // Sort results by created_at descending
    const sortedResults = results.sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime()
      const dateB = new Date(b.created_at || '').getTime()
      return dateB - dateA
    })

    return NextResponse.json({ results: sortedResults })
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}