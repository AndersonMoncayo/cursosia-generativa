'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      toast.error('Solo se aceptan cuentas Gmail (@gmail.com)')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    alert('PROXIMO. El acceso con Google estara disponible pronto.')
  }

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border-4 border-black retro-shadow-lg flex flex-col">
            <div className="os-bar px-4 py-2 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="size-3 bg-red-500 border-2 border-black"></div>
                <div className="size-3 bg-yellow-400 border-2 border-black"></div>
                <div className="size-3 bg-primary border-2 border-black"></div>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">AUTH_SYSTEM.exe</span>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">
                  Acceso_Root
                </h2>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                  Secure Connection Required
                </p>
              </div>

              <div className="flex mb-8 border-b-2 border-black">
                <button
                  className="flex-1 py-3 font-black uppercase text-sm border-b-4 border-primary text-black transition-colors"
                >
                  Sign In
                </button>
                <Link
                  href="/register"
                  className="flex-1 py-3 font-black uppercase text-sm border-b-4 border-transparent text-slate-400 hover:text-black text-center"
                >
                  Create
                </Link>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 border-4 border-black bg-white text-black font-mono font-bold py-3 px-6 opacity-60 cursor-not-allowed mb-6"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                CONTINUAR CON GOOGLE — PROXIMO
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-300 flex-1"></div>
                <span className="text-xs font-bold uppercase text-slate-500">OR TERMINAL LOGIN</span>
                <div className="h-px bg-slate-300 flex-1"></div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                {/* Only Login Fields */}
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full bg-slate-100 border-2 border-black p-3 text-black font-bold focus:outline-none focus:border-primary transition-colors focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-100 border-2 border-black p-3 text-black font-bold focus:outline-none focus:border-primary transition-colors focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                  <div className="text-right">
                    <Link href="/forgot-password" className="text-xs font-bold text-slate-500 uppercase hover:text-primary transition-colors">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-black border-4 border-black font-black uppercase tracking-widest py-4 mt-6 retro-shadow retro-btn disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  {loading ? 'Procesando...' : 'Ejecutar Auth'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
