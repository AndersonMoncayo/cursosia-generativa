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

	// get color helper
	const getLevelColor = (level: string) => {
		switch (level.toLowerCase()) {
			case "beginner":
				return "bg-[#064e3b]";
			case "intermediate":
				return "bg-[#1e3a8a]";
			case "advanced":
				return "bg-[#7f1d1d]";
			default:
				return "bg-zinc-800";
		}
	};

	return (
		<>
			<section
				className="mb-8 flex flex-col md:flex-row gap-4"
				data-purpose="filters-toolbox"
			>
				<div className="relative flex-grow">
					<input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-[#1a1a1a] border-4 border-black text-white px-4 py-4 focus:ring-0 focus:border-primary placeholder:text-gray-600 font-bold"
						placeholder="BUSCAR CURSO..."
						type="text"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="bg-[#1a1a1a] border-4 border-black text-white px-6 py-4 font-bold focus:ring-0 focus:border-primary uppercase min-w-[200px]"
				>
					<option value="ALL_STATUS">ALL_STATUS</option>
					<option value="PUBLISHED">PUBLISHED</option>
					<option value="DRAFTS">DRAFTS</option>
				</select>
			</section>

			<section
				className="overflow-x-auto bg-[#222222] brutalist-border brutalist-shadow"
				data-purpose="table-container"
			>
				<table className="w-full border-collapse min-w-[800px]">
					<thead className="bg-black text-white">
						<tr className="text-left">
							<th className="p-4 font-black uppercase tracking-widest border-b-4 border-black">
								Title
							</th>
							<th className="p-4 font-black uppercase tracking-widest border-b-4 border-black text-center">
								Level
							</th>
							<th className="p-4 font-black uppercase tracking-widest border-b-4 border-black">
								Price
							</th>
							<th className="p-4 font-black uppercase tracking-widest border-b-4 border-black text-center">
								Status
							</th>
							<th className="p-4 font-black uppercase tracking-widest border-b-4 border-black text-right">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="text-white divide-y-4 divide-black">
						{filteredCourses.map((course) => (
							<tr
								key={course.id}
								className="hover:bg-zinc-900 transition-colors"
							>
								<td className="p-4">
									<span className="block text-xl font-bold uppercase italic">
										{course.title}
									</span>
									<span className="text-xs text-gray-400 font-mono">
										UUID: {course.id.substring(0, 12)}...
									</span>
								</td>
								<td className="p-4 text-center">
									<span
										className={`px-3 py-1 ${getLevelColor(course.level)} border-2 border-black font-bold text-xs uppercase inline-block`}
									>
										{course.level}
									</span>
								</td>
								<td className="p-4 text-primary font-black text-xl">
									${course.price}
								</td>
								<td className="p-4">
									<div className="flex justify-center">
										<div
											onClick={() =>
												handleToggle(course.id, course.is_published)
											}
											className={`w-14 h-8 neo-border p-1 cursor-pointer transition-colors ${course.is_published ? "bg-primary" : "bg-zinc-700"}`}
										>
											<div
												className={`w-5 h-5 bg-black transition-transform ${course.is_published ? "ml-auto translate-x-1" : "ml-0"}`}
											></div>
										</div>
									</div>
								</td>
								<td className="p-4">
									<div className="flex justify-end gap-2 text-xs">
										<Link
											href={`/admin/cursos/${course.id}/editar`}
											className="px-3 py-2 neo-border bg-white text-black font-bold hover:bg-primary transition-colors uppercase"
										>
											Edit
										</Link>
										<Link
											href={`/admin/cursos/${course.id}/contenido`}
											className="px-3 py-2 neo-border bg-white text-black font-bold hover:bg-primary transition-colors uppercase"
										>
											Content
										</Link>
										<button
											onClick={() => handleDelete(course.id)}
											className="px-3 py-2 neo-border bg-red-600 text-black font-bold hover:bg-red-500 transition-colors uppercase cursor-pointer"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
						{filteredCourses.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="p-8 text-center text-gray-400 font-bold uppercase italic border-t-4 border-black"
								>
									No se encontraron cursos con estos filtros.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</section>
		</>
	);
}
