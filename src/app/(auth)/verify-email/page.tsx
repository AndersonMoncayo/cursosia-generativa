import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'

export default function EmailVerification() {
  return (
    <div className="bg-background-dark min-h-screen font-display grid-pattern flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white border-4 border-black retro-shadow-lg overflow-hidden flex flex-col">
            <div className="os-bar px-4 py-2 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="size-3 border-2 border-black bg-red-500"></div>
                <div className="size-3 border-2 border-black bg-yellow-400"></div>
                <div className="size-3 border-2 border-black bg-primary"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">EMAIL_VERIFY.MSG</span>
            </div>
            <div className="p-8 text-center text-black">
              <div className="text-7xl mb-4 text-primary material-symbols-outlined">mark_email_read</div>
              <h1 className="text-3xl font-black uppercase mb-4">¡Revisa tu Correo!</h1>
              <p className="text-slate-600 font-bold mb-6">
                Te hemos enviado un enlace de verificación. Ábrelo para activar tu cuenta.
              </p>
              <div className="bg-primary/10 border-2 border-primary p-4 mb-6">
                <p className="text-black font-bold text-sm uppercase">
                  ATENCION: Recuerda revisar tu carpeta de spam si no lo encuentras.
                </p>
              </div>
              <Link href="/login" className="block w-full bg-primary border-4 border-black py-4 font-black uppercase tracking-widest retro-shadow retro-btn text-black hover:bg-white transition-colors">
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
