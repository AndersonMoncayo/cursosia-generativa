'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      router.push('/verify-email')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) toast.error(error.message)
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
                  Nuevo_Nodo
                </h2>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                  Secure Connection Required
                </p>
              </div>

              <div className="flex mb-8 border-b-2 border-black">
                <Link
                  href="/login"
                  className="flex-1 py-3 font-black uppercase text-sm border-b-4 border-transparent text-slate-400 hover:text-black text-center"
                >
                  Sign In
                </Link>
                <button
                  className="flex-1 py-3 font-black uppercase text-sm border-b-4 border-primary text-black transition-colors"
                >
                  Create
                </button>
              </div>

              <button
                onClick={handleGoogleAuth}
                type="button"
                className="w-full bg-white border-4 border-black text-black font-black py-3 px-4 flex items-center justify-center gap-3 uppercase retro-btn mb-6 hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continuar con Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-300 flex-1"></div>
                <span className="text-xs font-bold uppercase text-slate-500">OR TERMINAL LOGIN</span>
                <div className="h-px bg-slate-300 flex-1"></div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    className="w-full bg-slate-100 border-2 border-black p-3 text-black font-bold focus:outline-none focus:border-primary transition-colors focus:bg-white"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-black border-4 border-black font-black uppercase tracking-widest py-4 mt-6 retro-shadow retro-btn disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  {loading ? 'Procesando...' : 'CREAR CUENTA'}
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
