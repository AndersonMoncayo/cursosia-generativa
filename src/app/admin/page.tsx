export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminPage() {
  const [
    { count: totalCursos },
    { count: totalEnrollments },
    { data: profiles },
    { data: { users } }
  ] = await Promise.all([
    supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabaseAdmin.from('enrollments').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 })
  ])

  const totalUsuarios = users?.length || 0
  
  // Merge profiles con emails de auth.users para la tabla
  const recentUsers = profiles?.map(p => ({
    ...p,
    email: users?.find(u => u.id === p.id)?.email || ''
  })) || []

  return (
    <div>
      <h1 className="font-mono font-black tracking-tighter text-white text-2xl sm:text-3xl mb-2">RESUMEN GENERAL</h1>
      <p className="font-mono font-bold text-[#00FF41] text-xs mb-6 sm:mb-8">METRICAS PRINCIPALES DEL SISTEMA</p>
      <div className="w-full h-1 bg-[#00FF41] mb-6 sm:mb-8" />

      {/* STATS GRID — responsivo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: 'USUARIOS', value: totalUsuarios },
          { label: 'CURSOS', value: totalCursos || 0 },
          { label: 'ENROLLMENTS', value: totalEnrollments || 0 },
          { label: 'INGRESOS', value: '--' }, // TODO: Implement Paddle revenue
        ].map(stat => (
          <div key={stat.label} className="bg-white border-4 border-black p-4 sm:p-6 lg:p-8 hover:-translate-y-1 transition-transform">
            <p className="font-mono font-bold text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="font-mono font-black tracking-tighter text-3xl sm:text-4xl text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* TABLA ULTIMOS USUARIOS */}
      <div className="border-4 border-gray-700 p-4 sm:p-6 pb-2">
        <h2 className="font-mono font-black tracking-tighter text-white text-lg mb-4">ULTIMOS NODOS REGISTRADOS</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="font-mono font-black text-xs text-[#00FF41] text-left pb-2">USUARIO / EMAIL</th>
                <th className="font-mono font-black text-xs text-[#00FF41] text-left pb-2">ROL</th>
                <th className="font-mono font-black text-xs text-[#00FF41] text-left pb-2">FECHA REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr><td colSpan={3} className="font-mono font-bold text-gray-500 text-sm text-center py-4">SIN DATOS</td></tr>
              ) : recentUsers.map(u => (
                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                  <td className="py-3 px-2">
                    <p className="font-mono font-bold text-white text-sm uppercase">{u.full_name || 'SIN NOMBRE'}</p>
                    <p className="font-mono font-bold text-gray-400 text-xs lowercase">{u.email}</p>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-mono text-xs font-black px-2 py-1 border-2 ${
                      u.role === 'admin' ? 'border-red-500 text-red-500 bg-red-500/10' : 
                      u.role === 'instructor' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                      'border-gray-600 text-gray-300'
                    }`}>{u.role?.toUpperCase() || 'STUDENT'}</span>
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-gray-400 text-xs uppercase">
                    {new Date(u.created_at).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
