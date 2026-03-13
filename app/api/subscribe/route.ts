import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Type guard for Cosmic API errors
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim().toLowerCase()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Check if email already exists
    try {
      const existing = await cosmic.objects
        .find({
          type: 'newsletter-subscribers',
          'metadata.email': email,
        })
        .props(['id', 'title'])

      if (existing.objects && existing.objects.length > 0) {
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 409 }
        )
      }
    } catch (error: unknown) {
      // 404 means no objects found — that's fine, we can proceed
      if (!hasStatus(error) || error.status !== 404) {
        throw error
      }
    }

    // Create the subscriber object
    await cosmic.objects.insertOne({
      title: email,
      type: 'newsletter-subscribers',
      metadata: {
        email,
        subscribed_at: new Date().toISOString(),
        status: 'Active',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed. Please try again later.' },
      { status: 500 }
    )
  }
}