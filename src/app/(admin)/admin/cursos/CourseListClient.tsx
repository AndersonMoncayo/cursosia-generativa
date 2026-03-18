"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteCourse, togglePublishCourse } from "@/features/courses/actions";

type CourseRow = {
	id: string;
	title: string;
	slug: string;
	level: string;
	price: number;
	is_published: boolean;
	created_at: string;
};

export function CourseListClient({
	initialCourses,
}: {
	initialCourses: CourseRow[];
}) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("ALL_STATUS");
	const [courses, setCourses] = useState(initialCourses);

	const handleToggle = async (id: string, currentStatus: boolean) => {
		const toastId = toast.loading("Actualizando estado...");
		const res = await togglePublishCourse(id, !currentStatus);
		if (res.success) {
			toast.success("Estado actualizado", { id: toastId });
			setCourses(
				courses.map((c) =>
					c.id === id ? { ...c, is_published: !currentStatus } : c,
				),
			);
			router.refresh();
		} else {
			toast.error(res.error || "Error al actualizar", { id: toastId });
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!window.confirm(
				"¿Seguro que deseas eliminar este curso? Se hará un borrado lógico (soft-delete).",
			)
		)
			return;

		const toastId = toast.loading("Eliminando curso...");
		const res = await deleteCourse(id);
		if (res.success) {
			toast.success("Curso eliminado", { id: toastId });
			setCourses(courses.filter((c) => c.id !== id));
			router.refresh();
		} else {
			toast.error(res.error || "Error al eliminar", { id: toastId });
		}
	};

	const filteredCourses = courses.filter((c) => {
		const matchesSearch = c.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "ALL_STATUS"
				? true
				: statusFilter === "PUBLISHED"
					? c.is_published
					: !c.is_published;
		return matchesSearch && matchesStatus;
	});

	// FIX: colores sin rojo - sistema consistente con el tema
	const getLevelColor = (level: string) => {
		switch (level.toLowerCase()) {
			case "beginner":
				return "bg-[#064e3b] text-white";
			case "intermediate":
				return "bg-[#1e3a8a] text-white";
			case "advanced":
				return "bg-[#3b0764] text-white"; // morado oscuro, no rojo
			default:
				return "bg-zinc-800 text-white";
		}
	};

	return (
		<>
			{/* Filtros */}
			<div className="flex flex-col sm:flex-row gap-0 mb-8 neo-border">
				<input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-1 bg-[#1a1a1a] border-0 text-white px-4 py-4 focus:ring-0 focus:outline-none placeholder:text-zinc-600 font-bold"
					placeholder="BUSCAR CURSO..."
					type="text"
				/>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="bg-[#1a1a1a] border-l-4 border-black text-white px-6 py-4 font-bold focus:ring-0 focus:outline-none uppercase min-w-[200px]"
				>
					<option value="ALL_STATUS">ALL_STATUS</option>
					<option value="PUBLISHED">PUBLISHED</option>
					<option value="DRAFTS">DRAFTS</option>
				</select>
			</div>

			{/* Tabla */}
			<div className="neo-border overflow-hidden">
				<table className="w-full">
					<thead>
						<tr className="bg-black border-b-4 border-black">
							<th className="text-left px-4 py-3 text-primary font-bold text-xs tracking-widest">TITLE</th>
							<th className="text-left px-4 py-3 text-primary font-bold text-xs tracking-widest">LEVEL</th>
							<th className="text-left px-4 py-3 text-primary font-bold text-xs tracking-widest">PRICE</th>
							<th className="text-left px-4 py-3 text-primary font-bold text-xs tracking-widest">STATUS</th>
							<th className="text-left px-4 py-3 text-primary font-bold text-xs tracking-widest">ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{filteredCourses.map((course) => (
							<tr
								key={course.id}
								className="border-b-2 border-zinc-800 hover:bg-zinc-900 transition-colors"
							>
								<td className="px-4 py-4">
									<p className="font-black text-white uppercase italic text-sm">{course.title}</p>
									<p className="text-zinc-500 text-xs mt-1">UUID: {course.id.substring(0, 12)}...</p>
								</td>
								<td className="px-4 py-4">
									<span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${getLevelColor(course.level)}`}>
										{course.level}
									</span>
								</td>
								<td className="px-4 py-4 text-white font-bold">${course.price}</td>
								<td className="px-4 py-4">
									<button
										type="button"
										onClick={() => handleToggle(course.id, course.is_published)}
										className={`w-14 h-8 neo-border p-1 cursor-pointer transition-all ${
											course.is_published ? "bg-primary" : "bg-zinc-700"
										}`}
										title={course.is_published ? "Despublicar" : "Publicar"}
									>
										<span className="sr-only">{course.is_published ? "Publicado" : "Borrador"}</span>
									</button>
								</td>
								<td className="px-4 py-4">
									<div className="flex gap-2 flex-wrap">
										<Link
											href={`/admin/cursos/${course.id}/editar`}
											className="px-3 py-2 neo-border bg-white text-black font-bold text-xs hover:bg-primary transition-colors uppercase"
										>
											EDIT
										</Link>
										<Link
											href={`/admin/cursos/${course.id}/contenido`}
											className="px-3 py-2 neo-border bg-zinc-700 text-white font-bold text-xs hover:bg-zinc-600 transition-colors uppercase"
										>
											CONTENT
										</Link>
										<button
											type="button"
											onClick={() => handleDelete(course.id)}
											className="px-3 py-2 neo-border bg-zinc-900 text-zinc-400 font-bold text-xs hover:bg-zinc-700 hover:text-white transition-colors uppercase cursor-pointer"
										>
											DELETE
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{filteredCourses.length === 0 && (
					<div className="text-center py-16 text-zinc-500 font-bold tracking-widest">
						NO_COURSES_FOUND
					</div>
				)}
			</div>
		</>
	);
}
