import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('posts').select('slug')
    return data?.map(c => ({ slug: c.slug })) ?? []
  } catch (e) {
    return []
  }
}

export default async function BlogDetail({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  
  try {
    const { data: post, error } = await supabase.from('posts').select('*').eq('slug', params.slug).single()
    if (error || !post) notFound()
    
    return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/blog" className="inline-block bg-white text-black font-black px-4 py-2 border-2 border-black uppercase text-sm hover:bg-slate-200 transition-colors retro-shadow">
             ← Volver al Blog
          </Link>
        </div>
        <article className="bg-white border-4 border-black retro-shadow-lg overflow-hidden">
          <div className="os-bar px-4 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="size-3 bg-red-500 border-2 border-black"></div>
              <div className="size-3 bg-yellow-400 border-2 border-black"></div>
              <div className="size-3 bg-green-400 border-2 border-black"></div>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{post.slug.slice(0,20).toUpperCase()}.md</span>
          </div>
          {post.cover_url && (
            <div className="h-64 border-b-4 border-black overflow-hidden bg-primary flex items-center justify-center">
              <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8 md:p-12 text-black">
            {post.category && (
              <span className="bg-primary text-black font-black px-3 py-1 text-xs uppercase border-2 border-black inline-block mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-500 font-bold text-sm uppercase mb-8">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div className="prose prose-lg max-w-none text-black font-medium leading-relaxed prose-headings:font-black prose-headings:uppercase">
              <p className="text-xl text-slate-600 border-l-4 border-primary pl-4 mb-6">{post.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br>') || '' }} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
  } catch (err) {
    notFound()
  }
}
