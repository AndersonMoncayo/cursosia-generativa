'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from './schemas'
import type { ActionResult } from '@/types/database.types'

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export async function loginAction(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = loginSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { ok: false, error: 'Credenciales incorrectas' }
  }

  return { ok: true, data: undefined }
}

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
export async function registerAction(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = registerSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, data: undefined }
}

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export async function logoutAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, data: undefined }
}
