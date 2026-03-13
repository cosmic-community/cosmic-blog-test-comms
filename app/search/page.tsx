import Link from 'next/link'
import SearchResults from '@/components/SearchResults'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search | Cosmic Blog',
  description: 'Search blog posts by title, content, category, or author.',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const initialQuery = q || ''

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-700">Search</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Search</h1>
      <p className="text-lg text-gray-600 mb-8">
        Find posts across the entire blog.
      </p>

      <SearchResults initialQuery={initialQuery} />
    </div>
  )
}