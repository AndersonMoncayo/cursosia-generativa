export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import EditarCursoForm from '@/components/admin/EditarCursoForm'

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: curso, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !curso) {
    return (
      <div className="p-10 font-black text-white uppercase tracking-widest text-xl">
        Curso no encontrado en la Base de Datos ({error?.message || 'NULL'})
      </div>
    )
  }

  return <EditarCursoForm curso={curso} />
}
