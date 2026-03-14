import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import type { Course, Progress, Profile } from '@/types'

interface PurchasedCourse extends Course {
  progress?: Progress
}

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null // Handled by middleware but safe check

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: purchases } = await supabase
    .from('purchases')
    .select('*, courses(*)')
    .eq('user_id', user.id)

  const courses: PurchasedCourse[] = purchases?.map(p => p.courses) || []

  const stats = {
    activeCourses: courses.length,
    completedCourses: 0,
    gpa: 'N/A',
    rank: 'NOVICE_NODE'
  }

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-black border-r-4 border-black shrink-0 relative p-6">
           <div className="mb-10 text-center border-b-2 border-slate-800 pb-6">
             <div className="w-20 h-20 bg-primary mx-auto mb-4 border-2 border-white flex items-center justify-center retro-shadow">
               <span className="material-symbols-outlined text-black text-4xl">account_circle</span>
             </div>
             <h2 className="text-white font-black uppercase text-xl leading-none mb-1">
               {profile?.full_name || 'Estudiante'}
             </h2>
             <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{user.email}</p>
             <div className="mt-4 inline-block bg-slate-900 border border-slate-700 px-3 py-1">
               <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                 ID: {user.id.split('-')[0]}
               </span>
             </div>
           </div>

           <nav className="flex flex-col gap-2">
             <Link href="/dashboard" className="bg-white text-black font-black uppercase px-4 py-3 flex items-center gap-3 retro-shadow retro-btn text-sm">
               <span className="material-symbols-outlined">space_dashboard</span> Mis Módulos
             </Link>
             <Link href="/certificados" className="text-slate-400 font-bold uppercase px-4 py-3 flex items-center gap-3 hover:text-white transition-colors text-sm border-2 border-transparent hover:border-slate-800">
               <span className="material-symbols-outlined">workspace_premium</span> Certificados
             </Link>
             <Link href="/settings" className="text-slate-400 font-bold uppercase px-4 py-3 flex items-center gap-3 hover:text-white transition-colors text-sm border-2 border-transparent hover:border-slate-800">
               <span className="material-symbols-outlined">settings</span> Configuración
             </Link>
           </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 text-black">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter mb-2">
                User_<span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase text-sm border-l-2 border-primary pl-2">
                 Bienvenido al centro de operaciones.
              </p>
            </div>

            <div className="flex gap-4">
               <div className="bg-black border-2 border-white p-3 text-center min-w-[100px]">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</p>
                 <p className="text-green-500 font-black flex items-center justify-center gap-1 text-sm uppercase">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                 </p>
               </div>
               <div className="bg-black border-2 border-white p-3 text-center min-w-[100px]">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">GPA Avg</p>
                 <p className="text-white font-black text-sm uppercase">{stats.gpa}</p>
               </div>
            </div>
          </header>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter border-l-4 border-primary pl-3">
                Current_Modules
              </h3>
              <span className="bg-primary text-black font-black px-3 py-1 text-xs uppercase border-2 border-black retro-shadow">
                {stats.activeCourses} Activos
              </span>
            </div>

            {courses.length === 0 ? (
               <div className="bg-slate-800 border-4 border-slate-700 p-12 text-center text-white">
                 <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">sentiment_dissatisfied</span>
                 <h3 className="text-2xl font-black uppercase mb-2">Sin módulos activos</h3>
                 <p className="text-slate-400 font-bold mb-6">Aún no has adquirido ningún curso.</p>
                 <Link href="/cursos" className="inline-block bg-primary text-black font-black uppercase px-6 py-3 border-2 border-black retro-shadow retro-btn hover:bg-white transition-colors">
                   Explorar Catálogo →
                 </Link>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {courses.map((course: PurchasedCourse) => (
                   <div key={course.id} className="bg-white border-2 border-black retro-shadow flex flex-col overflow-hidden">
                     <div className="os-bar px-3 py-1 flex items-center justify-between">
                       <div className="flex gap-1.5">
                         <div className="size-2.5 bg-red-500 border border-black"></div>
                         <div className="size-2.5 bg-yellow-400 border border-black"></div>
                         <div className="size-2.5 bg-green-500 border border-black"></div>
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{course.slug.slice(0,12)}.exe</span>
                     </div>
                     <div className={`h-32 border-b-2 border-black flex items-center justify-center relative ${course.color || 'bg-primary'}`}>
                       {course.image_url ? (
                         <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                       ) : (
                         <span className="material-symbols-outlined text-6xl text-black opacity-20">inventory_2</span>
                       )}
                     </div>
                     <div className="p-5 flex flex-col flex-grow">
                       <h4 className="font-black text-xl uppercase leading-tight mb-4 flex-grow">{course.title}</h4>
                       
                       <div className="mb-6">
                         <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                           <span className="text-slate-500">Progreso</span>
                           <span>{course.progress?.percent_complete || 0}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-200 border-2 border-black outline outline-1 outline-offset-1 outline-transparent flex items-center p-px">
                            <div className="h-full bg-primary" style={{ width: `${course.progress?.percent_complete || 0}%` }}></div>
                         </div>
                       </div>
                       
                       <Link href={`/curso/${course.slug}/learn`} className="w-full bg-black text-white font-black uppercase py-3 border-2 border-transparent text-center text-sm hover:bg-primary hover:text-black hover:border-black transition-colors">
                         Continuar →
                       </Link>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}
