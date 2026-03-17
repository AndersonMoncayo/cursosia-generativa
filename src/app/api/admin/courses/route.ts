export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { z } from 'zod'

// remove Admin client

async function checkAdmin() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin'
}

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  level: z.string().optional(),
  duration_hours: z.number().optional(),
  price: z.number().optional(),
  image_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  instructor: z.string().optional(),
  is_published: z.boolean().optional()
})

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, instructor, price, is_published, created_at, enrollments(id)')
    .order('created_at', { ascending: false })
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  const coursesWithCounts = data.map(c => ({
    ...c,
    enrollments_count: c.enrollments?.length || 0
  }))
  
  return NextResponse.json(coursesWithCounts)
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const rawBody = await req.json()
    const parsed = courseSchema.safeParse(rawBody)
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation Error', details: parsed.error.format() }, { status: 400 })
    }
    
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('courses').insert(parsed.data).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
