'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function enrollFreeCourse(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/registro')
  }

  // Verificamos que sea gratis por seguridad
  const { data: course } = await supabase
    .from('courses')
    .select('price, slug')
    .eq('id', courseId)
    .single()

  if (!course || course.price !== 0) {
    redirect('/dashboard')
  }

  // Insertar asumiendo tabla enrollments 
  await supabase.from('enrollments').upsert({
    user_id: user.id,
    course_id: courseId
  }, {
    onConflict: 'user_id,course_id',
    ignoreDuplicates: true
  })

  // Redirigir al panel
  redirect('/dashboard')
}
