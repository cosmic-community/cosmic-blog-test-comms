// Cosmic base object
export interface CosmicObject {
  id: string
  title: string
  slug: string
  metadata: Record<string, unknown>
  created_at?: string
  status?: string
}

// Author
export interface Author extends CosmicObject {
  metadata: {
    name?: string
    bio?: string
    profile_photo?: {
      url: string
      imgix_url: string
    }
    social_link?: string
  }
}

// Category
export interface Category extends CosmicObject {
  metadata: {
    name?: string
    description?: string
  }
}

// Post
export interface Post extends CosmicObject {
  metadata: {
    content?: string
    featured_image?: {
      url: string
      imgix_url: string
    }
    author?: Author
    category?: Category
  }
}

// Changed: Added Page interface for the new pages object type
export interface Page extends CosmicObject {
  metadata: {
    content?: string
    hero_image?: {
      url: string
      imgix_url: string
    }
    subtitle?: string
  }
}