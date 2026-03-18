import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/molecules/CourseCard";
import { CourseFilters } from "@/components/molecules/CourseFilters";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types";

export const metadata: Metadata = {
	title: "Catalogo de Cursos IA | CursosIA Generativa",
	description:
		"Explora todos los cursos de Inteligencia Artificial. Filtra por nivel: principiante, intermedio y avanzado. Pago unico, acceso de por vida.",
	alternates: { canonical: "https://cursosia-generativa.vercel.app/cursos" },
};

export const dynamic = "force-dynamic";

const niveles = [
	{ value: "todos", label: "TODOS" },
	{ value: "beginner", label: "LEVEL BEGINNER" },
	{ value: "intermediate", label: "LEVEL INTERMEDIATE" },
	{ value: "advanced", label: "LEVEL ADVANCED" },
];
const PAGE_SIZE = 8;

export const revalidate = 600;

export default async function Catalog({
	params,
	searchParams,
}: {
	params: Promise<{}>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const resolvedParams = await searchParams;
	const supabase = await createClient();

	// Extraer params
	const level =
		typeof resolvedParams.level === "string" ? resolvedParams.level : null;
	let query = supabase
		.from("courses")
		.select("*")
		.eq("is_published", true)
		.is("deleted_at", null);

	if (level && level !== "todos") {
		query = query.eq("level", level);
	}

	const { data: courses } = await query.order("created_at", {
		ascending: false,
	});

	return (
		<div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12">
				{/* Sidebar */}
				<aside className="w-full md:w-64 shrink-0">
					<CourseFilters currentLevel={level} />
				</aside>

				{/* Content */}
				<div className="flex-1">
					<div className="flex justify-between items-end mb-10 border-b-4 border-slate-800 pb-6">
						<div>
							<h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none drop-shadow-md text-white">
								Catálogo
							</h1>
							<p className="text-primary font-bold uppercase mt-2 tracking-widest">
								{courses?.length || 0} cursos encontrados
							</p>
						</div>
					</div>

					{!courses || courses.length === 0 ? (
						<div className="bg-black border-[4px] border-white p-12 text-center flex flex-col items-center justify-center retro-shadow">
							<span className="font-mono text-[#00ff00] text-5xl mb-4 font-black tracking-widest animate-pulse">
								&gt;_
							</span>
							<h3 className="text-white font-mono font-black text-3xl uppercase mb-3 tracking-tighter">
								// CURSOS NO ENCONTRADOS
							</h3>
							<p className="text-gray-400 font-bold mb-8 text-sm">
								Intenta con otro nivel o reset filtros.
							</p>
							<Link
								href="/cursos"
								className="bg-black text-[#00ff00] border-2 border-white px-8 py-3 text-sm font-black font-mono tracking-widest hover:bg-white hover:text-black transition-colors uppercase"
							>
								RESET_FILTROS.EXE
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{courses.map((course: Course) => (
								<CourseCard key={course.id} course={course} />
							))}
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
