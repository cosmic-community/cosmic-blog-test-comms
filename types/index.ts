// Cosmic file/image type
export interface CosmicFile {
  url: string
  imgix_url: string
}

// Author object type
export interface Author {
  id: string
  title: string
  slug: string
  metadata?: {
    name?: string
    bio?: string
    profile_photo?: CosmicFile
    social_link?: string
  }
  created_at?: string
}

// Category object type
export interface Category {
  id: string
  title: string
  slug: string
  metadata?: {
    name?: string
    description?: string
  }
  created_at?: string
}

// Post object type
export interface Post {
  id: string
  title: string
  slug: string
  metadata?: {
    content?: string
    featured_image?: CosmicFile
    author?: Author
    category?: Category
  }
  created_at?: string
}

// Page object type
export interface Page {
  id: string
  title: string
  slug: string
  metadata?: {
    content?: string
    hero_image?: CosmicFile
    subtitle?: string
  }
  created_at?: string
}

// Changed: Added Comment object type for the comments system
export interface Comment {
  id: string
  title: string
  slug: string
  metadata?: {
    post_id?: string
    author_name?: string
    author_email?: string
    body?: string
    status?: string
  }
  created_at?: string
}

// Newsletter subscriber object type
export interface NewsletterSubscriber {
  id: string
  title: string
  slug: string
  metadata?: {
    email?: string
    subscribed_at?: string
    status?: string
  }
  created_at?: string
}