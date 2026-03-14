import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'

export default function NotFound() {
  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="inline-block bg-white border-4 border-black retro-shadow-lg p-12 mb-12 transform -rotate-2">
            <div className="text-[8rem] md:text-[12rem] font-black text-black leading-none tracking-tighter">
              4<span className="text-primary">0</span>4
            </div>
            <div className="border-b-4 border-black my-4"></div>
            <p className="text-black font-black uppercase text-2xl tracking-tighter">ERROR: PAGE_NOT_FOUND</p>
            <p className="text-slate-500 font-bold mt-2 uppercase text-sm">El recurso solicitado no existe en el sistema</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="bg-primary text-black font-black px-8 py-4 border-4 border-black retro-shadow retro-btn uppercase text-lg hover:bg-white transition-colors">
              ← Volver al Origen
            </Link>
            <Link href="/cursos" className="bg-white text-black font-black px-8 py-4 border-4 border-black retro-shadow retro-btn uppercase text-lg hover:bg-primary transition-colors">
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
