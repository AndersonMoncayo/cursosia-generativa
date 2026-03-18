import { OSWindowBar } from "@/components/atoms/OSWindowBar";
import { TeachLayout } from "@/components/templates/TeachLayout";

export default function TeachPage() {
	return (
		<TeachLayout>
			<div className="space-y-6">
				<div className="border-2 border-black bg-[#111] shadow-[4px_4px_0px_#1acb5b]">
					<OSWindowBar title="INSTRUCTOR_DASHBOARD.EXE" />
					<div className="p-6">
						<h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
							Panel de Instructor
						</h1>
						<p className="text-gray-400 font-[Space_Grotesk,sans-serif]">
							Gestiona tus cursos, revisa el progreso de tus estudiantes y
							consulta tus ingresos.
						</p>
					</div>
				</div>

				{/* Stats placeholder */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
					{[
						{ label: "Cursos publicados", value: "—" },
						{ label: "Estudiantes inscritos", value: "—" },
						{ label: "Ingresos totales", value: "—" },
					].map((stat) => (
						<div
							key={stat.label}
							className="border-2 border-black bg-[#111] p-5 shadow-[3px_3px_0px_#000]"
						>
							<p className="text-xs font-bold uppercase tracking-widest text-[#1acb5b] mb-2">
								{stat.label}
							</p>
							<p className="text-3xl font-black text-white">{stat.value}</p>
						</div>
					))}
				</div>
			</div>
		</TeachLayout>
	);
}
