'use client'
import { useState } from 'react'
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

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b-4 border-green-400 bg-black">
        <span className="font-mono font-black text-green-400 text-lg tracking-tighter">ADMIN_PANEL</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="font-mono text-green-400 font-bold border-2 border-green-400 px-3 py-1 text-sm bg-black hover:bg-green-400 hover:text-black transition-colors"
        >
          {menuOpen ? 'CERRAR' : 'MENU'}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="lg:hidden bg-black border-b-4 border-green-400">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 font-mono font-bold text-sm border-b border-gray-800 ${
                pathname === item.href ? 'text-black bg-green-400' : 'text-white hover:text-green-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 font-mono font-bold text-sm text-gray-500 hover:text-white border-b border-gray-800">
            VOLVER AL DASHBOARD
          </Link>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-48 min-h-screen bg-black border-r-4 border-green-400 fixed top-0 left-0">
        <div className="p-4 border-b-4 border-green-400">
          <p className="font-mono font-black tracking-tighter text-green-400 text-base">ADMIN_PANEL</p>
          <p className="font-mono font-bold text-gray-500 text-xs">SUPERUSER MODE</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`block px-4 py-3 font-mono font-bold text-sm border-l-4 transition-all ${
                pathname === item.href
                  ? 'border-green-400 text-green-400 bg-gray-900'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/dashboard" className="font-mono font-bold text-xs text-gray-500 hover:text-white">
            VOLVER AL DASHBOARD
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 lg:ml-48 p-4 sm:p-6 lg:p-8 min-h-screen bg-black text-white">
        {children}
      </main>
    </div>
  )
}
