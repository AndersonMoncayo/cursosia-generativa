import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { createClient } from "@/lib/supabase/server";
import { CourseClient } from "./CourseClient";

export const dynamic = "force-dynamic";

export default async function DashboardCourseDetail({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get the course
	const { data: course, error: courseError } = await supabase
		.from("courses")
		.select("*, enrollments(*)")
		.eq("slug", slug)
		.single();

	if (courseError || !course) {
		notFound();
	}

	// Verify enrollment
	const isEnrolled = course.enrollments.some(
		(enr: any) => enr.user_id === user.id,
	);

	if (!isEnrolled) {
		redirect(`/cursos/${slug}`);
	}

	const modules = [
		{ title: "MODULO 1: Fundamentos del Sistema", duration: "2.5 hrs" },
		{ title: "MODULO 2: Arquitectura de Referencia", duration: "3.0 hrs" },
		{ title: "MODULO 3: Implementación Práctica", duration: "4.5 hrs" },
		{ title: "MODULO 4: Casos de Uso Avanzados", duration: "3.0 hrs" },
		{ title: "MODULO 5: Seguridad y Escalabilidad", duration: "2.0 hrs" },
		{ title: "MODULO 6: Proyecto Final Real", duration: "5.0 hrs" },
	];

	return (
		<div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
				<div className="mb-12 border-b-8 border-primary pb-8">
					<h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-4 drop-shadow-md">
						{course.title}
					</h1>
					<div className="inline-flex items-center gap-3 bg-black border-4 border-primary px-4 py-2 retro-shadow text-primary font-mono text-sm uppercase">
						<span>SYS.COURSE:</span>
						<span className="text-white font-black">
							{course.slug.toUpperCase()}
						</span>
					</div>
				</div>

				<CourseClient
					courseId={course.id}
					courseTitle={course.title}
					courseSlug={course.slug}
					modules={modules}
				/>
			</main>

			<Footer />
		</div>
	);
}
