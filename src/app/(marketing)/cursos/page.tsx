import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import type { Course } from '@/types'

export const dynamic = 'force-dynamic'

const LEVELS = ['Todos', 'beginner', 'intermediate', 'advanced']
const PAGE_SIZE = 8

export default async function Catalog({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  
  // Extraer params
  const pPage = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const currentPage = isNaN(pPage) || pPage < 1 ? 1 : pPage
  
  // fetch
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
  
  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border-4 border-black p-6 retro-shadow text-black sticky top-24">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-2">
              Filtros_Sys
            </h2>
            
            <div className="mb-8 hidden">
               {/* Search placeholder */}
            </div>

            <div className="mb-8">
              <h3 className="font-bold uppercase tracking-widest text-sm text-slate-500 mb-4">Nivel</h3>
              <div className="space-y-3">
                {LEVELS.map(l => (
                  <label key={l} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border-2 border-black flex flex-shrink-0 items-center justify-center transition-colors ${l === 'Todos' ? 'bg-primary' : 'bg-white group-hover:bg-slate-200'}`}>
                      {l === 'Todos' && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </div>
                    <span className="font-bold text-sm uppercase">{l === 'Todos' ? l : `Level ${l}`}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-black text-white font-black uppercase py-3 border-2 border-transparent hover:bg-primary hover:text-black hover:border-black transition-colors">
              Reset Filtros
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-10 border-b-4 border-slate-800 pb-6">
            <div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none drop-shadow-md text-white">
                 Catálogo
               </h1>
               <p className="text-primary font-bold uppercase mt-2 tracking-widest">
                 {courses?.length || 0} módulos encontrados
               </p>
            </div>
          </div>

          {!courses || courses.length === 0 ? (
            <div className="bg-slate-800 border-4 border-slate-700 p-12 text-center retro-shadow">
               <span className="material-symbols-outlined text-yellow-500 text-6xl mb-4">warning</span>
               <h3 className="text-white font-black text-2xl uppercase mb-2">No se encontraron cursos</h3>
               <p className="text-slate-400 font-bold">Ajusta tus filtros de búsqueda.</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {courses.map((course: Course) => (
                 <div key={course.id} className={`${course.color || 'bg-white'} border-4 border-black retro-shadow-lg flex flex-col group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden`}>
                   <div className="os-bar px-4 py-2 flex items-center justify-between">
                     <div className="flex gap-2">
                       <div className="w-3 h-3 bg-red-500 border-2 border-black"></div>
                       <div className="w-3 h-3 bg-yellow-400 border-2 border-black"></div>
                       <div className="w-3 h-3 bg-green-500 border-2 border-black"></div>
                     </div>
                     <span className="text-xs font-bold text-white uppercase tracking-widest">{course.slug.slice(0,10)}.exe</span>
                   </div>
                   
                   <div className="p-8 flex flex-col flex-grow relative z-10">
                     {course.badge && (
                        <div className="absolute top-4 right-4 bg-black text-white text-xs font-black uppercase px-3 py-1 border-2 border-white transform rotate-3">
                          {course.badge}
                        </div>
                     )}
                     <div className="mb-4">
                       <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest border border-white/20">
                         Nivel: {course.level || 'Todos'}
                       </span>
                     </div>
                     <h3 className="text-3xl font-black text-black uppercase leading-none mb-4 tracking-tight group-hover:underline decoration-4">
                       {course.title}
                     </h3>
                     <p className="text-black/80 font-bold text-sm mb-8 flex-grow line-clamp-3">
                       {course.description}
                     </p>
                     
                     <div className="flex items-center justify-between mt-auto pt-6 border-t-4 border-black/10">
                       <div className="flex flex-col">
                         {course.original_price && <span className="text-black/50 line-through text-left font-black text-sm">${course.original_price}</span>}
                         <span className="text-black font-black text-3xl">
                           {course.price === 0 ? 'GRATIS' : `$${course.price}`}
                         </span>
                       </div>
                       <Link href={`/curso/${course.slug}`} className="bg-black text-white font-black px-6 py-3 uppercase border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
                         Ver Módulo
                       </Link>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
