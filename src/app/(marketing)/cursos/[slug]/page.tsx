import { BarChart, CheckSquare, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { createClient } from "@/lib/supabase/server";
import { enrollFreeCourse } from "./actions";
import { CourseContentClient } from "./CourseContentClient";

export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const supabase = await createClient();
	const { data: course } = await supabase
		.from("courses")
		.select("title, description, thumbnail_url")
		.eq("slug", slug)
		.single();
	if (!course) return {};
	return {
		title: `${course.title} | CursosIA Generativa`,
		description: course.description?.slice(0, 155) ?? "",
		openGraph: {
			title: course.title,
			description: course.description?.slice(0, 155) ?? "",
			url: `https://cursosia-generativa.vercel.app/cursos/${slug}`,
			type: "article",
			images: [
				{
					url: course.thumbnail_url || "/og-image.png",
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: course.title,
			description: course.description?.slice(0, 155) ?? "",
			images: [course.thumbnail_url || "/og-image.png"],
		},
		alternates: {
			canonical: `https://cursosia-generativa.vercel.app/cursos/${slug}`,
		},
	};
}

export default async function CourseDetail({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let course = null;
	try {
		const { data, error } = await supabase
			.from("courses")
			.select("*")
			.eq("slug", slug)
			.single();

		if (error) throw error;
		course = data;
	} catch (error) {
		notFound();
	}

	if (!course) {
		notFound();
	}

	const accessUrl = user ? `/checkout/${course.id}` : "/login";

	const { data: dbModules } = await supabase
		.from("modules")
		.select(`
      id, title, order_index,
      lessons (
        id, title, order_index,
        duration_min, is_free, is_published,
        deleted_at
      )
    `)
		.eq("course_id", course.id)
		.eq("is_published", true)
		.is("deleted_at", null)
		.order("order_index", { ascending: true });

	const modules = (dbModules || []).map((m) => {
		const validLessons = m.lessons
			? m.lessons.filter((l: any) => l.is_published && l.deleted_at === null)
			: [];
		const totalMins = validLessons.reduce(
			(acc: number, l: any) => acc + (l.duration_min || 0),
			0,
		);
		const hrs = (totalMins / 60).toFixed(1);
		return {
			title: m.title,
			duration: totalMins > 0 ? `${hrs} hrs` : "0 hrs",
		};
	});

	return (
		<div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
				{/* Course Info */}
				<div className="lg:col-span-2 space-y-8">
					<div className="bg-primary text-black font-black uppercase text-xs inline-block px-3 py-1 border-2 border-black tracking-widest">
						{course.level || "TODOS LOS NIVELES"}
					</div>

					<h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-md">
						{course.title}
					</h1>

					<div className="flex flex-wrap items-center gap-6">
						<div className="flex items-center gap-2 text-primary font-bold">
							<Clock className="w-5 h-5" />
							<span className="uppercase">
								{course.duration_hours || 0} HORAS DE CONTENIDO
							</span>
						</div>
						<div className="flex items-center gap-2 text-primary font-bold">
							<BarChart className="w-5 h-5" />
							<span className="uppercase">
								NIVEL: {course.level || "PRINCIPIANTE"}
							</span>
						</div>
					</div>

					<div className="bg-black border-4 border-slate-800 p-8 text-lg font-bold text-slate-300 leading-relaxed retro-shadow">
						{course.description}
					</div>

					{/* Temario Component */}
					<CourseContentClient
						courseId={course.id}
						dbModules={dbModules || []}
					/>
				</div>

				{/* Sidebar / Checkout CTA */}
				<div className="lg:col-span-1 relative">
					<div className="sticky top-10 bg-white border-4 border-black p-8 retro-shadow-lg text-black">
						{course.image_url ? (
							<div className="h-48 bg-slate-200 border-4 border-black mb-6 w-full flex items-center justify-center -mt-12 overflow-hidden retro-shadow relative z-10">
								<img
									src={course.image_url}
									alt={course.title}
									className="w-full h-full object-cover"
								/>
							</div>
						) : (
							<div className="h-48 bg-primary border-4 border-black mb-6 w-full flex items-center justify-center -mt-12 retro-shadow relative z-10">
								<span className="font-black text-4xl uppercase tracking-tighter">
									PREVIEW
								</span>
							</div>
						)}

						<div className="mb-8">
							<span className="text-sm font-black text-slate-500 uppercase tracking-widest block mb-2">
								INVERSIÃ“N ÃšNICA
							</span>
							<div className="text-6xl font-black uppercase tracking-tighter">
								{course.price === 0 ? "GRATIS" : `$${course.price}`}
							</div>
						</div>

						{course.price === 0 ? (
							user ? (
								<form action={enrollFreeCourse.bind(null, course.id)}>
									<button
										type="submit"
										className="w-full bg-black text-[#00ff00] font-black uppercase tracking-widest py-5 border-4 border-black text-center block text-xl retro-btn hover:bg-white hover:text-black transition-colors mb-6 cursor-pointer"
									>
										ACCEDER GRATIS
									</button>
								</form>
							) : (
								<Link
									href={`/registro`}
									className="w-full bg-black text-[#00ff00] font-black uppercase tracking-widest py-5 border-4 border-black text-center block text-xl retro-btn hover:bg-white hover:text-black transition-colors mb-6"
								>
									ACCEDER GRATIS
								</Link>
							)
						) : (
							<Link
								href={accessUrl}
								className="w-full bg-black text-white font-black uppercase tracking-widest py-5 border-4 border-black text-center block text-xl retro-btn hover:bg-primary hover:text-black transition-colors mb-6"
							>
								ACCEDER AL MÃ“DULO
							</Link>
						)}

						<ul className="space-y-4 text-sm font-bold border-t-4 border-slate-200 pt-6 mt-6">
							<li className="flex items-center gap-3">
								<CheckSquare className="text-primary w-5 h-5" /> ACCESO DE POR
								VIDA AL CONTENIDO
							</li>
							<li className="flex items-center gap-3">
								<CheckSquare className="text-primary w-5 h-5" /> ACTUALIZACIONES
								GRATUITAS
							</li>
							<li className="flex items-center gap-3">
								<CheckSquare className="text-primary w-5 h-5" /> PROYECTOS
								PRÃCTICOS REALES
							</li>
							<li className="flex items-center gap-3">
								<CheckSquare className="text-primary w-5 h-5" /> SOPORTE DE LA
								COMUNIDAD
							</li>
						</ul>
					</div>
				</div>
			</main>

			<Footer />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Course",
						name: course.title,
						description: course.description,
						provider: {
							"@type": "Organization",
							name: "CursosIA Generativa",
							url: "https://cursosia-generativa.vercel.app",
						},
					}),
				}}
			/>
		</div>
	);
}
