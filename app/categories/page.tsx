import Link from 'next/link'
import { getCategories, getPosts } from '@/lib/cosmic'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories | Cosmic Blog',
  description: 'Browse all blog categories.',
}

export default async function CategoriesPage() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-700">Categories</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Categories</h1>
      <p className="text-lg text-gray-600 mb-12">
        Browse posts organized by topic.
      </p>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((category) => {
            const postCount = posts.filter(
              (p) => p.metadata?.category?.id === category.id
            ).length

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                    {category.metadata?.name || category.title}
                  </h2>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {postCount} {postCount === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                {category.metadata?.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.metadata.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 mt-4 group-hover:gap-2 transition-all">
                  View posts
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}