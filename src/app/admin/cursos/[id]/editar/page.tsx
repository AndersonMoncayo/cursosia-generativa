export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import EditarCursoForm from '@/components/admin/EditarCursoForm'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function EditarCursoPage({ params }: { params: { id: string } }) {
  const { data: curso } = await supabaseAdmin
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!curso) {
    return (
      <div className="p-10 font-black text-white uppercase tracking-widest text-xl">
        Curso no encontrado en la Base de Datos
      </div>
    )
  }

  return <EditarCursoForm curso={curso} />
}
