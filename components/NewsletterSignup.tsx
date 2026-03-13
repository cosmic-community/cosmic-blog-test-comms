'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  compact?: boolean
}

export default function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = (await res.json()) as { success?: boolean; error?: string }

      if (res.ok && data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (compact) {
    return (
      <div className="w-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Subscribe to our newsletter
        </h3>
        {status === 'success' ? (
          <p className="text-sm text-brand-600 font-medium">You&apos;re subscribed! 🎉</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-1.5 text-sm bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200 rounded-2xl p-8 sm:p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 rounded-full mb-4">
        <svg
          className="w-6 h-6 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Stay in the loop
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Get the latest posts delivered straight to your inbox. No spam, unsubscribe anytime.
      </p>
      {status === 'success' ? (
        <div className="bg-white/60 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-brand-700 font-semibold text-lg">You&apos;re subscribed! 🎉</p>
          <p className="text-gray-500 text-sm mt-1">Thanks for joining. Check your inbox soon.</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 border border-brand-200 bg-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-gray-900 placeholder:text-gray-400"
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-sm shadow-brand-600/20"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
          {status === 'error' && (
            <p className="text-sm text-red-600 mt-3">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  )
}