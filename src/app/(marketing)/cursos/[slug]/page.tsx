import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import { Clock, BarChart, CheckSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let course = null
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()
      
    if (error) throw error
    course = data
  } catch (error) {
    notFound()
  }

  if (!course) {
    notFound()
  }

  const accessUrl = user ? `/checkout/${course.id}` : '/login'

  const modules = [
    { title: 'MODULO 1: Fundamentos del Sistema', duration: '2.5 hrs' },
    { title: 'MODULO 2: Arquitectura de Referencia', duration: '3.0 hrs' },
    { title: 'MODULO 3: Implementación Práctica', duration: '4.5 hrs' },
    { title: 'MODULO 4: Casos de Uso Avanzados', duration: '3.0 hrs' },
    { title: 'MODULO 5: Seguridad y Escalabilidad', duration: '2.0 hrs' },
    { title: 'MODULO 6: Proyecto Final Real', duration: '5.0 hrs' }
  ]

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Course Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-primary text-black font-black uppercase text-xs inline-block px-3 py-1 border-2 border-black tracking-widest">
            {course.level || 'TODOS LOS NIVELES'}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-md">
            {course.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-primary font-bold">
               <Clock className="w-5 h-5" />
               <span className="uppercase">{course.duration_hours || 0} HORAS DE CONTENIDO</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
               <BarChart className="w-5 h-5" />
               <span className="uppercase">NIVEL: {course.level || 'PRINCIPIANTE'}</span>
            </div>
          </div>

          <div className="bg-black border-4 border-slate-800 p-8 text-lg font-bold text-slate-300 leading-relaxed retro-shadow">
            {course.description}
          </div>
          
          {/* Temario Placeholder */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-6 border-l-8 border-primary pl-4">
              TEMARIO DEL CURSO
            </h2>
            <div className="space-y-4">
               {modules.map((mod, index) => (
                 <div key={index} className="bg-background-dark border-4 border-slate-700 p-6 flex justify-between items-center group hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                       <span className="text-4xl font-black text-slate-700 group-hover:text-primary transition-colors">
                         {String(index + 1).padStart(2, '0')}
                       </span>
                       <span className="text-xl font-bold uppercase text-white group-hover:text-primary transition-colors">
                         {mod.title}
                       </span>
                    </div>
                    <span className="bg-black border-2 border-slate-800 text-slate-400 text-xs px-3 py-1 uppercase font-bold tracking-widest hidden md:block">
                      {mod.duration}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Checkout CTA */}
        <div className="lg:col-span-1 relative">
           <div className="sticky top-10 bg-white border-4 border-black p-8 retro-shadow-lg text-black">
              {course.image_url ? (
                 <div className="h-48 bg-slate-200 border-4 border-black mb-6 w-full flex items-center justify-center -mt-12 overflow-hidden retro-shadow relative z-10">
                   <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                 </div>
              ) : (
                 <div className="h-48 bg-primary border-4 border-black mb-6 w-full flex items-center justify-center -mt-12 retro-shadow relative z-10">
                   <span className="font-black text-4xl uppercase tracking-tighter">PREVIEW</span>
                 </div>
              )}
              
              <div className="mb-8">
                 <span className="text-sm font-black text-slate-500 uppercase tracking-widest block mb-2">
                   INVERSIÓN ÚNICA
                 </span>
                 <div className="text-6xl font-black uppercase tracking-tighter">
                   ${course.price}
                 </div>
              </div>

              <Link href={accessUrl} className="w-full bg-black text-white font-black uppercase tracking-widest py-5 border-4 border-black text-center block text-xl retro-btn hover:bg-primary hover:text-black transition-colors mb-6">
                ACCEDER AL MÓDULO
              </Link>
              
              <ul className="space-y-4 text-sm font-bold border-t-4 border-slate-200 pt-6 mt-6">
                <li className="flex items-center gap-3"><CheckSquare className="text-primary w-5 h-5"/> ACCESO DE POR VIDA AL CONTENIDO</li>
                <li className="flex items-center gap-3"><CheckSquare className="text-primary w-5 h-5"/> ACTUALIZACIONES GRATUITAS</li>
                <li className="flex items-center gap-3"><CheckSquare className="text-primary w-5 h-5"/> PROYECTOS PRÁCTICOS REALES</li>
                <li className="flex items-center gap-3"><CheckSquare className="text-primary w-5 h-5"/> SOPORTE DE LA COMUNIDAD</li>
              </ul>
           </div>
        </div>
        
      </main>

      <Footer />
    </div>
  )
}
