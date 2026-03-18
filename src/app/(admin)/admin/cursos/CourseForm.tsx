"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	createCourse,
	updateCourse,
	uploadCourseImage,
} from "@/features/courses/actions";

type CourseFormProps = {
	course?: {
		id: string;
		title: string;
		slug: string;
		description: string;
		level: string;
		duration_hours: number;
		price: number;
		thumbnail_url: string | null;
		instructor: string;
		is_published: boolean;
	};
};

export function CourseForm({ course }: CourseFormProps) {
	const router = useRouter();
	const isEditing = !!course;

	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [formData, setFormData] = useState({
		title: course?.title || "",
		slug: course?.slug || "",
		description: course?.description || "",
		level: course?.level || "beginner",
		duration_hours: course?.duration_hours || 0,
		price: course?.price || 0,
		instructor: course?.instructor || "",
		is_published: course?.is_published || false,
		image_url: course?.thumbnail_url || "",
	});

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		// Auto-generate slug only if we are not editing (or if they type the title fast before focusing slug)
		// Actually, only auto-generate it if it's new
		if (!isEditing) {
			setFormData((prev) => ({
				...prev,
				title,
				slug: title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)+/g, ""),
			}));
		} else {
			setFormData((prev) => ({ ...prev, title }));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			const tiposPermitidos = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/webp",
				"image/gif",
			];
			if (!tiposPermitidos.includes(selectedFile.type)) {
				toast.error("Solo se permiten imágenes JPG, PNG, WEBP o GIF");
				return;
			}
			setFile(selectedFile);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const toastId = toast.loading(
			isEditing ? "Actualizando curso..." : "Creando curso...",
		);

		try {
			let finalImageUrl = formData.image_url;

			if (file) {
				const uploadFormData = new FormData();
				uploadFormData.append("file", file);

				const uploadRes = await uploadCourseImage(uploadFormData);
				if (!uploadRes.success || !uploadRes.data?.url) {
					throw new Error(uploadRes.error || "Error al subir la imagen");
				}
				finalImageUrl = uploadRes.data.url;
			}

			const payload = {
				...formData,
				image_url: finalImageUrl,
				level: formData.level as "beginner" | "intermediate" | "advanced",
			};

			let res;
			if (isEditing) {
				res = await updateCourse(course.id, payload);
			} else {
				res = await createCourse(payload);
			}

			if (!res.success) {
				throw new Error(
					res.error ||
						(isEditing
							? "Error al actualizar el curso"
							: "Error al crear el curso"),
				);
			}

			toast.success(
				isEditing ? "Curso actualizado" : "Curso creado exitosamente",
				{ id: toastId },
			);
			router.push("/admin/cursos");
			router.refresh();
		} catch (error: any) {
			toast.error(error.message, { id: toastId });
		} finally {
			setLoading(false);
		}
	};

	return (
		<article className="bg-[#1a1a1a] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-5xl mx-auto">
			{/* Window Bar */}
			<div className="bg-[#333333] border-b-4 border-black p-3 flex items-center justify-between">
				<div className="flex space-x-2">
					<div className="w-3 h-3 bg-red-500 border-2 border-black"></div>
					<div className="w-3 h-3 bg-yellow-500 border-2 border-black"></div>
					<div className="w-3 h-3 bg-green-500 border-2 border-black"></div>
				</div>
				<div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
					COURSE_METADATA_EDITOR
				</div>
			</div>

			{/* Form Content */}
			<form onSubmit={handleSubmit} className="p-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Inputs */}
					<div className="md:col-span-2">
						<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
							TITLE
						</label>
						<input
							required
							value={formData.title}
							onChange={handleTitleChange}
							className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b]"
							placeholder="E.g. Advanced Prompt Engineering v2"
							type="text"
						/>
					</div>

					<div className="md:col-span-1">
						<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
							SLUG
						</label>
						<input
							required
							value={formData.slug}
							onChange={(e) =>
								setFormData({ ...formData, slug: e.target.value })
							}
							className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b]"
							placeholder="advanced-prompt-engineering"
							type="text"
						/>
					</div>

					<div className="md:col-span-1">
						<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
							INSTRUCTOR
						</label>
						<input
							required
							value={formData.instructor}
							onChange={(e) =>
								setFormData({ ...formData, instructor: e.target.value })
							}
							className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b]"
							placeholder="Dr. Neural Link"
							type="text"
						/>
					</div>

					<div className="md:col-span-2">
						<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
							DESCRIPTION
						</label>
						<textarea
							required
							rows={4}
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b] resize-none"
							placeholder="Briefly describe the learning path..."
						/>
					</div>

					<div className="md:col-span-1 grid grid-cols-2 gap-4">
						<div>
							<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
								PRICE USD
							</label>
							<input
								required
								type="number"
								step="0.01"
								min="0"
								value={formData.price}
								onChange={(e) =>
									setFormData({
										...formData,
										price: parseFloat(e.target.value),
									})
								}
								className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b]"
								placeholder="99.00"
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
								DURATION HOURS
							</label>
							<input
								required
								type="number"
								min="0"
								value={formData.duration_hours}
								onChange={(e) =>
									setFormData({
										...formData,
										duration_hours: parseInt(e.target.value),
									})
								}
								className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b]"
								placeholder="12"
							/>
						</div>
					</div>

					<div className="md:col-span-1">
						<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
							LEVEL
						</label>
						<select
							value={formData.level}
							onChange={(e) =>
								setFormData({ ...formData, level: e.target.value })
							}
							className="w-full bg-[#0d0d0d] border-2 border-[#333333] p-4 text-white focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#1acb5b]"
						>
							<option value="beginner">BEGINNER</option>
							<option value="intermediate">INTERMEDIATE</option>
							<option value="advanced">ADVANCED</option>
						</select>
					</div>

					{/* Image Upload */}
					<div className="md:col-span-1">
						<label className="block text-[10px] font-bold text-primary tracking-widest mb-2">
							COURSE COVER
						</label>
						<label className="w-[120px] h-[120px] border-2 border-primary border-dashed flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:bg-primary/10 transition-colors bg-[#0d0d0d]">
							<input
								type="file"
								className="hidden"
								accept="image/jpeg,image/png,image/webp,image/gif"
								onChange={handleFileChange}
							/>
							<span className="text-[10px] font-bold text-primary text-center">
								{file
									? file.name
									: formData.image_url
										? "IMAGE SELECTED"
										: "DRAG OR SELECT Clic"}
							</span>
						</label>
						<div className="text-[10px] text-gray-500 mt-2">
							Optional. Use horizontal ratio.
						</div>
					</div>

					{/* Published Toggle */}
					<div className="md:col-span-1 flex items-end pb-4">
						<label className="flex items-center cursor-pointer group">
							<input
								type="checkbox"
								className="hidden peer"
								checked={formData.is_published}
								onChange={(e) =>
									setFormData({ ...formData, is_published: e.target.checked })
								}
							/>
							<div className="w-8 h-8 border-4 border-black bg-[#0d0d0d] peer-checked:bg-primary transition-colors flex items-center justify-center">
								<svg
									className={`w-5 h-5 text-black ${formData.is_published ? "opacity-100" : "opacity-0"}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="square"
										strokeLinejoin="round"
										strokeWidth="4"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
							<span className="ml-4 text-[10px] font-bold text-white tracking-widest uppercase">
								PUBLISH IMMEDIATELY
							</span>
						</label>
					</div>

					{/* Form Actions */}
					<div className="md:col-span-2 flex flex-col space-y-4 pt-8 border-t-4 border-[#333333]">
						<button
							disabled={loading}
							type="submit"
							className="w-full bg-primary text-black border-4 border-black py-5 font-bold text-xl neo-shadow neo-button"
						>
							{loading ? "SAVING..." : "SAVE COURSE"}
						</button>
						<Link
							href="/admin/cursos"
							className="block w-full text-center bg-[#555] text-white border-4 border-black py-4 font-bold tracking-widest neo-shadow neo-button"
						>
							CANCEL
						</Link>
					</div>
				</div>
			</form>
		</article>
	);
}
