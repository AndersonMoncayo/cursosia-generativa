"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { updateProgress } from "@/features/courses/actions";

interface Modulo {
	title: string;
	duration: string;
}

interface CourseClientProps {
	courseId: string;
	courseTitle: string;
	courseSlug: string;
	modules: Modulo[];
}

export const CourseClient: React.FC<CourseClientProps> = ({
	courseId,
	courseTitle,
	courseSlug,
	modules,
}) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [completedModules, setCompletedModules] = useState<boolean[]>(
		new Array(modules.length).fill(false),
	);

	useEffect(() => {
		// Load state from localStorage on mount
		const savedState = modules.map((_, index) => {
			const val = localStorage.getItem(`progress_${courseSlug}_${index}`);
			return val === "true";
		});
		setCompletedModules(savedState);
	}, [courseSlug, modules]);

	const handleCheckboxChange = (index: number) => {
		const newState = [...completedModules];
		newState[index] = !newState[index];
		setCompletedModules(newState);
		localStorage.setItem(
			`progress_${courseSlug}_${index}`,
			String(newState[index]),
		);
	};

	const handleMarkComplete = async () => {
		setLoading(true);
		const completedCount = completedModules.filter(Boolean).length;
		const progress = Math.round((completedCount / modules.length) * 100);

		const res = await updateProgress(courseId, progress);
		setLoading(false);
		if (res.success) {
			alert("Progreso guardado correctamente");
			router.refresh();
		} else {
			alert("Error: " + res.error);
		}
	};

	return (
		<div className="space-y-8">
			<div className="bg-black border-4 border-slate-700 p-8 retro-shadow">
				<h2 className="text-3xl font-black uppercase text-white mb-6 border-l-8 border-primary pl-4 tracking-tighter">
					TEMARIO DEL CURSO
				</h2>
				<div className="space-y-4 mb-8">
					{modules.map((mod, index) => (
						<div
							key={index}
							className="bg-background-dark border-4 border-slate-700 p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-primary transition-colors cursor-pointer"
							onClick={() => handleCheckboxChange(index)}
						>
							<div className="flex items-center gap-4 mb-4 md:mb-0">
								<input
									type="checkbox"
									checked={completedModules[index]}
									readOnly
									className="w-6 h-6 border-2 border-black accent-primary cursor-pointer"
								/>
								<span className="text-3xl font-black text-slate-700 w-12 text-center">
									{String(index + 1).padStart(2, "0")}
								</span>
								<span className="text-xl font-bold uppercase text-white">
									{mod.title}
								</span>
							</div>
							<span className="bg-black border-2 border-slate-800 text-slate-400 text-xs px-3 py-1 uppercase font-bold tracking-widest inline-block w-max">
								{mod.duration}
							</span>
						</div>
					))}
				</div>

				<div className="flex flex-col md:flex-row gap-4">
					<button
						onClick={handleMarkComplete}
						disabled={loading}
						className="flex-1 bg-primary text-black font-black uppercase tracking-widest py-4 border-4 border-black text-center text-lg retro-btn hover:bg-white transition-colors"
					>
						{loading ? "GUARDANDO..." : "MARCAR MÓDULOS COMPLETOS"}
					</button>
					<Link
						href="/dashboard"
						className="flex-1 bg-white text-black font-black uppercase tracking-widest py-4 border-4 border-black text-center text-lg retro-btn hover:bg-slate-200 transition-colors"
					>
						VOLVER AL PANEL
					</Link>
				</div>
			</div>
		</div>
	);
};
