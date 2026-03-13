// Base Cosmic object interface
export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, unknown>
  type?: string
  created_at?: string
  modified_at?: string
  status?: string
  thumbnail?: string
  published_at?: string
}

// Author type
export interface Author extends CosmicObject {
  type?: 'authors'
  metadata: {
    name: string
    bio?: string
    profile_photo?: {
      url: string
      imgix_url: string
    }
    social_link?: string
  }
}

// Category type
export interface Category extends CosmicObject {
  type?: 'categories'
  metadata: {
    name: string
    description?: string
  }
}

// Post type
export interface Post extends CosmicObject {
  type?: 'posts'
  metadata: {
    content: string
    featured_image?: {
      url: string
      imgix_url: string
    }
    author?: Author
    category?: Category
  }
}

// Cosmic API response
export interface CosmicResponse<T> {
  objects: T[]
  total: number
  limit?: number
  skip?: number
}

export interface CosmicSingleResponse<T> {
  object: T
}