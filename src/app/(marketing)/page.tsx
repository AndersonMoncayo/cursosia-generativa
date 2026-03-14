import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import type { Course } from '@/types'

export const revalidate = 3600 // ISR revalidate every hour

export default async function Home() {
  const supabase = await createClient()
  
  let courses = []
  try {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .limit(4)
    if (data) courses = data
  } catch (e) {}

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="absolute top-10 left-10 md:left-20 text-xs font-black text-primary opacity-50 uppercase tracking-widest border-l-2 border-primary pl-2 hidden md:block">
          SYS.INIT // 2024<br/>
          MOD: LEARNING
        </div>
        <div className="absolute bottom-10 right-10 md:right-20 text-xs font-black text-primary opacity-50 uppercase tracking-widest border-r-2 border-primary pr-2 text-right hidden md:block">
          AI_POWERED<br/>
          HUMAN_DRIVEN
        </div>

        <div className="inline-block bg-primary text-black font-black px-4 py-1 text-sm md:text-base border-2 border-black mb-8 uppercase tracking-widest retro-shadow transform -rotate-2">
          ¡Aprende a construir el futuro!
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-8 drop-shadow-md">
          Domina La <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 border-b-8 border-primary md:inline-block">IA Generativa</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 font-bold max-w-2xl mb-12 uppercase leading-relaxed">
          Cursos estructurados, 100% prácticos y directos al grano. Aprende ChatGPT, n8n, Claude y automatizaciones reales.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link href="/cursos" className="bg-primary text-black font-black px-10 py-5 text-xl uppercase border-4 border-black retro-shadow-lg retro-btn flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-white transition-colors">
            Explorar Cursos <span className="material-symbols-outlined">rocket_launch</span>
          </Link>
          <Link href="/precios" className="bg-white text-black font-black px-10 py-5 text-xl uppercase border-4 border-black retro-shadow-lg retro-btn flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-primary transition-colors">
            Ver Planes <span className="material-symbols-outlined">payments</span>
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-slate-100 border-y-8 border-black py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none mb-4">
                Cursos_<span className="text-primary">Destacados</span>
              </h2>
              <p className="text-slate-600 font-bold uppercase text-sm border-l-4 border-black pl-3">
                Los módulos más solicitados por el mercado actual.
              </p>
            </div>
            <Link href="/cursos" className="font-black text-black uppercase border-b-4 border-primary hover:text-primary transition-colors text-lg">
              Ver Todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {courses?.map((course: Course) => (
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
