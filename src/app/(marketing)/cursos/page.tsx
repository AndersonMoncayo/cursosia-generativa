import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import type { Course } from '@/types'
import { CourseCard } from '@/components/molecules/CourseCard'
import { CourseFilters } from '@/components/molecules/CourseFilters'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catalogo de Cursos IA | CursosIA Generativa',
  description: 'Explora todos los cursos de Inteligencia Artificial. Filtra por nivel: principiante, intermedio y avanzado. Pago unico, acceso de por vida.',
  alternates: { canonical: 'https://cursosia-generativa.vercel.app/cursos' },
}

export const dynamic = 'force-dynamic'

const niveles = [
  { value: 'todos', label: 'TODOS' },
  { value: 'beginner', label: 'LEVEL BEGINNER' },
  { value: 'intermediate', label: 'LEVEL INTERMEDIATE' },
  { value: 'advanced', label: 'LEVEL ADVANCED' },
]
const PAGE_SIZE = 8

export const revalidate = 600

export default async function Catalog({ params, searchParams }: { params: Promise<{}>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams
  const supabase = await createClient()
  
  // Extraer params
  const level = typeof resolvedParams.level === 'string' ? resolvedParams.level : null
  const query = supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .is('deleted_at', null)

  if (level && level !== 'todos') {
    query.eq('level', level)
  }

  const { data: courses } = await query.order('created_at', { ascending: false })

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
              <CourseFilters currentLevel={level} />
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
                 <CourseCard key={course.id} course={course} />
               ))}
             </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
