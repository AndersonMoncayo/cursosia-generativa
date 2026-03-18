'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { Course } from '@/types/database.types'

export type ActionResult<T = undefined> = 
  T extends undefined 
    ? { success: boolean; error?: string }
    : { success: boolean; data?: T; error?: string }

const progressSchema = z.number().min(0).max(100)

export async function updateProgress(
  courseId: string,
  progress: number
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const parsedProgress = progressSchema.safeParse(progress)
  if (!parsedProgress.success) {
    return { success: false, error: 'Invalid progress' }
  }

  const { error } = await supabase
    .from('enrollments')
    .update({ progress: parsedProgress.data })
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  duration_hours: z.number().min(0),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  instructor: z.string().min(2),
  is_published: z.boolean(),
  image_url: z.string().optional()
})

export async function createCourse(data: z.infer<typeof courseSchema>): Promise<ActionResult<Course>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
    return { success: false, error: 'Forbidden. Admin role required.' }
  }

  const parsed = courseSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Validation error: ' + parsed.error.message }
  }

  const payload = parsed.data

  const { data: insertedCourse, error } = await supabase
    .from('courses')
    .upsert({
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      price: payload.price,
      duration_hours: Math.floor(payload.duration_hours),
      level: payload.level,
      is_published: payload.is_published,
      thumbnail_url: payload.image_url || null,
      creator_id: user.id
    }, { onConflict: 'slug', ignoreDuplicates: true })
    .select('*')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  if (!insertedCourse) {
    return { success: false, error: 'El curso con este slug probablemente ya existe (ON CONFLICT DO NOTHING aplicó).' }
  }

  return { success: true, data: insertedCourse }
}

export async function uploadCourseImage(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
    return { success: false, error: 'Forbidden' }
  }

  const file = formData.get('file') as File
  if (!file) return { success: false, error: 'No file provided' }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage.from('courses').upload(fileName, file)
  if (uploadError) {
    return { success: false, error: `Error uploading image: ${uploadError.message}. Nota: el bucket 'courses' debe existir manualmente.` }
  }

  const { data: publicUrlData } = supabase.storage.from('courses').getPublicUrl(fileName)
  
  return { success: true, data: { url: publicUrlData.publicUrl } }
}
