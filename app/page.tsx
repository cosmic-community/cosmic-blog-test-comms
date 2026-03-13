import Link from 'next/link'
import { getPosts, getCategories, formatDate } from '@/lib/cosmic'
import PostCard from '@/components/PostCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import JsonLd from '@/components/JsonLd'
import { getWebsiteJsonLd, getBlogPostingJsonLd } from '@/lib/seo'
import type { Post } from '@/types'

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ])

  // Sort posts by created_at descending
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })

  const heroPost: Post | undefined = sortedPosts[0]
  const remainingPosts = sortedPosts.slice(1)

  // Changed: Build JSON-LD structured data for homepage and recent posts
  const websiteJsonLd = getWebsiteJsonLd()
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Cosmic Blog',
    description: 'A modern blog powered by Cosmic CMS — featuring posts on technology, travel, and more.',
    blogPost: sortedPosts.slice(0, 10).map((post) => getBlogPostingJsonLd(post)),
  }

  return (
    <div>
      {/* Changed: JSON-LD structured data for homepage SEO */}
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={blogJsonLd} />

      {/* Hero Section */}
      {heroPost && (
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            {heroPost.metadata?.featured_image && (
              <img
                src={`${heroPost.metadata.featured_image.imgix_url}?w=1920&h=800&fit=crop&auto=format,compress&q=70`}
                alt={heroPost.title}
                className="w-full h-full object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            {heroPost.metadata?.category && (
              <Link
                href={`/categories/${heroPost.metadata.category.slug}`}
                className="inline-block text-sm font-medium text-brand-300 bg-brand-900/40 px-3 py-1 rounded-full mb-4 hover:bg-brand-900/60 transition-colors"
              >
                {heroPost.metadata.category.metadata?.name || heroPost.metadata.category.title}
              </Link>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-3xl">
              <Link href={`/posts/${heroPost.slug}`} className="hover:text-brand-200 transition-colors">
                {heroPost.title}
              </Link>
            </h1>
            <div className="flex items-center gap-4 text-gray-300">
              {heroPost.metadata?.author && (
                <Link
                  href={`/authors/${heroPost.metadata.author.slug}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  {heroPost.metadata.author.metadata?.profile_photo && (
                    <img
                      src={`${heroPost.metadata.author.metadata.profile_photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                      alt={heroPost.metadata.author.metadata?.name || heroPost.metadata.author.title}
                      className="w-8 h-8 rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                  )}
                  <span className="text-sm font-medium">
                    {heroPost.metadata.author.metadata?.name || heroPost.metadata.author.title}
                  </span>
                </Link>
              )}
              {heroPost.created_at && (
                <span className="text-sm">{formatDate(heroPost.created_at)}</span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Category Pills */}
      {categories.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/categories"
              className="text-sm font-medium px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              All Categories
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-sm font-medium px-4 py-2 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
              >
                {category.metadata?.name || category.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <NewsletterSignup />
      </section>

      {/* Posts Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {remainingPosts.length > 0 ? 'Latest Posts' : 'All Posts'}
        </h2>
        {(remainingPosts.length > 0 ? remainingPosts : sortedPosts).length === 0 ? (
          <p className="text-gray-500 text-center py-12">No posts found. Add some content in your Cosmic dashboard!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(remainingPosts.length > 0 ? remainingPosts : sortedPosts).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}