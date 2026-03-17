'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateModuleInline, toggleModulePublishInline, createLessonInline, updateLessonInline, deleteLessonInline } from './actions'
import { toast } from 'react-hot-toast'

export function CourseContentClient({ 
  courseId, 
  dbModules, 
  isAdmin 
}: { 
  courseId: string, 
  dbModules: any[], 
  isAdmin: boolean 
}) {
  const router = useRouter()
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [moduleTitleEdit, setModuleTitleEdit] = useState('')
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  
  // Drawer state for lesson
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [lessonFormData, setLessonFormData] = useState<any>({})

  const formatDuration = (lessons: any[]) => {
    const valid = lessons ? lessons.filter((l: any) => l.is_published && l.deleted_at === null) : []
    const totalMins = valid.reduce((acc: number, l: any) => acc + (l.duration_min || 0), 0)
    return totalMins > 0 ? `${(totalMins / 60).toFixed(1)} hrs` : '0 hrs'
  }

  const handleModuleTitleKeyDown = async (e: React.KeyboardEvent, moduleId: string) => {
    if (e.key === 'Enter') {
      const res = await updateModuleInline(moduleId, { title: moduleTitleEdit })
      if (res.success) {
        setEditingModuleId(null)
        router.refresh()
        toast.success('Módulo actualizado')
      } else {
        toast.error('Error al actualizar')
      }
    } else if (e.key === 'Escape') {
      setEditingModuleId(null)
    }
  }

  const handleSaveModuleTitle = async (moduleId: string) => {
     const res = await updateModuleInline(moduleId, { title: moduleTitleEdit })
     if (res.success) {
       setEditingModuleId(null)
       router.refresh()
       toast.success('Módulo actualizado')
     } else {
       toast.error('Error al actualizar')
     }
  }

  const handleToggleModulePublish = async (moduleId: string, currentVal: boolean) => {
    const res = await toggleModulePublishInline(moduleId, !currentVal)
    if (res.success) {
      router.refresh()
      toast.success(currentVal ? 'Módulo oculto' : 'Módulo publicado')
    }
  }

  const handleAddLesson = async (moduleId: string) => {
    const res = await createLessonInline(courseId, moduleId)
    if (res.success) {
      router.refresh()
      toast.success('Lección creada')
      setExpandedModules(prev => ({ ...prev, [moduleId]: true }))
    }
  }

  const openLessonDrawer = (lesson: any) => {
    setEditingLesson(lesson)
    setLessonFormData({
      title: lesson.title || '',
      video_url: lesson.video_url || '',
      duration_min: lesson.duration_min || 0,
      is_free: lesson.is_free || false,
      is_published: lesson.is_published || false
    })
  }

  const handleSaveLesson = async () => {
    const res = await updateLessonInline(editingLesson.id, lessonFormData)
    if (res.success) {
      setEditingLesson(null)
      router.refresh()
      toast.success('Lección guardada')
    } else {
      toast.error('Error al guardar')
    }
  }

  const handleDeleteLesson = async () => {
    if (confirm('¿Eliminar esta lección?')) {
      const res = await deleteLessonInline(editingLesson.id)
      if (res.success) {
        setEditingLesson(null)
        router.refresh()
        toast.success('Lección eliminada')
      }
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-6 border-l-8 border-primary pl-4">
        TEMARIO DEL CURSO
      </h2>
      <div className="space-y-4">
        {dbModules.map((mod, index) => {
          const isExpanded = expandedModules[mod.id]
          const durationStr = formatDuration(mod.lessons)
          
          return (
            <div key={mod.id} className="flex flex-col gap-2">
              <div 
                className={`bg-background-dark border-4 border-slate-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-primary transition-colors cursor-pointer ${!mod.is_published ? 'opacity-50' : ''}`}
                onClick={() => {
                  if (isAdmin) {
                    setExpandedModules(prev => ({ ...prev, [mod.id]: !prev[mod.id] }))
                  }
                }}
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="text-4xl font-black text-slate-700 group-hover:text-primary transition-colors shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {editingModuleId === mod.id ? (
                    <input 
                      type="text"
                      className="bg-black text-[#00ff00] border-2 border-white px-2 py-1 font-mono text-xl w-full"
                      value={moduleTitleEdit}
                      onChange={(e) => setModuleTitleEdit(e.target.value)}
                      onKeyDown={(e) => handleModuleTitleKeyDown(e, mod.id)}
                      onBlur={() => handleSaveModuleTitle(mod.id)}
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xl font-bold uppercase text-white group-hover:text-primary transition-colors">
                      {mod.title} {isAdmin && !mod.is_published && '(OCULTO)'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  {isAdmin && (
                    <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => {
                          setModuleTitleEdit(mod.title)
                          setEditingModuleId(mod.id)
                        }}
                        className="bg-black border-2 border-white text-[#00ff00] px-3 py-1 text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        ✏️ Editar título
                      </button>
                      <button 
                        onClick={() => handleToggleModulePublish(mod.id, mod.is_published)}
                        className="bg-black border-2 border-white text-[#00ff00] px-3 py-1 text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        👁 {mod.is_published ? 'Ocultar' : 'Publicar'}
                      </button>
                      <button 
                        onClick={() => handleAddLesson(mod.id)}
                        className="bg-black border-2 border-white text-[#00ff00] px-3 py-1 text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        + Añadir lección
                      </button>
                    </div>
                  )}
                  <span className="bg-black border-2 border-slate-800 text-slate-400 text-xs px-3 py-1 uppercase font-bold tracking-widest hidden md:block shrink-0">
                    {durationStr}
                  </span>
                </div>
              </div>

              {/* Lessons list for admin toggle */}
              {isAdmin && isExpanded && mod.lessons && (
                <div className="pl-12 space-y-2 mt-2">
                  {mod.lessons.filter((l: any) => l.deleted_at === null).map((lesson: any, lIdx: number) => (
                    <div key={lesson.id} className="bg-black border-2 border-slate-700 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono text-sm">{lIdx + 1}.</span>
                        <span className="text-slate-300 font-bold">{lesson.title}</span>
                        {!lesson.is_published && <span className="text-red-500 text-xs font-bold border border-red-500 px-1">OCULTO</span>}
                        {lesson.is_free && <span className="text-[#00ff00] text-xs font-bold border border-[#00ff00] px-1">GRATIS</span>}
                      </div>
                      <button 
                        onClick={() => openLessonDrawer(lesson)}
                        className="bg-black border-2 border-white text-[#00ff00] px-3 py-1 text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        ✏️ Editar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Drawer */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-[400px] h-full bg-black border-l-4 border-white p-6 overflow-y-auto">
            <h3 className="text-[#00ff00] font-mono text-xl font-black mb-6">// EDITAR LECCIÓN</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white font-mono text-xs uppercase block mb-1">Título</label>
                <input 
                  type="text"
                  value={lessonFormData.title}
                  onChange={e => setLessonFormData({...lessonFormData, title: e.target.value})}
                  className="w-full bg-black border-2 border-white text-white p-2 font-mono"
                />
              </div>
              
              <div>
                <label className="text-white font-mono text-xs uppercase block mb-1">URL Video</label>
                <input 
                  type="text"
                  value={lessonFormData.video_url}
                  onChange={e => setLessonFormData({...lessonFormData, video_url: e.target.value})}
                  className="w-full bg-black border-2 border-white text-white p-2 font-mono"
                />
              </div>

              <div>
                <label className="text-white font-mono text-xs uppercase block mb-1">Duración (minutos)</label>
                <input 
                  type="number"
                  value={lessonFormData.duration_min}
                  onChange={e => setLessonFormData({...lessonFormData, duration_min: parseInt(e.target.value) || 0})}
                  className="w-full bg-black border-2 border-white text-white p-2 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={lessonFormData.is_free}
                  onChange={e => setLessonFormData({...lessonFormData, is_free: e.target.checked})}
                />
                <label className="text-white font-mono text-sm uppercase">Es Gratis (Preview)</label>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={lessonFormData.is_published}
                  onChange={e => setLessonFormData({...lessonFormData, is_published: e.target.checked})}
                />
                <label className="text-white font-mono text-sm uppercase">Visible (Publicado)</label>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={handleSaveLesson}
                className="w-full bg-[#00ff00] text-black font-black uppercase py-3 border-2 border-[#00ff00] hover:bg-transparent hover:text-[#00ff00] transition-colors font-mono tracking-widest"
              >
                GUARDAR
              </button>
              <button 
                onClick={handleDeleteLesson}
                className="w-full bg-black text-red-500 font-black uppercase py-3 border-2 border-red-500 hover:bg-red-500 hover:text-black transition-colors font-mono tracking-widest"
              >
                ELIMINAR LECCIÓN
              </button>
              <button 
                onClick={() => setEditingLesson(null)}
                className="w-full bg-transparent text-white font-black uppercase py-3 border-2 border-white hover:bg-white hover:text-black transition-colors font-mono tracking-widest mt-4"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
