"use client";

import React, { useState } from "react";

export function CourseContentClient({
	dbModules,
}: {
	courseId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dbModules: any[];
}) {
	const [expandedModules, setExpandedModules] = useState<
		Record<string, boolean>
	>({});

	const toggle = (id: string) =>
		setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const formatDuration = (lessons: any[]) => {
		const valid = (lessons ?? []).filter(
			(l: any) => l.is_published && l.deleted_at === null,
		);
		const totalMins = valid.reduce(
			(acc: number, l: any) => acc + (l.duration_min || 0),
			0,
		);
		return totalMins > 0 ? (totalMins / 60).toFixed(1) + " hrs" : "0 hrs";
	};

	const publishedModules = dbModules;

	return (
		<div>
			<h2 className="text-3xl font-black uppercase tracking-tight text-white mb-6 border-l-8 border-primary pl-4">
				TEMARIO DEL CURSO
			</h2>
			<div className="space-y-4">
				{publishedModules.map((mod, index) => {
					const isExpanded = expandedModules[mod.id];
					const durationStr = formatDuration(mod.lessons);
					const publishedLessons = (mod.lessons ?? []).filter(
						(l: any) => l.is_published && l.deleted_at === null,
					);

					return (
						<div key={mod.id} className="flex flex-col gap-2">
							<div
								className="bg-background-dark border-4 border-slate-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-primary transition-colors cursor-pointer"
								onClick={() => toggle(mod.id)}
								role="button"
								aria-expanded={isExpanded}
							>
								<div className="flex items-center gap-4 w-full md:w-auto">
									<span className="text-4xl font-black text-slate-700 group-hover:text-primary transition-colors shrink-0">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="text-xl font-bold uppercase text-white group-hover:text-primary transition-colors">
										{mod.title}
									</span>
								</div>
								<div className="flex items-center gap-4 mt-4 md:mt-0">
									<span className="bg-black border-2 border-slate-800 text-slate-400 text-xs px-3 py-1 uppercase font-bold tracking-widest hidden md:block shrink-0">
										{durationStr}
									</span>
									<span className="text-primary font-bold text-sm">
										{isExpanded ? "" : ""}
									</span>
								</div>
							</div>

							{isExpanded && publishedLessons.length > 0 && (
								<div className="pl-8 space-y-2">
									{publishedLessons.map((lesson: any, lIdx: number) => (
										<div
											key={lesson.id}
											className="bg-black border-2 border-slate-800 px-5 py-3 flex justify-between items-center"
										>
											<div className="flex items-center gap-3">
												<span className="text-slate-500 font-mono text-sm">
													{lIdx + 1}.
												</span>
												<span className="text-slate-300 font-bold text-sm uppercase">
													{lesson.title}
												</span>
												{lesson.is_free && (
													<span className="bg-primary text-black text-[10px] font-black px-2 py-0.5 uppercase">
														GRATIS
													</span>
												)}
											</div>
											<span className="text-slate-500 text-xs font-mono">
												{lesson.duration_min} min
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
