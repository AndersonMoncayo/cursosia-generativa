import { StudentLayout } from '@/components/templates/StudentLayout'
import { OSWindowBar } from '@/components/atoms/OSWindowBar'

export default function CoursesPage() {
  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="border-2 border-black bg-[#111] shadow-[4px_4px_0px_#1acb5b]">
          <OSWindowBar title="MIS_CURSOS.EXE" />
          <div className="p-6">
            <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
              Mis Cursos
            </h1>
            <p className="text-gray-400 font-[Space_Grotesk,sans-serif]">
              Aquí encontrarás todos los cursos a los que estás inscrito.
            </p>
          </div>
        </div>

        {/* Courses placeholder */}
        <div className="border-2 border-black bg-[#111] p-6">
          <p className="text-gray-400 text-sm font-[Space_Grotesk,sans-serif] text-center py-8">
            Aún no tienes cursos comprados.{' '}
            <a href="/cursos" className="text-[#1acb5b] underline font-bold">
              Explorar catálogo →
            </a>
          </p>
        </div>
      </div>
    </StudentLayout>
  )
}
