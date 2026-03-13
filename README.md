# Cosmic Blog

![App Preview](https://imgix.cosmicjs.com/0370ddb0-1e88-11f1-ba7e-815cdd86c4df-photo-1533104816931-20fa691ff6ca-1773370494192.jpg?w=1200&h=630&fit=crop&auto=format,compress)

A modern, responsive blog platform built with Next.js 16 and powered by [Cosmic](https://www.cosmicjs.com). Features rich markdown content rendering, author profiles, category filtering, and a beautiful editorial design.

## Features

- 📝 **Rich Blog Posts** — Full markdown rendering with code highlighting
- ✍️ **Author Profiles** — Dedicated pages for each author with their posts
- 🏷️ **Category Pages** — Browse posts organized by category
- 🖼️ **Optimized Images** — All images served via imgix with responsive sizing
- 📱 **Fully Responsive** — Beautiful on mobile, tablet, and desktop
- ⚡ **Server-Side Rendering** — Fast page loads with Next.js App Router
- 🎨 **Modern Design** — Clean editorial layout with Tailwind CSS

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=69b37c3beca4634969fd7152&clone_repository=69b38197eca4634969fd7173)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a content model for a blog with posts, authors, and categories"

### Code Generation Prompt

> "Based on the content model I created for 'Create a content model for a blog with posts, authors, and categories', now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [Cosmic](https://www.cosmicjs.com) — Headless CMS for content management ([docs](https://www.cosmicjs.com/docs))
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [react-markdown](https://github.com/remarkjs/react-markdown) — Markdown rendering
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown support

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A [Cosmic](https://www.cosmicjs.com) account with the blog content model

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cosmic-blog
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables. Create a `.env.local` file:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cosmic SDK Examples

### Fetching all posts with depth
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: posts } = await cosmic.objects
  .find({ type: 'posts' })
  .props(['id', 'title', 'slug', 'metadata', 'created_at'])
  .depth(1)
```

### Fetching a single post by slug
```typescript
const { object: post } = await cosmic.objects
  .findOne({ type: 'posts', slug: 'my-post-slug' })
  .props(['id', 'title', 'slug', 'metadata', 'created_at'])
  .depth(1)
```

### Fetching categories
```typescript
const { objects: categories } = await cosmic.objects
  .find({ type: 'categories' })
  .props(['id', 'title', 'slug', 'metadata'])
```

## Cosmic CMS Integration

This blog uses three Cosmic object types:

- **Posts** (`posts`) — Blog posts with markdown content, featured images, linked authors, and categories
- **Authors** (`authors`) — Writer profiles with name, bio, profile photo, and social links
- **Categories** (`categories`) — Content categories with names and descriptions

All content is fetched server-side using the Cosmic SDK, providing fast initial page loads and SEO-friendly rendering.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables (`COSMIC_BUCKET_SLUG`, `COSMIC_READ_KEY`, `COSMIC_WRITE_KEY`)
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import the project on [Netlify](https://netlify.com)
3. Set the build command to `bun run build`
4. Add environment variables
5. Deploy!

<!-- README_END -->