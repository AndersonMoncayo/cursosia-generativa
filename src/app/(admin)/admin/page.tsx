import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SEO } from '@/components/atoms/SEO'

export default async function Admin() {
  const supabase = await createClient()

  // Fetch metrics and data
  const { data: cData } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
  const { data: pData } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  const { data: uData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(50)
  const { data: purData } = await supabase.from('purchases').select('amount_paid')
  
  const totalRev = purData?.reduce((acc, curr) => acc + curr.amount_paid, 0) || 0

  const metrics = {
    totalRevenue: totalRev,
    activeStudents: uData?.length || 0,
    coursesPublished: cData?.filter(c => c.is_published).length || 0,
  }

  return (
    <div className="bg-background-dark font-display text-slate-100 grid-pattern min-h-screen">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-black border-r-4 border-primary p-6 shrink-0 relative z-20">
          <div className="flex items-center gap-3 mb-10 border-b-2 border-slate-800 pb-4">
            <span className="material-symbols-outlined text-orange-500 text-3xl">admin_panel_settings</span>
            <div>
              <h2 className="text-white font-black uppercase tracking-tighter leading-none">Admin_Sys</h2>
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Root Access</span>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
             <div className="bg-primary text-black font-bold uppercase text-sm px-4 py-3 border-2 border-black retro-shadow flex items-center gap-3 w-full">
               <span className="material-symbols-outlined">monitoring</span> Dashboard
             </div>
             <div className="text-slate-400 font-bold uppercase text-sm px-4 py-3 flex items-center gap-3 w-full">
               <span className="material-symbols-outlined">school</span> Cursos
             </div>
             <div className="text-slate-400 font-bold uppercase text-sm px-4 py-3 flex items-center gap-3 w-full">
               <span className="material-symbols-outlined">article</span> Blog
             </div>
            <Link href="/" className="mt-8 flex items-center gap-3 w-full px-4 py-3 font-bold uppercase text-sm text-slate-400 hover:text-white border-t-2 border-slate-800">
              <span className="material-symbols-outlined">logout</span>Volver al Sitio
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 w-full overflow-x-hidden">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b-4 border-white pb-6">
            <h1 className="text-4xl md:text-5xl border-l-8 border-primary pl-4 font-black uppercase text-white tracking-tighter">
              General_Metrics
            </h1>
            <div className="flex gap-4">
              <div className="bg-black border-2 border-white px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase text-white">System Online</span>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-4 border-black p-6 retro-shadow text-black">
                <span className="material-symbols-outlined mb-2 text-primary">payments</span>
                <h3 className="text-sm font-bold uppercase text-slate-500">Ingresos Totales</h3>
                <p className="text-5xl font-black mt-2">${metrics.totalRevenue}</p>
              </div>
              <div className="bg-white border-4 border-black p-6 retro-shadow text-black">
                <span className="material-symbols-outlined mb-2 text-blue-500">school</span>
                <h3 className="text-sm font-bold uppercase text-slate-500">Cursos Publicados</h3>
                <p className="text-5xl font-black mt-2">{metrics.coursesPublished}</p>
              </div>
              <div className="bg-white border-4 border-black p-6 retro-shadow text-black">
                <span className="material-symbols-outlined mb-2 text-orange-500">group</span>
                <h3 className="text-sm font-bold uppercase text-slate-500">Usuarios Activos</h3>
                <p className="text-5xl font-black mt-2">{metrics.activeStudents}</p>
              </div>
            </div>
            
            <div className="bg-black border-4 border-primary p-6 md:p-10 retro-shadow">
              <h3 className="text-xl font-black text-primary uppercase mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">terminal</span>Terminal_Log
              </h3>
              <div className="font-mono text-xs md:text-sm text-green-400 space-y-2 opacity-80 h-48 overflow-y-auto">
                <p>{">"} INITIALIZING ADMIN INTERFACE...</p>
                <p>{">"} FETCHING DATA FROM SUPABASE...</p>
                <p>{">"} STATUS 200 OK.</p>
                <p>{">"} {metrics.activeStudents} RECORDS LOADED.</p>
                <p>{">"} AWAITING COMMANDS_</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
