import { createClient } from '@/lib/supabase/server'
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react'

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Queries to get stats
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: totalCourses } = await supabase.from('courses').select('*', { count: 'exact', head: true })
  const { count: totalEnrollments } = await supabase.from('enrollments').select('*', { count: 'exact', head: true })

  // Ultimos registros combinando auth.users y profiles con supabaseAdmin
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
  const { data: profiles } = await supabaseAdmin.from('profiles').select('*')

  const latestUsers = users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    role: profiles?.find(p => p.id === u.id)?.role || 'student',
    full_name: profiles?.find(p => p.id === u.id)?.full_name || 'SIN NOMBRE'
  })).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

  return (
    <div className="space-y-10">
      <div className="border-b-8 border-primary pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          RESUMEN GENERAL
        </h1>
        <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
          Métricas principales del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-4 border-black p-6 retro-shadow text-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase text-sm text-slate-500 tracking-widest">Usuarios</h3>
            <Users className="w-6 h-6 text-primary" />
          </div>
          <p className="text-5xl font-black tracking-tighter">{totalUsers || 0}</p>
        </div>

        <div className="bg-white border-4 border-black p-6 retro-shadow text-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase text-sm text-slate-500 tracking-widest">Cursos</h3>
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <p className="text-5xl font-black tracking-tighter">{totalCourses || 0}</p>
        </div>

        <div className="bg-white border-4 border-black p-6 retro-shadow text-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase text-sm text-slate-500 tracking-widest">Enrollments</h3>
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-5xl font-black tracking-tighter">{totalEnrollments || 0}</p>
        </div>

        <div className="bg-primary border-4 border-black p-6 retro-shadow text-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase text-sm text-black tracking-widest">Ingresos Aprox</h3>
            <DollarSign className="w-6 h-6 text-black" />
          </div>
          <p className="text-5xl font-black tracking-tighter">--</p>
        </div>
      </div>

      {/* Latest Users Table */}
      <div className="bg-black border-4 border-slate-700 retro-shadow mt-12 p-8">
        <h2 className="text-2xl font-black uppercase text-white mb-6 tracking-tighter">Últimos Nodos Registrados</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-slate-700">
                <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 w-1/3">Usuario / Email</th>
                <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900">Rol</th>
                <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers?.map((u: any, idx) => (
                <tr key={idx} className="border-b-2 border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="py-4 px-4 text-white font-bold">
                    <div className="uppercase">{u.full_name || 'SIN NOMBRE'}</div>
                    <div className="text-xs text-slate-500 lowercase">{u.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-black uppercase border-2 ${
                      u.role === 'admin' ? 'bg-primary text-black border-primary' : 'bg-slate-800 text-slate-300 border-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-bold text-sm text-right uppercase">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!latestUsers || latestUsers.length === 0) && (
            <div className="text-center p-6 text-slate-500 font-bold uppercase text-sm">
              Sin datos recientes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
