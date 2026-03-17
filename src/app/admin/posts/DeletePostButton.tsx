'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { deletePost } from './actions'

export function DeletePostButton({ id, title }: { id: string, title: string }) {
  const router = useRouter()
  
  const handleDelete = async () => {
    if (!confirm(`¿Eliminar ESTRICTAMENTE el post "${title}"? Esta acción es irreversible.`)) return
    
    try {
      const { error } = await deletePost(id)
      if (!error) {
        toast.success('Post eliminado del sistema')
        router.refresh()
      } else {
        toast.error(error || 'Error eliminando post')
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <button onClick={handleDelete} className="bg-black text-red-500 p-2 border-2 border-slate-600 hover:border-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Eliminar">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
