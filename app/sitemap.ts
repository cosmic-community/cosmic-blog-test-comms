// Changed: Dynamic sitemap generation pulling all posts, categories, and authors from Cosmic
import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/cosmic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmic-blog.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all slugs in parallel
  const [postSlugs, categorySlugs, authorSlugs] = await Promise.all([
    getAllSlugs('posts'),
    getAllSlugs('categories'),
    getAllSlugs('authors'),
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  // Post pages
  const postPages: MetadataRoute.Sitemap = postSlugs.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Author pages
  const authorPages: MetadataRoute.Sitemap = authorSlugs.map((author) => ({
    url: `${SITE_URL}/authors/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...categoryPages, ...authorPages]
}