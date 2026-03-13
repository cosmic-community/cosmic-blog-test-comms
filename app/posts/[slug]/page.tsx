// app/posts/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts, getPostsByCategoryId, getCommentsByPostId, formatDate } from '@/lib/cosmic'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import AuthorCard from '@/components/AuthorCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import PostCard from '@/components/PostCard'
import CommentSection from '@/components/CommentSection'
import JsonLd from '@/components/JsonLd'
import { getPostMetadata, getBlogPostingJsonLd, getBreadcrumbJsonLd, absoluteUrl } from '@/lib/seo'
import type { Metadata } from 'next'
import type { Post } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Changed: Enhanced generateMetadata with full OG, Twitter card, and canonical URL support
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return getPostMetadata(post)
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const author = post.metadata?.author
  const category = post.metadata?.category

  let relatedPosts: Post[] = []
  if (category?.id) {
    const categoryPosts = await getPostsByCategoryId(category.id)
    relatedPosts = categoryPosts
      .filter((p) => p.id !== post.id)
      .slice(0, 3)
  }

  const comments = await getCommentsByPostId(post.id)

  // Changed: Build JSON-LD structured data for this blog post
  const blogPostingJsonLd = getBlogPostingJsonLd(post)
  const breadcrumbItems = [
    { name: 'Home', url: absoluteUrl('/') },
  ]
  if (category) {
    breadcrumbItems.push({
      name: category.metadata?.name || category.title,
      url: absoluteUrl(`/categories/${category.slug}`),
    })
  }
  breadcrumbItems.push({
    name: post.title,
    url: absoluteUrl(`/posts/${post.slug}`),
  })
  const breadcrumbJsonLd = getBreadcrumbJsonLd(breadcrumbItems)

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Changed: JSON-LD structured data for post and breadcrumbs */}
      <JsonLd data={blogPostingJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-brand-600 transition-colors"
            >
              {category.metadata?.name || category.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700 truncate">{post.title}</span>
      </nav>

      {/* Category Badge */}
      {category && (
        <Link
          href={`/categories/${category.slug}`}
          className="inline-block text-sm font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full mb-4 hover:bg-brand-100 transition-colors"
        >
          {category.metadata?.name || category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
        {author && (
          <Link
            href={`/authors/${author.slug}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {author.metadata?.profile_photo && (
              <img
                src={`${author.metadata.profile_photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                alt={author.metadata?.name || author.title}
                className="w-10 h-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {author.metadata?.name || author.title}
              </p>
              {post.created_at && (
                <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
              )}
            </div>
          </Link>
        )}
      </div>

      {/* Featured Image */}
      {post.metadata?.featured_image && (
        <div className="mb-10 -mx-4 sm:mx-0">
          <img
            src={`${post.metadata.featured_image.imgix_url}?w=1400&h=700&fit=crop&auto=format,compress`}
            alt={post.title}
            className="w-full rounded-none sm:rounded-xl object-cover aspect-[2/1]"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg prose-gray max-w-none mb-12">
        <MarkdownRenderer content={post.metadata?.content || ''} />
      </div>

      {/* Newsletter CTA */}
      <div className="mb-12">
        <NewsletterSignup />
      </div>

      {/* Author Bio */}
      {author && (
        <div className="border-t border-gray-200 pt-10">
          <AuthorCard author={author} />
        </div>
      )}

      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-10 mt-10">
        <CommentSection postId={post.id} postTitle={post.title} comments={comments} />
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-gray-200 pt-10 mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}

      {/* Back Link */}
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
    </article>
  )
}