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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const rawBody = await req.json()
    const parsed = courseSchema.safeParse(rawBody)
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation Error', details: parsed.error.format() }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const finalData = { ...parsed.data, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('courses').update(finalData).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const supabase = await createServerSupabase()
    // Soft Delete: en vez de .delete(), hacemos un update a deleted_at
    const { error } = await supabase.from('courses').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
