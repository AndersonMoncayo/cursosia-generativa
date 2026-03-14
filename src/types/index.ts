export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'admin'
  created_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  long_description?: string | null
  price: number
  original_price?: number | null
  image_url?: string | null
  color?: string
  instructor: string
  duration_hours?: number | null
  lessons_count: number
  level: 'beginner' | 'intermediate' | 'advanced' | null
  category?: string | null
  badge?: 'new' | 'popular' | 'free' | 'sale' | null
  has_certificate: boolean
  is_free: boolean
  is_published: boolean
  created_at: string
}

export interface Review {
  id: string
  course_id: string
  user_id: string
  user_name: string
  rating: number
  comment?: string | null
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  course_id: string
  amount_paid: number
  stripe_session_id?: string | null
  status: 'pending' | 'completed' | 'refunded'
  created_at: string
}

export interface Progress {
  id: string
  user_id: string
  course_id: string
  percent_complete: number
  last_accessed: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  cover_url?: string | null
  category?: string | null
  is_published: boolean
  created_at: string
}
