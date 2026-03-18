'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import { createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson } from '@/app/(admin)/admin/cursos/[id]/contenido/actions'

export default function CourseContentManager({ course, initialModules, initialLessons }: { course: any, initialModules: any[], initialLessons: any[] }) {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<any>(null)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [isAddingModule, setIsAddingModule] = useState(false)
  const [isAddingLessonTo, setIsAddingLessonTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Handlers para Módulos
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const data = {
      course_id: course.id,
      title: form.moduleTitle.value,
      order_index: parseInt(form.order_index.value),
      is_published: form.is_published.checked
    }
    
    try {
      if (editingModule) {
        const res = await updateModule(editingModule.id, data, course.id)
        if (!res.success) throw new Error(res.error)
        toast.success('Módulo actualizado')
      } else {
        const res = await createModule(data)
        if (!res.success) throw new Error(res.error)
        toast.success('Módulo creado')
      }
      setEditingModule(null)
      setIsAddingModule(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteModule = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este módulo?')) return
    try {
      const res = await deleteModule(id, course.id)
      if (!res.success) throw new Error(res.error)
      toast.success('Módulo eliminado (Soft Delete)')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Handlers para Lecciones
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const data = {
      module_id: editingLesson ? editingLesson.module_id : isAddingLessonTo,
      course_id: course.id,
      title: form.lessonTitle.value,
      order_index: parseInt(form.lessonOrder.value),
      duration_min: parseInt(form.duration_min.value),
      is_free: form.is_free.checked,
      is_published: form.is_published.checked
    }
    
    try {
      if (editingLesson) {
        const res = await updateLesson(editingLesson.id, data, course.id)
        if (!res.success) throw new Error(res.error)
        toast.success('Lección actualizada')
      } else {
        const res = await createLesson(data)
        if (!res.success) throw new Error(res.error)
        toast.success('Lección creada')
      }
      setEditingLesson(null)
      setIsAddingLessonTo(null)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta lección?')) return
    try {
      const res = await deleteLesson(id, course.id)
      if (!res.success) throw new Error(res.error)
      toast.success('Lección eliminada (Soft Delete)')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const openModuleForm = (mod?: any) => {
    if (mod) setEditingModule(mod)
    else setEditingModule(null)
    setIsAddingModule(true)
  }

  const openLessonForm = (moduleId: string, lesson?: any) => {
    if (lesson) setEditingLesson(lesson)
    else setEditingLesson(null)
    setIsAddingLessonTo(moduleId)
  }

  return (
    <div className="space-y-8">
      
      <div className="flex justify-end">
        <button onClick={() => openModuleForm()} className="bg-primary text-black font-black uppercase px-6 py-3 border-4 border-black retro-btn flex items-center gap-2 hover:bg-white transition-colors">
          <Plus className="w-5 h-5" /> NUEVO MÓDULO
        </button>
      </div>

      {isAddingModule && (
        <form onSubmit={handleSaveModule} className="bg-slate-900 border-4 border-primary p-6 space-y-4 retro-shadow">
          <h3 className="text-white font-black uppercase text-xl border-b-2 border-primary pb-2 mb-4">
            {editingModule ? 'EDITAR MÓDULO' : 'NUEVO MÓDULO'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-primary uppercase mb-2">Título</label>
              <input name="moduleTitle" type="text" required defaultValue={editingModule?.title || ''} className="w-full bg-black border-2 border-slate-700 p-2 text-white font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-primary uppercase mb-2">Orden</label>
              <input name="order_index" type="number" required defaultValue={editingModule?.order_index || initialModules.length + 1} className="w-full bg-black border-2 border-slate-700 p-2 text-white font-bold" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" name="is_published" defaultChecked={editingModule ? editingModule.is_published : true} className="w-4 h-4 accent-primary" />
            <span className="text-xs font-black text-white uppercase">Publicado</span>
          </div>
          <div className="flex gap-2 pt-4">
            <button disabled={loading} type="submit" className="bg-primary text-black font-black uppercase px-4 py-2 hover:bg-white transition-colors border-2 border-primary">Guardar</button>
            <button type="button" onClick={() => setIsAddingModule(false)} className="bg-slate-800 text-white font-black uppercase px-4 py-2 hover:bg-slate-700 transition-colors border-2 border-slate-600">Cancelar</button>
          </div>
        </form>
      )}

      {initialModules.length === 0 && !isAddingModule ? (
        <div className="text-center font-bold text-slate-400 p-10 uppercase tracking-widest border-4 border-dashed border-slate-700">
          Ningún módulo configurado aún.
        </div>
      ) : (
        <div className="space-y-4">
          {initialModules.map(mod => {
            const moduleLessons = initialLessons.filter(l => l.module_id === mod.id)
            const isActive = activeModule === mod.id
            return (
              <div key={mod.id} className="border-4 border-slate-700 bg-black">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => setActiveModule(isActive ? null : mod.id)}>
                  <div className="flex items-center gap-4">
                    <span className="bg-primary text-black font-black w-8 h-8 flex items-center justify-center border-2 border-black">{mod.order_index}</span>
                    <h3 className="font-black text-white uppercase">{mod.title}</h3>
                    {!mod.is_published && <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 font-bold border border-slate-600">DRAFT</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-primary font-bold uppercase">{moduleLessons.length} Lecciones</span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                       <button onClick={() => openModuleForm(mod)} className="text-white hover:text-primary transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDeleteModule(mod.id)} className="text-red-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {isActive ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-slate-500" />}
                  </div>
                </div>

                {isActive && (
                  <div className="border-t-4 border-slate-700 bg-slate-900 p-4">
                    <div className="space-y-2 mb-4">
                      {moduleLessons.map(lesson => (
                        <div key={lesson.id} className="bg-black border-2 border-slate-700 p-3 flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                            <Video className="w-4 h-4 text-primary" />
                            <span className="text-slate-400 font-bold text-xs">{lesson.order_index}.</span>
                            <span className="text-white font-bold text-sm uppercase">{lesson.title}</span>
                            <span className="text-xs text-slate-500">({lesson.duration_min} min)</span>
                            {lesson.is_free && <span className="bg-green-500 text-black text-[10px] font-black px-1 uppercase ml-2">GRATIS</span>}
                            {!lesson.is_published && <span className="bg-slate-800 text-slate-400 text-[10px] px-1 font-bold ml-2">DRAFT</span>}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openLessonForm(mod.id, lesson)} className="text-white hover:text-primary p-1"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteLesson(lesson.id)} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                      {moduleLessons.length === 0 && <div className="text-slate-500 text-xs font-bold uppercase p-2">No hay lecciones en este módulo</div>}
                    </div>

                    {(isAddingLessonTo === mod.id) ? (
                      <form onSubmit={handleSaveLesson} className="bg-black border-2 border-primary p-4 space-y-4">
                        <h4 className="text-primary font-black uppercase text-sm border-b border-primary pb-2 mb-2">
                          {editingLesson ? 'EDITAR LECCIÓN' : 'NUEVA LECCIÓN'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Título</label>
                            <input name="lessonTitle" type="text" required defaultValue={editingLesson?.title || ''} className="w-full bg-slate-900 border border-slate-700 p-2 text-white font-bold text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Orden</label>
                            <input name="lessonOrder" type="number" required defaultValue={editingLesson?.order_index || moduleLessons.length + 1} className="w-full bg-slate-900 border border-slate-700 p-2 text-white font-bold text-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Duración (Mins)</label>
                            <input name="duration_min" type="number" required defaultValue={editingLesson?.duration_min || 0} className="w-full bg-slate-900 border border-slate-700 p-2 text-white font-bold text-sm" />
                          </div>
                          <div className="flex items-end gap-4 pb-2 md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="is_free" defaultChecked={editingLesson ? editingLesson.is_free : false} className="w-4 h-4 accent-primary" />
                              <span className="text-[10px] font-black text-white uppercase">Es Gratis (Preview)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" name="is_published" defaultChecked={editingLesson ? editingLesson.is_published : true} className="w-4 h-4 accent-primary" />
                              <span className="text-[10px] font-black text-white uppercase">Publicado</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button disabled={loading} type="submit" className="bg-primary text-black font-black uppercase text-xs px-4 py-2 hover:bg-white transition-colors">Guardar Lección</button>
                          <button type="button" onClick={() => { setIsAddingLessonTo(null); setEditingLesson(null); }} className="bg-slate-800 text-white font-black uppercase text-xs px-4 py-2 hover:bg-slate-700 transition-colors">Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <button onClick={() => openLessonForm(mod.id)} className="text-primary hover:text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors">
                        <Plus className="w-4 h-4" /> Agregar Lección
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
