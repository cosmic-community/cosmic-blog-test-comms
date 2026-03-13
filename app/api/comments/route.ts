import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

// Changed: Simple email validation for comment submissions
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface CommentPayload {
  post_id?: string
  post_title?: string
  author_name?: string
  author_email?: string
  body?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CommentPayload
    const postId = payload.post_id?.trim()
    const postTitle = payload.post_title?.trim() || 'Unknown Post'
    const authorName = payload.author_name?.trim()
    const authorEmail = payload.author_email?.trim().toLowerCase()
    const body = payload.body?.trim()

    // Changed: Validate all required fields
    if (!postId) {
      return NextResponse.json(
        { error: 'Missing post reference.' },
        { status: 400 }
      )
    }

    if (!authorName || authorName.length < 1) {
      return NextResponse.json(
        { error: 'Please provide your name.' },
        { status: 400 }
      )
    }

    if (!authorEmail || !isValidEmail(authorEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    if (!body || body.length < 2) {
      return NextResponse.json(
        { error: 'Please write a comment (at least 2 characters).' },
        { status: 400 }
      )
    }

    if (body.length > 2000) {
      return NextResponse.json(
        { error: 'Comment is too long (max 2000 characters).' },
        { status: 400 }
      )
    }

    // Changed: Create the comment in Cosmic with "Pending" status for moderation
    await cosmic.objects.insertOne({
      title: `Comment by ${authorName} on "${postTitle}"`,
      type: 'comments',
      metadata: {
        post_id: postId,
        author_name: authorName,
        author_email: authorEmail,
        body: body,
        status: 'Pending',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Comment submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit comment. Please try again later.' },
      { status: 500 }
    )
  }
}