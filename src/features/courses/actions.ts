'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export type ActionResult = {
  success: boolean
  error?: string
}

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
