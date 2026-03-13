import Link from 'next/link'
import type { Author } from '@/types'

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-5">
      {author.metadata?.profile_photo && (
        <Link href={`/authors/${author.slug}`} className="shrink-0">
          <img
            src={`${author.metadata.profile_photo.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
            alt={author.metadata?.name || author.title}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-50 hover:ring-brand-200 transition-all"
            width={64}
            height={64}
          />
        </Link>
      )}
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Written by
        </p>
        <Link
          href={`/authors/${author.slug}`}
          className="text-lg font-bold text-gray-900 hover:text-brand-700 transition-colors"
        >
          {author.metadata?.name || author.title}
        </Link>
        {author.metadata?.bio && (
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            {author.metadata.bio}
          </p>
        )}
        {author.metadata?.social_link && (
          <a
            href={author.metadata.social_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 mt-3 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow on X
          </a>
        )}
      </div>
    </div>
  )
}