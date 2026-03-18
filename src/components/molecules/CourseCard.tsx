import Link from "next/link";
import type React from "react";
import type { Course } from "@/types";

interface CourseCardProps {
	course: Course;
	progress?: number;
	isPurchased?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
	course,
	progress,
	isPurchased,
}) => {
	return (
		<div
			className={`${course.color || (isPurchased ? "bg-white" : "bg-white")} border-4 border-black retro-shadow-lg flex flex-col group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden`}
		>
			<div className="os-bar px-4 py-2 flex items-center justify-between bg-black">
				<div className="flex gap-2">
					<div className="size-3 bg-red-500 border-2 border-black"></div>
					<div className="size-3 bg-yellow-400 border-2 border-black"></div>
					<div className="size-3 bg-green-500 border-2 border-black"></div>
				</div>
				<span className="text-xs font-bold text-white uppercase tracking-widest">
					{course.slug.slice(0, 10)}.exe
				</span>
			</div>

			{isPurchased && course.thumbnail_url && (
				<div
					className={`h-32 border-b-4 border-black flex items-center justify-center relative bg-primary`}
				>
					<img
						src={course.thumbnail_url}
						alt={course.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			<div className="p-8 flex flex-col flex-grow relative z-10 text-black">
				{course.badge && !isPurchased && (
					<div className="absolute top-4 right-4 bg-black text-white text-xs font-black uppercase px-3 py-1 border-2 border-white transform rotate-3">
						{course.badge}
					</div>
				)}
				<div className="mb-4">
					<span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest border border-white/20">
						Nivel: {course.level || "Todos"}
					</span>
				</div>
				<h3 className="text-3xl font-black text-black uppercase leading-none mb-4 tracking-tight group-hover:underline decoration-4">
					{course.title}
				</h3>
				{!isPurchased && (
					<p className="text-black/80 font-bold text-sm mb-8 flex-grow line-clamp-3">
						{course.description}
					</p>
				)}

				{isPurchased ? (
					<div className="mt-auto">
						<div className="mb-6">
							<div className="flex justify-between text-[10px] font-black uppercase mb-1">
								<span className="text-slate-500">Progreso</span>
								<span>{progress || 0}%</span>
							</div>
							<div className="h-2 w-full bg-slate-200 border-2 border-black outline outline-1 outline-offset-1 outline-transparent flex items-center p-px">
								<div
									className="h-full bg-primary"
									style={{ width: `${progress || 0}%` }}
								></div>
							</div>
						</div>

						<Link
							href={`/cursos/${course.slug}/learn`}
							className="w-full block bg-black text-white font-black uppercase py-3 border-2 border-transparent text-center text-sm hover:bg-primary hover:text-black hover:border-black transition-colors"
						>
							Continuar
						</Link>
					</div>
				) : (
					<div className="flex items-center justify-between mt-auto pt-6 border-t-4 border-black/10">
						{course.price === 0 ? (
							<Link
								href={`/cursos/${course.slug}`}
								className="w-full bg-black text-[#00ff00] font-black px-6 py-3 uppercase border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors block text-center tracking-widest"
							>
								ACCEDER GRATIS
							</Link>
						) : (
							<>
								<div className="flex flex-col">
									{course.original_price && (
										<span className="text-black/50 line-through text-left font-black text-sm">
											${course.original_price}
										</span>
									)}
									<span className="text-black font-black text-3xl">
										${course.price}
									</span>
								</div>
								<Link
									href={`/cursos/${course.slug}`}
									className="bg-black text-white font-black px-6 py-3 uppercase border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors block text-center"
								>
									Ver Módulo
								</Link>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
