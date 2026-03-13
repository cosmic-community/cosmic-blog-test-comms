import type { Metadata } from 'next'
import { getPageBySlug, getAuthors } from '@/lib/cosmic'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { getBreadcrumbJsonLd, absoluteUrl, SITE_NAME } from '@/lib/seo'
import type { Author } from '@/types'

// Changed: Enhanced metadata with OG tags for about page
export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${SITE_NAME} and the team behind it.`,
  openGraph: {
    title: `About — ${SITE_NAME}`,
    description: `Learn more about ${SITE_NAME} and the team behind it.`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `About — ${SITE_NAME}`,
    description: `Learn more about ${SITE_NAME} and the team behind it.`,
  },
}

export default async function AboutPage() {
  const [page, authors] = await Promise.all([
    getPageBySlug('about'),
    getAuthors(),
  ])

  // Changed: Breadcrumb JSON-LD for about page
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'About', url: absoluteUrl('/about') },
  ])

  return (
    <div>
      {/* Changed: JSON-LD breadcrumb structured data */}
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {page?.metadata?.hero_image && (
            <img
              src={`${page.metadata.hero_image.imgix_url}?w=1920&h=600&fit=crop&auto=format,compress&q=70`}
              alt={page.title}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            {page?.title || 'About Us'}
          </h1>
          {page?.metadata?.subtitle && (
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
              {page.metadata.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Page Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {page?.metadata?.content ? (
          <div className="prose prose-lg max-w-none prose-gray prose-headings:text-gray-900 prose-a:text-brand-600 hover:prose-a:text-brand-700">
            <MarkdownRenderer content={page.metadata.content} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No about page content found. Add an &ldquo;About&rdquo; page in your Cosmic dashboard using the Pages object type.
            </p>
          </div>
        )}
      </section>

      {/* Meet the Team */}
      {authors.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Meet the Team
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
              The writers and creators behind Cosmic Blog.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.map((author: Author) => (
                <Link
                  key={author.id}
                  href={`/authors/${author.slug}`}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-brand-200 transition-all text-center"
                >
                  {author.metadata?.profile_photo ? (
                    <img
                      src={`${author.metadata.profile_photo.imgix_url}?w=256&h=256&fit=crop&auto=format,compress`}
                      alt={author.metadata?.name || author.title}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-2 ring-gray-100 group-hover:ring-brand-200 transition-all"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-brand-600">
                      {(author.metadata?.name || author.title)?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                    {author.metadata?.name || author.title}
                  </h3>
                  {author.metadata?.bio && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                      {author.metadata.bio}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}