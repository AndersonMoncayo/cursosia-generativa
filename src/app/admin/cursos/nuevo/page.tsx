'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function NuevoCurso() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    level: 'beginner',
    duration_hours: 0,
    price: 0,
    thumbnail_url: '',
    image_url: '',
    instructor: '',
    is_published: false
  })
  const [file, setFile] = useState<File | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!tiposPermitidos.includes(selectedFile.type)) {
        toast.error('Solo se permiten imagenes JPG, PNG, WEBP o GIF')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalImageUrl = formData.image_url

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('course-images').upload(fileName, file)
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage.from('course-images').getPublicUrl(fileName)
        finalImageUrl = publicUrl
      }

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url: finalImageUrl,
          thumbnail_url: finalImageUrl
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear el curso')
      }

      toast.success('Curso creado exitosamente')
      router.push('/admin/cursos')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end border-b-8 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            NUEVO CURSO
          </h1>
          <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
            Crear Nodo de Aprendizaje
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-black border-4 border-slate-700 retro-shadow p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Título</label>
            <input type="text" required value={formData.title} onChange={handleTitleChange} 
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Slug (URL)</label>
            <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} 
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Descripción</label>
          <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Precio (USD)</label>
            <input type="number" step="0.01" min="0" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Duración (Horas)</label>
            <input type="number" min="0" required value={formData.duration_hours} onChange={e => setFormData({...formData, duration_hours: parseInt(e.target.value)})} 
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Nivel</label>
            <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
              className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors uppercase">
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <input type="text" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} 
               className="w-full bg-slate-900 border-2 border-slate-700 p-3 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
           </div>
           <div>
             <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Subir Imagen (Opcional)</label>
             <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleFileChange}
               className="w-full bg-slate-900 border-2 border-slate-700 p-2 text-white font-bold focus:outline-none focus:border-primary transition-colors" />
             <div className="text-xs text-slate-500 mt-2">También puedes dejar en blanco para usar diseño base.</div>
           </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFormData({...formData, is_published: !formData.is_published})}
              className={`w-5 h-5 border-2 border-primary flex items-center justify-center cursor-pointer transition-colors ${
                formData.is_published ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              {formData.is_published && (
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
            <Save className="w-5 h-5" /> {loading ? 'GUARDANDO...' : 'GUARDAR CURSO'}
          </button>
          <Link href="/admin/cursos" className="bg-slate-800 text-white font-black uppercase py-4 px-8 border-4 border-slate-600 hover:border-white transition-colors flex items-center justify-center gap-2">
            <X className="w-5 h-5" /> CANCELAR
          </Link>
        </div>
      </form>
    </div>
  )
}
