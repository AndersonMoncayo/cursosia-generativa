export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAdmin() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin'
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('id, title, instructor_nombre, price, is_published, created_at, enrollments(id)')
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
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('courses').insert(body).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
