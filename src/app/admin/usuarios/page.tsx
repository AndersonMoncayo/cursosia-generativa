'use client'

import React, { useEffect, useState } from 'react'
import { Shield, ShieldAlert, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsuarios() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
      } else {
        toast.error(data.error || 'Error fetching users')
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const roles = ['student', 'admin', 'instructor']
    const nextRole = roles[(roles.indexOf(currentRole || 'student') + 1) % roles.length]
    
    if (!confirm(`¿Cambiar el rol a ${nextRole.toUpperCase()} para este usuario?`)) return
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nextRole })
      })
      if (res.ok) {
        toast.success(`Rol actualizado a ${nextRole}`)
        setUsers(users.map(u => u.id === userId ? { ...u, profile: { ...(u.profile || {}), role: nextRole } } : u))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error cambiando rol')
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })
      if (res.ok) {
        toast.success(`Rol actualizado a ${newRole}`)
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, profile: { ...(u.profile || {}), role: newRole } } : u
        ))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al cambiar rol')
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`¿Eliminar usuario ${email}? Esta acción no se puede deshacer.`)) return
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success(`Usuario eliminado`)
        setUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al eliminar usuario')
      }
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.profile?.role === filter)

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end border-b-8 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            GESTIÓN DE USUARIOS
          </h1>
          <p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
            Manejo de Nodos de Red
          </p>
        </div>
      </div>

      <div className="bg-black border-4 border-slate-700 retro-shadow p-8">
        
        {/* Filters */}
        <div className="flex gap-4 mb-8">
           <button onClick={() => setFilter('all')} 
             className={`px-4 py-2 font-black uppercase text-xs border-2 ${filter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-slate-600 hover:border-white'}`}>
             TODOS
           </button>
           <button onClick={() => setFilter('student')} 
             className={`px-4 py-2 font-black uppercase text-xs border-2 ${filter === 'student' ? 'bg-primary text-black border-primary' : 'bg-transparent text-slate-400 border-slate-600 hover:border-primary'}`}>
             ESTUDIANTES
           </button>
           <button onClick={() => setFilter('admin')} 
             className={`px-4 py-2 font-black uppercase text-xs border-2 ${filter === 'admin' ? 'bg-red-500 text-white border-red-500' : 'bg-transparent text-slate-400 border-slate-600 hover:border-red-500'}`}>
             ADMINS
           </button>
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="animate-pulse bg-slate-900 border-2 border-slate-800 h-16 w-full"></div>
             ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center font-bold text-slate-400 p-8 uppercase tracking-widest border-2 border-dashed border-slate-700">
            NO SE ENCONTRARON USUARIOS.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-slate-700">
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 w-1/3">Usuario / Email</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-center">Rol</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Fecha Registro</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-right">Último Login</th>
                  <th className="py-4 px-4 font-black uppercase text-xs text-primary tracking-widest bg-slate-900 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="border-b-2 border-slate-800 hover:bg-slate-900 transition-colors">
                    <td className="py-4 px-4 text-white font-bold">
                      <div className="uppercase">{u.profile?.full_name || 'SIN NOMBRE'}</div>
                      <div className="text-xs text-slate-500 lowercase">{u.email}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 text-xs font-black uppercase inline-flex items-center gap-2 border-2 ${
                        u.profile?.role === 'admin' ? 'bg-red-500 text-white border-red-500' : 
                        u.profile?.role === 'instructor' ? 'bg-yellow-500 text-black border-yellow-500' :
                        'bg-slate-800 text-slate-300 border-slate-600'
                      }`}>
                        {u.profile?.role === 'admin' && <ShieldAlert className="w-3 h-3"/>}
                        {u.profile?.role === 'instructor' && <Shield className="w-3 h-3"/>}
                        {(!u.profile?.role || u.profile?.role === 'student') && <UserIcon className="w-3 h-3 text-primary"/>}
                        {u.profile?.role || 'student'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-bold text-sm text-right uppercase">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-bold text-sm text-right uppercase">
                      {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : 'NUNCA'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                         <select
                           value={u.profile?.role || 'student'}
                           onChange={(e) => handleChangeRole(u.id, e.target.value)}
                           style={{
                             border: '2px solid black',
                             fontFamily: 'monospace',
                             fontSize: '12px',
                             padding: '4px 8px',
                             backgroundColor: 'white',
                             color: 'black',
                             cursor: 'pointer',
                             fontWeight: 'bold',
                             minWidth: '120px'
                           }}
                         >
                           <option value="student">STUDENT</option>
                           <option value="instructor">INSTRUCTOR</option>
                           <option value="admin">ADMIN</option>
                         </select>

                         <button
                           onClick={() => handleDeleteUser(u.id, u.email)}
                           className="border-2 border-black bg-red-500 text-white font-mono text-xs px-3 py-1 hover:bg-red-600 font-bold transition-colors"
                         >
                           ELIMINAR
                         </button>
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
