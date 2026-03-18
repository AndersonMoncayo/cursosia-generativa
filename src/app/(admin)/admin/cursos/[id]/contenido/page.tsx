import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CourseContentManager from "@/components/admin/CourseContentManager";
import { createClient } from "@/lib/supabase/server";

export default async function CourseContentPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	// Obtenemos el curso base
	const { data: course, error: courseError } = await supabase
		.from("courses")
		.select("id, title, slug")
		.eq("id", id)
		.single();

	if (courseError || !course) {
		return (
			<div className="p-10 font-black text-white uppercase tracking-widest text-xl">
				Curso no encontrado ({courseError?.message || "NULL"})
			</div>
		);
	}

	// Obtenemos los módulos ordenados
	const { data: modules } = await supabase
		.from("modules")
		.select("*")
		.eq("course_id", id)
		.is("deleted_at", null)
		.order("order_index", { ascending: true });

	// Obtenemos todas las lecciones del curso
	const { data: lessons } = await supabase
		.from("lessons")
		.select("*")
		.eq("course_id", id)
		.is("deleted_at", null)
		.order("order_index", { ascending: true });

	return (
		<div className="space-y-10 pb-20">
			<div className="flex justify-between items-end border-b-8 border-primary pb-6">
				<div>
					<Link
						href="/admin/cursos"
						className="inline-flex items-center gap-2 text-primary hover:text-white font-bold text-sm tracking-widest uppercase mb-4 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" /> VOLVER A CURSOS
					</Link>
					<h1 className="text-4xl font-black uppercase tracking-tighter text-white">
						CONTENIDO DEL CURSO
					</h1>
					<p className="text-primary font-bold uppercase mt-2 tracking-widest text-sm">
						{course.title}
					</p>
				</div>
			</div>

			<CourseContentManager
				course={course}
				initialModules={modules || []}
				initialLessons={lessons || []}
			/>
		</div>
	);
}
