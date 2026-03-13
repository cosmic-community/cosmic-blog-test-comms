import type { Metadata } from 'next'
import type { Post, Author, Category } from '@/types'

// Changed: Added centralized SEO configuration and helpers

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmic-blog.vercel.app'
const SITE_NAME = 'Cosmic Blog'
const SITE_DESCRIPTION = 'A modern blog powered by Cosmic CMS — featuring posts on technology, travel, and more.'

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION }

// Changed: Helper to build absolute URLs
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// Changed: Default metadata shared across all pages
export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
  }
}

// Changed: Generate metadata for a blog post page
export function getPostMetadata(post: Post): Metadata {
  const title = post.title
  const description = post.metadata?.content
    ?.substring(0, 160)
    ?.replace(/[#*`\n]/g, '')
    ?.trim() || `Read "${post.title}" on ${SITE_NAME}`
  const url = absoluteUrl(`/posts/${post.slug}`)
  const imageUrl = post.metadata?.featured_image?.imgix_url
    ? `${post.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : undefined
  const authorName = post.metadata?.author?.metadata?.name || post.metadata?.author?.title

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: post.created_at || undefined,
      authors: authorName ? [authorName] : undefined,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: url,
    },
  }
}

// Changed: Generate metadata for an author page
export function getAuthorMetadata(author: Author): Metadata {
  const name = author.metadata?.name || author.title
  const title = name
  const description = author.metadata?.bio || `Posts by ${name} on ${SITE_NAME}`
  const url = absoluteUrl(`/authors/${author.slug}`)
  const imageUrl = author.metadata?.profile_photo?.imgix_url
    ? `${author.metadata.profile_photo.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`
    : undefined

  return {
    title,
    description,
    openGraph: {
      type: 'profile',
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 400,
              height: 400,
              alt: name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: url,
    },
  }
}

// Changed: Generate metadata for a category page
export function getCategoryMetadata(category: Category): Metadata {
  const name = category.metadata?.name || category.title
  const title = name
  const description = category.metadata?.description || `Browse posts in the "${name}" category on ${SITE_NAME}`
  const url = absoluteUrl(`/categories/${category.slug}`)

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

// Changed: JSON-LD for the blog homepage (WebSite schema)
export function getWebsiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Changed: JSON-LD for a BlogPosting
export function getBlogPostingJsonLd(post: Post): Record<string, unknown> {
  const authorName = post.metadata?.author?.metadata?.name || post.metadata?.author?.title
  const authorSlug = post.metadata?.author?.slug
  const imageUrl = post.metadata?.featured_image?.imgix_url
    ? `${post.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : undefined

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: absoluteUrl(`/posts/${post.slug}`),
    datePublished: post.created_at || undefined,
    description: post.metadata?.content
      ?.substring(0, 160)
      ?.replace(/[#*`\n]/g, '')
      ?.trim() || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/posts/${post.slug}`),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  if (imageUrl) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    }
  }

  if (authorName) {
    jsonLd.author = {
      '@type': 'Person',
      name: authorName,
      url: authorSlug ? absoluteUrl(`/authors/${authorSlug}`) : undefined,
    }
  }

  return jsonLd
}

// Changed: JSON-LD for a Person (author page)
export function getPersonJsonLd(author: Author): Record<string, unknown> {
  const name = author.metadata?.name || author.title
  const imageUrl = author.metadata?.profile_photo?.imgix_url
    ? `${author.metadata.profile_photo.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`
    : undefined

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: absoluteUrl(`/authors/${author.slug}`),
    description: author.metadata?.bio || undefined,
  }

  if (imageUrl) {
    jsonLd.image = imageUrl
  }

  if (author.metadata?.social_link) {
    jsonLd.sameAs = [author.metadata.social_link]
  }

  return jsonLd
}

// Changed: JSON-LD BreadcrumbList
export interface BreadcrumbItem {
  name: string
  url: string
}

export function getBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}