'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'RESUMEN' },
  { href: '/admin/cursos', label: 'CURSOS' },
  { href: '/admin/usuarios', label: 'USUARIOS' },
  { href: '/admin/posts', label: 'POSTS' },
  { href: '/admin/estadisticas', label: 'ESTADISTICAS' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // format: 2026.03.17 — 01:32
      const datePart = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
      const timePart = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      setCurrentTime(`${datePart} — ${timePart}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden flex flex-col p-4 border-b-4 border-green-400 bg-black relative z-40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono font-black text-green-400 text-lg tracking-tighter block">ADMIN_PANEL // cursosia-generativa</span>
            <span className="font-mono font-bold text-xs text-green-400 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              SISTEMA ACTIVO
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="font-mono text-green-400 font-bold border-2 border-green-400 px-3 py-1 text-sm bg-black hover:bg-green-400 hover:text-black transition-colors shrink-0 ml-4 relative z-50"
          >
            {menuOpen ? 'CERRAR' : 'MENU'}
          </button>
        </div>
        {currentTime && <div className="font-mono text-gray-500 text-xs mt-2 text-right">{currentTime}</div>}
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div 
           className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
           onClick={() => setMenuOpen(false)}
        >
          <div 
             className="absolute top-0 right-0 w-64 h-full bg-black border-l-4 border-green-400 flex flex-col pt-24 animate-slide-in-right"
             onClick={e => e.stopPropagation()}
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-4 font-mono font-bold text-sm border-b border-gray-800 ${
                  pathname === item.href ? 'text-black bg-green-400' : 'text-white hover:text-green-400'
                }`}
              >
                // {item.label}
              </Link>
            ))}
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 font-mono font-bold text-sm text-gray-500 hover:text-white border-b border-gray-800 mt-auto mb-8">
              // VOLVER AL DASHBOARD
            </Link>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 min-h-screen bg-black border-r-4 border-green-400 sticky top-0 left-0 h-screen">
        <div className="p-4 border-b-4 border-green-400 mb-6">
          <p className="font-mono font-black tracking-tighter text-green-400 text-base leading-tight">ADMIN_PANEL //<br/>cursosia-generativa</p>
          <p className="font-mono font-bold text-[#00ff00] text-xs flex items-center gap-2 mt-3">
             <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse"></span>
             SISTEMA ACTIVO
          </p>
          {currentTime && <p className="font-mono text-gray-500 text-xs mt-3">{currentTime}</p>}
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`block px-6 py-3 font-mono font-bold text-sm border-l-4 transition-all ${
                pathname === item.href
                  ? 'border-green-400 text-green-400 bg-gray-900'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-800'
              }`}>
              // {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t-4 border-green-400 mt-auto">
          <Link href="/dashboard" className="font-mono font-bold text-xs text-gray-500 hover:text-white">
            // VOLVER AL DASHBOARD
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] p-4 sm:p-8 min-h-screen bg-black text-white relative">
        {children}
      </main>
    </div>
  )
}
