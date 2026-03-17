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
    .from('profiles')
    .select('*, enrollments(id)')
    .order('created_at', { ascending: false })
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  const usersWithCounts = data.map(u => ({
    ...u,
    enrollments_count: u.enrollments?.length || 0
  }))
  return NextResponse.json(usersWithCounts)
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, role } = await req.json()
    if (!id || !role || !['student', 'admin', 'instructor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
