import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import type { Course } from '@/types'
import { CourseCard } from '@/components/molecules/CourseCard'
import { Rocket, CreditCard } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CursosIA Generativa | Aprende IA Generativa desde Cero',
  description: 'Cursos practicos de IA Generativa en espanol. Aprende ChatGPT, Claude, N8N y automatizaciones reales. Desde cero hasta produccion.',
  openGraph: {
    title: 'CursosIA Generativa — Domina la IA',
    description: 'Cursos estructurados 100% practicos. Aprende ChatGPT, N8N, Claude.',
    url: 'https://cursosia-generativa.vercel.app',
    siteName: 'CursosIA Generativa',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://cursosia-generativa.vercel.app' },
}

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
            Explorar Cursos <Rocket className="w-6 h-6" />
          </Link>
          <Link href="/precios" className="bg-white text-black font-black px-10 py-5 text-xl uppercase border-4 border-black retro-shadow-lg retro-btn flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-primary transition-colors">
            Ver Planes <CreditCard className="w-6 h-6" />
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
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
