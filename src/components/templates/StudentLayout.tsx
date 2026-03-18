'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  User,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/courses', label: 'MIS CURSOS', icon: LayoutDashboard },
  { href: '/courses/explorar', label: 'EXPLORAR', icon: BookOpen },
  { href: '/courses/progreso', label: 'PROGRESO', icon: Trophy },
  { href: '/courses/perfil', label: 'MI PERFIL', icon: User },
]

interface StudentLayoutProps {
  children: ReactNode
}

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="h-full flex flex-col bg-black border-r-2 border-[#1acb5b]">
      <div className="p-4 border-b-2 border-[#1acb5b]">
        <div className="flex items-center justify-between">
          <Link href="/courses" className="text-lg font-black uppercase tracking-widest text-[#1acb5b]">
            STUDENT.SYS
          </Link>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Cerrar menú" className="text-white hover:text-[#1acb5b] p-1 lg:hidden">
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/courses' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-3 text-sm font-bold uppercase tracking-wide transition-all border-2',
                active
                  ? 'bg-[#1acb5b] text-black border-black'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-[#1acb5b] hover:px-5',
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-[Space_Grotesk,sans-serif] flex">
      <aside className="hidden lg:flex w-60 shrink-0 h-screen sticky top-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setDrawerOpen(false)} role="presentation" />
      )}
      <aside className={cn('fixed left-0 top-0 h-full w-72 z-50 lg:hidden transition-transform duration-200', drawerOpen ? 'translate-x-0' : '-translate-x-full')}>
        <SidebarContent pathname={pathname} onClose={() => setDrawerOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-black border-b-2 border-[#1acb5b]">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Abrir menú" className="text-[#1acb5b] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Menu size={22} />
          </button>
          <span className="text-sm font-black uppercase tracking-widest text-[#1acb5b]">STUDENT.SYS</span>
          <div className="w-10" />
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
