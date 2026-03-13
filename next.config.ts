import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Changed: Added env passthrough for NEXT_PUBLIC_SITE_URL used in SEO/sitemap generation
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmic-blog.vercel.app',
  },
}

export default nextConfig