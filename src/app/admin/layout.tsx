import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, BookOpen, FileText, BarChart } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background-dark font-display text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r-4 border-primary flex flex-col pt-10 px-6 fixed h-full z-10 shrink-0 shadow-[4px_0px_0px_0px_rgba(26,203,91,1)]">
        <div className="mb-12">
          <Link href="/admin" className="text-2xl font-black uppercase text-white tracking-tighter">
            ADMIN<span className="text-primary">_PANEL</span>
          </Link>
          <div className="text-xs font-bold text-slate-500 uppercase mt-2 tracking-widest border-l-2 border-primary pl-2">
            Superuser Mode
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <Link href="/admin/cursos" className="flex items-center gap-4 text-white font-bold uppercase py-3 hover:text-primary transition-colors group">
            <BookOpen className="w-5 h-5 group-hover:text-primary" />
            Cursos
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-4 text-white font-bold uppercase py-3 hover:text-primary transition-colors group">
            <Users className="w-5 h-5 group-hover:text-primary" />
            Usuarios
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-4 text-white font-bold uppercase py-3 hover:text-primary transition-colors group">
            <FileText className="w-5 h-5 group-hover:text-primary" />
            Posts
          </Link>
          <Link href="/admin/estadisticas" className="flex items-center gap-4 text-white font-bold uppercase py-3 hover:text-primary transition-colors group">
            <BarChart className="w-5 h-5 group-hover:text-primary" />
            Estadísticas
          </Link>
        </nav>

        <div className="mb-8 pt-8 border-t-4 border-slate-800">
          <Link href="/dashboard" className="text-primary font-bold uppercase text-sm hover:text-white transition-colors">
            ← Volver al Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 relative">
        {children}
      </main>
    </div>
  )
}
