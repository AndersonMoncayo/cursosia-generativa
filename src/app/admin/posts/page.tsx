export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Plus, Edit2 } from 'lucide-react'
import { DeletePostButton } from './DeletePostButton'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminPosts() {
  const { data: posts, error } = await supabaseAdmin
    .from('posts')
    .select('id, titulo, slug, published, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-8 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            GESTIÓN DE POSTS
          </h1>
          <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
            Publicaciones del Blog
          </p>
        </div>
        <Link href="/admin/posts/nuevo" className="bg-primary text-black font-black uppercase px-6 py-3 border-4 border-black retro-btn flex items-center gap-2 hover:bg-white transition-colors">
           <Plus className="w-5 h-5" /> NUEVO POST
        </Link>
      </div>

      <div className="bg-black border-4 border-slate-700 retro-shadow p-8">
        {!posts || posts.length === 0 ? (
          <div className="text-center font-bold text-slate-400 p-8 uppercase tracking-widest border-2 border-dashed border-slate-700">
            NO HAY POSTS CREADOS. INICIA EL PRIMER NODO.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-slate-700">
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 w-1/3">Título</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900">Slug</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-center">Estado</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Fecha Creación</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p: any) => (
                  <tr key={p.id} className="border-b-2 border-slate-800 hover:bg-slate-900 transition-colors">
                    <td className="py-4 px-4 text-white font-bold uppercase">{p.titulo}</td>
                    <td className="py-4 px-4 text-slate-400 font-bold uppercase text-xs lowercase">{p.slug}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 text-xs font-black uppercase border-2 inline-block w-24 text-center ${
                        p.published ? 'bg-primary text-black border-primary' : 'bg-slate-800 text-slate-300 border-slate-600'
                      }`}>
                        {p.published ? 'PUBLICADO' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-bold text-sm text-right uppercase">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                         <Link href={`/admin/posts/${p.id}/editar`} className="bg-black text-white p-2 border-2 border-slate-600 hover:border-white hover:text-black hover:bg-white transition-colors" title="Editar">
                           <Edit2 className="w-4 h-4" />
                         </Link>
                         <DeletePostButton id={p.id} title={p.titulo} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
