export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { Terminal, Square, ChevronsRight, DollarSign } from 'lucide-react'
import Link from 'next/link'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminPage() {
  const [
    { count: totalCursos },
    { count: totalEnrollments },
    { data: profiles },
    { data: { users } }
  ] = await Promise.all([
    supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 })
  ])

  const totalUsuarios = users?.length || 0
  
  // Merge profiles con emails de auth.users para la tabla
  const recentUsers = profiles?.map(p => ({
    ...p,
    email: users?.find(u => u.id === p.id)?.email || ''
  })) || []

  return (
    <div>
      <h1 className="font-mono font-black tracking-tighter text-white text-2xl sm:text-3xl mb-2">RESUMEN GENERAL</h1>
      <p className="font-mono font-bold text-[#00FF41] text-xs mb-6 sm:mb-8">METRICAS PRINCIPALES DEL SISTEMA</p>
      <div className="w-full h-1 bg-[#00FF41] mb-6 sm:mb-8" />

      {/* STATS GRID — responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'USUARIOS', value: totalUsuarios, icon: <Terminal className="w-5 h-5 text-[#00ff00]" />, trend: '+2 este mes ↑' },
          { label: 'CURSOS', value: totalCursos || 0, icon: <Square className="w-5 h-5 text-[#00ff00]" />, trend: 'Activos en catálogo' },
          { label: 'ENROLLMENTS', value: totalEnrollments || 0, icon: <ChevronsRight className="w-5 h-5 text-[#00ff00]" />, trend: '+1 reciente ↑' },
          { label: 'INGRESOS', value: '$0', icon: <DollarSign className="w-5 h-5 text-[#00ff00]" />, trend: '0% vs anterior' },
        ].map(stat => (
          <div key={stat.label} className="bg-black border-2 border-[#333] hover:border-[#00ff00] transition-colors p-6 group flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              {stat.icon}
              <span className="font-mono font-bold text-[#00ff00] text-xs uppercase">{stat.label}</span>
            </div>
            <p className="font-mono font-black tracking-tighter text-5xl text-white mb-2">{stat.value}</p>
            <p className="font-mono text-[#666] text-xs mt-auto">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* 2 COLUMNS: USUARIOS RECIENTES & ACTIVIDAD RECIENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TABLA ULTIMOS USUARIOS */}
        <div className="bg-black border-2 border-[#333] p-6 lg:p-8 flex flex-col">
          <h2 className="font-mono font-black tracking-tighter text-white text-xl mb-6 uppercase">USUARIOS_RECIENTES.LOG</h2>
          <div className="flex flex-col gap-4 flex-1">
            {recentUsers.length === 0 ? (
               <div className="text-gray-500 font-mono text-xs flex items-center gap-1">
                 &gt; sin usuarios recientes<span className="w-2 h-4 bg-[#00ff00] animate-pulse inline-block ml-1"></span>
               </div>
            ) : recentUsers.map(u => {
              const initials = (u.full_name || 'U').substring(0, 2).toUpperCase()
              const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
              const daysDiff = Math.round((new Date(u.created_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              let relativeDate = rtf.format(daysDiff, 'day')
              if (daysDiff === 0) relativeDate = 'hoy'
              
              return (
                <div key={u.id} className="flex items-center gap-4 border-b border-[#222] pb-4 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-black border-2 border-[#00ff00] flex items-center justify-center shrink-0">
                    <span className="font-mono font-bold text-white text-sm">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-white text-sm truncate uppercase">{u.full_name || 'SIN NOMBRE'}</p>
                    <p className="font-mono text-gray-500 text-xs truncate lowercase">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className={`font-mono text-[10px] font-black px-2 py-0.5 border ${
                      u.role === 'admin' ? 'border-[#ff0000] text-[#ff0000]' : 
                      'border-[#00ff00] text-[#00ff00]'
                    }`}>{u.role?.toUpperCase() || 'STUDENT'}</span>
                    <span className="font-mono text-[#666] text-[10px] uppercase">{relativeDate}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-[#333]">
            <Link href="/admin/usuarios" className="font-mono text-[#00ff00] text-xs hover:text-white transition-colors uppercase font-bold">VER TODOS →</Link>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="bg-black border-2 border-[#333] p-6 lg:p-8">
          <h2 className="font-mono font-black tracking-tighter text-white text-xl mb-6 uppercase">ACTIVIDAD_RECIENTE.LOG</h2>
          <div className="flex flex-col gap-4 font-mono text-xs">
            {/* Mocked data matching user exact example */}
            <div className="flex items-start gap-3 border-b border-[#222] pb-4">
              <span className="text-[#00ff00] mt-0.5">●</span>
              <span className="text-gray-400 flex-1 leading-relaxed">ASGASGAS se inscribió en "Prompt Engineering"</span>
              <span className="text-[#666] shrink-0">hace 1h</span>
            </div>
            <div className="flex items-start gap-3 border-b border-[#222] pb-4">
              <span className="text-[#00ff00] mt-0.5">●</span>
              <span className="text-gray-400 flex-1 leading-relaxed">Anderson Moncayo creó el curso "IA para Negocios"</span>
              <span className="text-[#666] shrink-0">hace 3h</span>
            </div>
            <div className="flex items-start gap-3 pb-4">
              <span className="text-[#00ff00] mt-0.5">●</span>
              <span className="text-gray-400 flex-1 leading-relaxed">Sistema: 4 cursos activos en catálogo</span>
              <span className="text-[#666] shrink-0">hoy</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
