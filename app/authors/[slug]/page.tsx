// app/authors/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getPostsByAuthorId, getAuthors } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import JsonLd from '@/components/JsonLd'
import { getAuthorMetadata, getPersonJsonLd, getBreadcrumbJsonLd, absoluteUrl } from '@/lib/seo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Changed: Enhanced generateMetadata with full OG profile tags and Twitter cards
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    return { title: 'Author Not Found' }
  }

  return getAuthorMetadata(author)
}

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((author) => ({
    slug: author.slug,
  }))
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)

  if (!author) {
    notFound()
  }

  const posts = await getPostsByAuthorId(author.id)

  // Sort posts by created_at descending
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })

  // Changed: Build JSON-LD structured data for author
  const personJsonLd = getPersonJsonLd(author)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl('/') },
    { name: author.metadata?.name || author.title, url: absoluteUrl(`/authors/${author.slug}`) },
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Changed: JSON-LD structured data for author and breadcrumbs */}
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-700">{author.metadata?.name || author.title}</span>
      </nav>

      {/* Author Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-12 pb-12 border-b border-gray-200">
        {author.metadata?.profile_photo && (
          <img
            src={`${author.metadata.profile_photo.imgix_url}?w=240&h=240&fit=crop&auto=format,compress`}
            alt={author.metadata?.name || author.title}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-brand-50"
            width={112}
            height={112}
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {author.metadata?.name || author.title}
          </h1>
          {author.metadata?.bio && (
            <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
              {author.metadata.bio}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'}
            </span>
            {author.metadata?.social_link && (
              <a
                href={author.metadata.social_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Posts by {author.metadata?.name || author.title}
      </h2>

      {sortedPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No posts by this author yet.</p>
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
          href="/"
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to all posts
        </Link>
      </div>
    </div>
  )
}