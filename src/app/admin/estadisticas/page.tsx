export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { Users, BookOpen, GraduationCap, TrendingUp, Calendar } from 'lucide-react'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminEstadisticas() {
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
  
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const usersThisWeek = users.filter((u: any) => new Date(u.created_at) >= oneWeekAgo).length

  const { count: coursesCount } = await supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true)
  const { count: enrollmentsCount } = await supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true })

  const { data: popularCourses, error } = await supabaseAdmin.rpc('get_popular_courses')
  
  // Fallback if RPC doesn't exist
  let fallbackPopular = []
  if (!popularCourses || popularCourses.length === 0 || error) {
     const { data: coursesData } = await supabaseAdmin.from('courses').select('id, title')
     if (coursesData) {
       for (const course of coursesData) {
         const { count } = await supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true }).eq('course_id', course.id)
         fallbackPopular.push({ titulo: course.title, total_enrollments: count || 0 })
       }
     }
     fallbackPopular.sort((a, b) => b.total_enrollments - a.total_enrollments)
  }

  const finalPopular = (popularCourses && popularCourses.length > 0) ? popularCourses : fallbackPopular

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-8 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            ESTADÍSTICAS
          </h1>
          <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
            Métricas de Sistema Globales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-4 border-black retro-shadow p-6 flex items-start gap-4">
          <div className="p-3 bg-black text-primary border-2 border-black">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Total Nodos</p>
            <p className="text-4xl font-black text-black">{users.length}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-black retro-shadow p-6 flex items-start gap-4">
          <div className="p-3 bg-primary text-black border-2 border-black">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Nuevos (Semana)</p>
            <p className="text-4xl font-black text-black">+{usersThisWeek}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-black retro-shadow p-6 flex items-start gap-4">
          <div className="p-3 bg-black text-yellow-400 border-2 border-black">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Cursos Activos</p>
            <p className="text-4xl font-black text-black">{coursesCount || 0}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-black retro-shadow p-6 flex items-start gap-4">
          <div className="p-3 bg-white text-black border-4 border-black">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-500 tracking-widest">Enrollments</p>
            <p className="text-4xl font-black text-black">{enrollmentsCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-black border-4 border-primary retro-shadow p-8 mt-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            CURSOS MÁS MATRICULADOS
          </h2>
        </div>

        {finalPopular.length === 0 ? (
          <div className="text-center font-bold text-slate-400 p-8 uppercase tracking-widest border-2 border-dashed border-slate-700">
            SIN DATOS DE ENROLLMENTS AÚN
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-slate-700">
                <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 w-2/3">Módulo</th>
                <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Matrículas Netas</th>
              </tr>
            </thead>
            <tbody>
              {finalPopular.slice(0, 10).map((row: any, i: number) => (
                <tr key={i} className="border-b-2 border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="py-4 px-4 text-white font-bold uppercase flex items-center gap-3">
                    <span className="text-primary text-xs font-black">{i + 1}.</span> {row.titulo}
                  </td>
                  <td className="py-4 px-4 text-primary font-black text-right text-xl">
                    {row.total_enrollments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
