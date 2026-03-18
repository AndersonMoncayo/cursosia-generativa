'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const panelHref =
    role === 'admin' || role === 'superadmin'
      ? '/admin'
      : role === 'instructor'
      ? '/teach'
      : '/courses'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    const fetchUserRole = async (userObj: User | null) => {
      setUser(userObj)
      if (userObj) {
        const { data } = await supabase.from('profiles').select('role').eq('id', userObj.id).single()
        setRole(data?.role || null)
      } else {
        setRole(null)
      }
    }

    supabase.auth.getUser().then(({ data }) => fetchUserRole(data.user || null))
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      fetchUserRole(session?.user || null)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-background-dark border-b-4 border-black relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary text-black font-black text-2xl px-2 py-1 border-2 border-black group-hover:bg-white transition-colors retro-shadow">
                AI
              </div>
              <span className="text-white font-black text-xl tracking-tighter uppercase group-hover:text-primary transition-colors">
                Cursos<span className="text-slate-400">Generativa</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cursos" className="text-slate-300 font-bold uppercase hover:text-primary transition-colors text-sm">Catálogo</Link>
            <Link href="/blog" className="text-slate-300 font-bold uppercase hover:text-primary transition-colors text-sm">Blog</Link>
            <Link href="/precios" className="text-slate-300 font-bold uppercase hover:text-primary transition-colors text-sm">Precios</Link>
            
            <div className="w-px h-6 bg-slate-700 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 border-2 border-slate-800 px-3 py-1 uppercase">{user.email}</span>
                {role === 'admin' && (
                  <Link href="/admin" className="text-primary font-black uppercase hover:text-white transition-colors text-sm underline decoration-primary decoration-2 underline-offset-4 mr-2">
                    ADMIN
                  </Link>
                )}
                <Link href={panelHref} className="bg-primary text-black font-black px-6 py-2 uppercase border-2 border-black retro-shadow retro-btn text-sm hover:bg-white transition-colors">PANEL</Link>
                <button onClick={handleLogout} className="bg-black text-white font-black px-6 py-2 uppercase border-2 border-white retro-shadow retro-btn text-sm hover:bg-red-500 hover:border-black transition-colors">
                  SALIR
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-black font-black px-6 py-2 uppercase border-2 border-black retro-shadow retro-btn text-sm">
                Iniciar Sesión
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 border-2 border-black hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-dark border-b-4 border-black absolute w-full left-0 z-40">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link href="/cursos" className="text-white font-bold uppercase block py-3 border-b-2 border-slate-800">Catálogo</Link>
            <Link href="/blog" className="text-white font-bold uppercase block py-3 border-b-2 border-slate-800">Blog</Link>
            <Link href="/precios" className="text-white font-bold uppercase block py-3 border-b-2 border-slate-800">Precios</Link>
            {user ? (
              <div className="flex flex-col gap-2 mt-4">
                 <span className="text-xs font-bold text-slate-400 text-center uppercase">{user.email}</span>
                 {role === 'admin' && (
                   <Link href="/admin" className="text-primary font-black uppercase text-center block py-2 mb-2 border-b-2 border-slate-800">
                     ADMIN
                   </Link>
                 )}
                 <Link href={panelHref} className="bg-primary text-black font-black px-4 py-3 uppercase border-2 border-black text-center retro-shadow">
                   PANEL
                 </Link>
                 <button onClick={handleLogout} className="bg-black text-white font-black px-4 py-3 uppercase border-2 border-white text-center mt-2 hover:bg-red-500 hover:border-black transition-colors">
                   SALIR
                 </button>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-black font-black px-4 py-3 uppercase border-2 border-black text-center mt-4 retro-shadow">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
