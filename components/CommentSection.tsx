'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/cosmic'
import type { Comment } from '@/types'

interface CommentSectionProps {
  postId: string
  postTitle: string
  comments: Comment[]
}

interface CommentFormData {
  author_name: string
  author_email: string
  body: string
}

export default function CommentSection({ postId, postTitle, comments }: CommentSectionProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: '',
    author_email: '',
    body: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          post_title: postTitle,
          author_name: formData.author_name.trim(),
          author_email: formData.author_email.trim(),
          body: formData.body.trim(),
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setFormData({ author_name: '', author_email: '', body: '' })
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Existing Comments */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-10">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-lg p-5 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Changed: Avatar with initials */}
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                  {(comment.metadata?.author_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {comment.metadata?.author_name || 'Anonymous'}
                  </p>
                  {comment.created_at && (
                    <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {comment.metadata?.body || ''}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      {/* Comment Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
            <p className="font-medium">Thank you for your comment!</p>
            <p className="mt-1 text-green-700">
              Your comment has been submitted and will appear after review.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-3 text-sm font-medium text-green-700 hover:text-green-900 underline transition-colors"
            >
              Write another comment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author_name"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="author_email"
                  name="author_email"
                  value={formData.author_email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
                />
                <p className="text-xs text-gray-400 mt-1">Your email won&apos;t be published.</p>
              </div>
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={4}
                maxLength={2000}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow resize-y"
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'submitting' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Post Comment'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}