export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { DeleteCourseButton } from './DeleteCourseButton'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminCursos() {
  const { data: courses, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-8 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            GESTIÓN DE CURSOS
          </h1>
          <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
            Control maestro de módulos
          </p>
        </div>
        <Link href="/admin/cursos/nuevo" className="bg-primary text-black font-black uppercase px-6 py-3 border-4 border-black retro-btn flex items-center gap-2 hover:bg-white transition-colors">
           <Plus className="w-5 h-5" /> NUEVO CURSO
        </Link>
      </div>

      <div className="bg-black border-4 border-slate-700 retro-shadow p-8">
        {!courses || courses.length === 0 ? (
          <div className="text-center font-bold text-slate-400 p-8 uppercase tracking-widest border-2 border-dashed border-slate-700">
            NO HAY CURSOS CREADOS. INICIA EL PRIMER NODO.
          </div>
        ) : (
          <>
          {/* MOBILE CARDS */}
          <div className="md:hidden flex flex-col gap-4">
            {courses.map((c: any) => (
              <div key={c.id} className="border-2 border-slate-700 p-4 bg-slate-900 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-black text-white uppercase text-sm">{c.title}</h3>
                  <span className={`px-2 py-1 text-[10px] font-black uppercase border-2 text-center shrink-0 ${
                    c.is_published ? 'bg-primary text-black border-primary' : 'bg-slate-800 text-slate-300 border-slate-600'
                  }`}>
                    {c.is_published ? 'PUB' : 'DRAFT'}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase mb-1">Nivel: {c.level || 'N/A'}</p>
                  <p className="text-primary font-black text-sm uppercase">Precio: ${c.price ? Number(c.price).toFixed(2) : 'FREE'}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link href={`/admin/cursos/${c.id}/editar`} className="flex-1 bg-black text-white p-2 border-2 border-slate-600 hover:border-white hover:text-black hover:bg-white transition-colors text-center font-bold text-xs uppercase" title="Editar">
                    EDITAR
                  </Link>
                  <DeleteCourseButton id={c.id} title={c.title} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-4 border-slate-700">
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 w-1/3">Título</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900">Nivel</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Precio</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-center">Estado</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Fecha Creación</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any) => (
                  <tr key={c.id} className="border-b-2 border-slate-800 hover:bg-slate-900 transition-colors">
                    <td className="py-4 px-4 text-white font-bold uppercase">{c.title}</td>
                    <td className="py-4 px-4 text-slate-400 font-bold uppercase text-xs">{c.level || 'N/A'}</td>
                    <td className="py-4 px-4 text-primary font-black text-right">${c.price ? Number(c.price).toFixed(2) : 'FREE'}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 text-xs font-black uppercase border-2 inline-block w-24 text-center ${
                        c.is_published ? 'bg-primary text-black border-primary' : 'bg-slate-800 text-slate-300 border-slate-600'
                      }`}>
                        {c.is_published ? 'PUBLICADO' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-bold text-sm text-right uppercase">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                         <Link href={`/admin/cursos/${c.id}/editar`} className="bg-black text-white p-2 border-2 border-slate-600 hover:border-white hover:text-black hover:bg-white transition-colors" title="Editar">
                           <Edit2 className="w-4 h-4" />
                         </Link>
                         <DeleteCourseButton id={c.id} title={c.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
