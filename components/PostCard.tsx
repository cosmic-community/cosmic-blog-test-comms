import Link from 'next/link'
import { formatDate } from '@/lib/cosmic'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  className?: string
}

export default function PostCard({ post, className }: PostCardProps) {
  const author = post.metadata?.author
  const category = post.metadata?.category
  const featuredImage = post.metadata?.featured_image

  return (
    <article
      className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all duration-300 ${className || ''}`}
    >
      {/* Image */}
      {featuredImage && (
        <Link href={`/posts/${post.slug}`} className="block overflow-hidden">
          <img
            src={`${featuredImage.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="inline-block text-xs font-semibold uppercase tracking-wide text-brand-600 mb-2 hover:text-brand-800 transition-colors"
          >
            {category.metadata?.name || category.title}
          </Link>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:text-brand-700 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt - first 120 chars of content */}
        {post.metadata?.content && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.metadata.content
              .replace(/^#.*$/gm, '')
              .replace(/[*`\[\]]/g, '')
              .trim()
              .substring(0, 120)}
            ...
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {author && (
            <Link
              href={`/authors/${author.slug}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {author.metadata?.profile_photo && (
                <img
                  src={`${author.metadata.profile_photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={author.metadata?.name || author.title}
                  className="w-7 h-7 rounded-full object-cover"
                  width={28}
                  height={28}
                />
              )}
              <span className="text-sm font-medium text-gray-700">
                {author.metadata?.name || author.title}
              </span>
            </Link>
          )}
          {post.created_at && (
            <time className="text-xs text-gray-400">{formatDate(post.created_at)}</time>
          )}
        </div>
      </div>
    </article>
  )
}