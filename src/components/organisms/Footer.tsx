import React from 'react'
import Link from 'next/link'
import { Share2, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t-8 border-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary text-black font-black text-xl px-2 py-1 border-2 border-transparent">AI</div>
            <span className="text-white font-black text-xl tracking-tighter uppercase">Cursos<span className="text-slate-400">Generativa</span></span>
          </div>
          <p className="text-slate-400 font-bold max-w-sm mb-6 uppercase text-sm leading-relaxed">
            Democratizamos el acceso a la inteligencia artificial mediante educación práctica y estructurada.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border-2 border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:border-white transition-colors">
              <Share2 className="text-white w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 border-2 border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:border-white transition-colors">
              <Mail className="text-white w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-black text-white uppercase tracking-widest border-l-4 border-primary pl-3 mb-6">Plataforma</h4>
          <ul className="space-y-3 font-bold text-sm text-slate-400">
            <li><Link href="/cursos" className="hover:text-primary uppercase transition-colors">Catálogo Completo</Link></li>
            <li><Link href="/precios" className="hover:text-primary uppercase transition-colors">Planes y Precios</Link></li>
            <li><Link href="/blog" className="hover:text-primary uppercase transition-colors">Blog y Recursos</Link></li>
            <li><Link href="/login" className="hover:text-primary uppercase transition-colors">Acceso Estudiantes</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="font-black text-white uppercase tracking-widest border-l-4 border-primary pl-3 mb-6">Soporte</h4>
           <ul className="space-y-3 font-bold text-sm text-slate-400">
             <li><Link href="#" className="hover:text-primary uppercase transition-colors">FAQ</Link></li>
             <li><Link href="#" className="hover:text-primary uppercase transition-colors">Términos de Servicio</Link></li>
             <li><Link href="#" className="hover:text-primary uppercase transition-colors">Privacidad</Link></li>
             <li><a href="mailto:support@cursosiagenerativa.com" className="hover:text-primary uppercase transition-colors">Contacto</a></li>
           </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t font-bold border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 uppercase">
        <p>© {new Date().getFullYear()} CursosIA Generativa. All Systems Nominal.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-2">
          <span>Status:</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-primary tracking-widest">ONLINE</span>
        </p>
      </div>
    </footer>
  )
}
