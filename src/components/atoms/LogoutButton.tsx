'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export const LogoutButton: React.FC = () => {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout} 
      className="bg-black text-white font-black uppercase px-6 py-4 border-4 border-white retro-shadow hover:bg-red-500 hover:border-black transition-colors flex items-center gap-3 text-sm md:text-base w-full md:w-auto justify-center"
    >
      <span>CERRAR SESIÓN</span>
      <LogOut className="w-5 h-5" />
    </button>
  )
}
