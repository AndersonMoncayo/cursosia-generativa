'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
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
                <Link href="/dashboard" className="text-slate-300 font-bold uppercase hover:text-primary transition-colors text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="bg-black text-white font-black px-6 py-2 uppercase border-2 border-white retro-shadow retro-btn text-sm hover:bg-red-500 hover:border-black transition-colors">
                  Cerrar Sesión
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
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
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
                 <Link href="/dashboard" className="bg-primary text-black font-black px-4 py-3 uppercase border-2 border-black text-center retro-shadow">
                   Dashboard
                 </Link>
                 <button onClick={handleLogout} className="bg-black text-white font-black px-4 py-3 uppercase border-2 border-white text-center mt-2 hover:bg-red-500 hover:border-black transition-colors">
                   Cerrar Sesión
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
