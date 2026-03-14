import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Course, Review } from '@/types'

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('courses').select('slug')
    return data?.map(c => ({ slug: c.slug })) ?? []
  } catch (e) {
    return []
  }
}

export default async function CourseDetail({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (courseError || !course) {
    notFound()
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('course_id', course.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12 text-black">
        {/* Course Info */}
        <div className="flex-1">
          <Link href="/cursos" className="inline-block bg-white text-black font-black px-4 py-2 border-2 border-black uppercase text-sm mb-8 hover:bg-slate-200 transition-colors retro-shadow">
            ← Volver al Catálogo
          </Link>
          
          <div className="bg-white border-4 border-black p-8 md:p-12 retro-shadow-lg mb-12">
            {course.badge && (
               <span className="bg-primary text-black font-black uppercase px-3 py-1 text-xs border-2 border-black inline-block mb-6">
                 {course.badge}
               </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              {course.title}
            </h1>
            <p className="text-xl font-bold text-slate-600 mb-8 leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-4 border-t-2 border-b-2 border-slate-200 py-4 mb-8">
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">person</span>
                 <span className="font-bold uppercase text-sm">Por {course.instructor}</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-yellow-500">star</span>
                 <span className="font-bold uppercase text-sm">{reviews?.length || 0} Reseñas</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-blue-500">schedule</span>
                 <span className="font-bold uppercase text-sm">{course.duration_hours || 0} Horas</span>
               </div>
            </div>

            <div className="prose prose-lg prose-headings:font-black prose-headings:uppercase max-w-none text-black">
               <h3 className="text-2xl font-black uppercase mb-4">Acerca de este módulo</h3>
               <p className="font-medium">{course.long_description || course.description}</p>
            </div>
          </div>

          <div className="bg-white border-4 border-black retro-shadow-lg">
            <div className="border-b-4 border-black flex overflow-x-auto">
               {['Descripción', 'Reseñas'].map(t => (
                 <button key={t} className="px-6 py-4 font-black uppercase text-sm whitespace-nowrap bg-white border-r-4 border-black hover:bg-slate-100 transition-colors">
                   {t}
                 </button>
               ))}
            </div>
            <div className="p-8 md:p-12">
               <h3 className="text-2xl font-black uppercase mb-8">Reseñas del Sistema</h3>
               {reviews && reviews.length > 0 ? (
                 <div className="space-y-6">
                   {reviews.map((rev: Review) => (
                     <div key={rev.id} className="border-2 border-black p-6 bg-slate-50">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                           <span className="font-black uppercase text-sm">{rev.user_name}</span>
                           <span className="block text-[10px] font-bold text-slate-500">
                             {new Date(rev.created_at).toLocaleDateString()}
                           </span>
                         </div>
                         <div className="flex">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <span key={i} className={`material-symbols-outlined text-sm ${i < rev.rating ? 'text-yellow-500' : 'text-slate-300'}`}>star</span>
                           ))}
                         </div>
                       </div>
                       <p className="text-sm font-medium">{rev.comment}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="font-bold text-slate-500">No hay reseñas para este curso todavía.</p>
               )}
            </div>
          </div>
        </div>
        
        {/* Sticky Sidebar */}
        <div className="w-full lg:w-96 shrink-0 relative">
          <div className="sticky top-24 bg-white border-4 border-black retro-shadow-lg overflow-hidden">
             <div className="h-48 border-b-4 border-black relative bg-black flex items-center justify-center">
               {course.image_url ? (
                 <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
               ) : (
                 <span className="material-symbols-outlined text-6xl text-white opacity-20">inventory_2</span>
               )}
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                 <span className="text-white font-black text-xs uppercase tracking-widest">ID: {course.id.split('-')[0]}</span>
               </div>
             </div>
             
             <div className="p-8">
               <div className="mb-6">
                 {course.original_price && <span className="text-slate-400 line-through font-black text-lg block mb-1">${course.original_price}</span>}
                 <span className="text-5xl font-black tracking-tighter">
                   {course.price === 0 ? 'GRATIS' : `$${course.price}`}
                 </span>
               </div>
               
               <Link href={course.price === 0 ? '#' : `/checkout/${course.id}`} className="w-full bg-primary text-black font-black uppercase py-4 border-4 border-black retro-btn block text-center text-lg mb-4 hover:bg-white transition-colors">
                 {course.price === 0 ? 'Iniciar Ahora' : 'Comprar Módulo'}
               </Link>
               
               <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
                 Acceso de por vida garantizado
               </p>

               <div className="space-y-4">
                 <h4 className="font-black uppercase text-sm border-b-2 border-black pb-2">Incluye:</h4>
                 <ul className="space-y-3 font-bold text-sm">
                   <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">play_circle</span> {course.lessons_count} Módulos</li>
                   <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">closed_caption</span> Subtítulos en español</li>
                   <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">all_inclusive</span> Acceso remoto 24/7</li>
                   {course.has_certificate && <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">workspace_premium</span> Certificado on-chain</li>}
                 </ul>
               </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
