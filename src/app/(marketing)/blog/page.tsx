import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import type { Post } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog IA Generativa | CursosIA Generativa',
  description: 'Recursos, tutoriales y noticias sobre IA Generativa. ChatGPT, Claude, N8N, automatizaciones y casos de uso reales.',
  alternates: { canonical: 'https://cursosia-generativa.vercel.app/blog' },
}

export const revalidate = 3600 // ISR

export default async function Blog() {
  const supabase = await createClient()
  
  let posts = []
  try {
    const { data } = await supabase.from('posts').select('*').eq('is_published', true).order('created_at', { ascending: false })
    if (data) posts = data
  } catch (e) {}

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <span className="bg-primary text-black px-4 py-1 font-black uppercase text-sm border-2 border-black mb-4 inline-block">BLOG_FEED.RSS</span>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-6">
            Blog &<br /><span className="text-primary">Recursos</span>
          </h1>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="bg-slate-800 border-4 border-slate-700 p-12 text-center text-white retro-shadow">
             <h3 className="text-2xl font-black uppercase mb-2">No hay artículos publicados</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post: Post, i: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <div className="bg-white border-4 border-black retro-shadow-lg flex flex-col h-full hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
                  <div className="os-bar px-3 py-1 flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 bg-red-500 border-2 border-black"></div>
                      <div className="w-2.5 h-2.5 bg-yellow-500 border-2 border-black"></div>
                      <div className="w-2.5 h-2.5 bg-green-500 border-2 border-black"></div>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">POST_{String(i+1).padStart(3,'0')}.md</span>
                  </div>
                  <div className="h-48 bg-primary border-b-4 border-black relative overflow-hidden flex items-center justify-center">
                    {post.cover_url ? (
                      <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-5xl text-black opacity-50">article</span>
                    )}
                    {post.category && (
                      <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-[10px] font-black uppercase border-2 border-white">
                        {post.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow text-black">
                    <span className="text-[10px] font-black text-slate-500 uppercase mb-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <h2 className="text-black text-2xl font-black mb-3 uppercase leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm font-bold flex-grow line-clamp-3">{post.excerpt}</p>
                    <span className="mt-6 text-primary border-b-2 border-primary font-black w-max uppercase hover:text-black hover:border-black transition-colors">Leer Artículo →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
