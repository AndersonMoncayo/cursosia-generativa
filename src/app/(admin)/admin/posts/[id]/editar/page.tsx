'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { updatePost } from '../../actions'
import { createClient } from '@/lib/supabase/client'

export default function EditarPost() {
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    excerpt: '',
    contenido: '',
    published: false
  })

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      try {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id as string).single()
        if (error) throw error
        if (data) {
          setFormData({
            titulo: data.titulo || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            contenido: data.contenido || '',
            published: data.published || false
          })
        }
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setFetchLoading(false)
      }
    }
    fetchPost()
  }, [id, supabase])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titulo = e.target.value
    setFormData(prev => ({
      ...prev,
      titulo,
      slug: titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await updatePost(id as string, formData)
      if (res.error) throw new Error(res.error)

      toast.success('Post actualizado')
      router.push('/admin/posts')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <div className="text-white font-black uppercase p-10">Cargando Nodo...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end border-b-8 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            EDITAR POST
          </h1>
          <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
            Modificar Nodo {formData.slug.toUpperCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-black border-4 border-slate-700 retro-shadow p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Título</label>
            <input type="text" required value={formData.titulo} onChange={handleTitleChange} 
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Slug (URL)</label>
            <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} 
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Resumen (Excerpt)</label>
           <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} 
             className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors"></textarea>
        </div>

        <div>
           <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Contenido (Markdown o HTML)</label>
           <textarea required rows={10} value={formData.contenido} onChange={e => setFormData({...formData, contenido: e.target.value})} 
             className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors font-mono text-sm"></textarea>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFormData({...formData, published: !formData.published})}
              className={`w-5 h-5 border-2 border-primary flex items-center justify-center cursor-pointer transition-colors ${
                formData.published ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              {formData.published && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm font-black text-white uppercase tracking-widest">Publicar Inmediatamente</span>
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <button disabled={loading} type="submit" className="flex-1 bg-primary text-black font-black uppercase py-4 border-4 border-black retro-btn hover:bg-white transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          </button>
          <Link href="/admin/posts" className="bg-slate-800 text-white font-black uppercase py-4 px-8 border-4 border-slate-600 hover:border-white transition-colors flex items-center justify-center gap-2">
            <X className="w-5 h-5" /> CANCELAR
          </Link>
        </div>
      </form>
    </div>
  )
}
