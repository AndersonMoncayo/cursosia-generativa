"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const niveles = [
	{ value: "todos", label: "TODOS" },
	{ value: "beginner", label: "LEVEL BEGINNER" },
	{ value: "intermediate", label: "LEVEL INTERMEDIATE" },
	{ value: "advanced", label: "LEVEL ADVANCED" },
];

export function CourseFilters({
	currentLevel,
}: {
	currentLevel: string | null;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleFilterClick = useCallback(
		(value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value === "todos") {
				params.delete("level");
			} else {
				params.set("level", value);
			}
			router.push(`/cursos?${params.toString()}`);
		},
		[router, searchParams],
	);

	const activeLevel = currentLevel || "todos";

	return (
		<div className="bg-white border-4 border-black p-6 retro-shadow text-black sticky top-24">
			<h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-2">
				Filtros_Sys
			</h2>

			<div className="mb-8">
				<h3 className="font-bold uppercase tracking-widest text-sm text-slate-500 mb-4">
					Nivel
				</h3>
				<div className="space-y-3">
					{niveles.map((nivel) => {
						const isActive = activeLevel === nivel.value;
						return (
							<label
								key={nivel.value}
								className={`flex items-center gap-2 cursor-pointer py-1 px-2 border-2 transition-colors ${
									isActive
										? "border-primary bg-slate-100"
										: "border-transparent hover:border-slate-300"
								}`}
								onClick={(e) => {
									e.preventDefault();
									handleFilterClick(nivel.value);
								}}
							>
								<input
									type="radio"
									name="level"
									checked={isActive}
									readOnly
									className="w-4 h-4 accent-primary cursor-pointer shrink-0"
								/>
								<span
									className={`font-mono text-[13px] uppercase ${isActive ? "font-black text-black" : "font-bold text-slate-600"}`}
								>
									{nivel.label}
								</span>
							</label>
						);
					})}
				</div>
			</div>

			<button
				onClick={() => handleFilterClick("todos")}
				className="w-full bg-black text-white font-black uppercase py-3 border-2 border-transparent hover:bg-primary hover:text-black hover:border-black transition-colors"
			>
				Reset Filtros
			</button>
		</div>
	);
}
