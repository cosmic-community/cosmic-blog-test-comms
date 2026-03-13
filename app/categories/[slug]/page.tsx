// app/categories/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getPostsByCategoryId, getCategories } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import JsonLd from '@/components/JsonLd'
import { getCategoryMetadata, getBreadcrumbJsonLd, absoluteUrl } from '@/lib/seo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Changed: Enhanced generateMetadata with full OG and Twitter card support
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  return getCategoryMetadata(category)
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const posts = await getPostsByCategoryId(category.id)

  // Sort posts by created_at descending
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })

  // Changed: Build JSON-LD breadcrumb structured data for category page
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Categories', url: absoluteUrl('/categories') },
    { name: category.metadata?.name || category.title, url: absoluteUrl(`/categories/${category.slug}`) },
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Changed: JSON-LD breadcrumb structured data */}
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-brand-600 transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-gray-700">{category.metadata?.name || category.title}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {category.metadata?.name || category.title}
        </h1>
        {category.metadata?.description && (
          <p className="text-lg text-gray-600 max-w-2xl">
            {category.metadata.description}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-3">
          {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {/* Posts */}
      {sortedPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No posts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Back */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All categories
        </Link>
      </div>
    </div>
  )
}