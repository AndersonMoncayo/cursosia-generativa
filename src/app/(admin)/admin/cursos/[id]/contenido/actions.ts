"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Validaciones
const moduleSchema = z.object({
	course_id: z.string().uuid(),
	title: z.string().min(1),
	order_index: z.number().int(),
	is_published: z.boolean().default(false),
});

const lessonSchema = z.object({
	module_id: z.string().uuid(),
	course_id: z.string().uuid(),
	title: z.string().min(1),
	order_index: z.number().int(),
	duration_min: z.number().int().default(0),
	is_free: z.boolean().default(false),
	is_published: z.boolean().default(false),
});

export async function createModule(data: any) {
	const supabase = await createClient();
	const parsed = moduleSchema.safeParse(data);
	if (!parsed.success) return { success: false, error: "Validation Error" };
	const { error } = await supabase.from("modules").insert(parsed.data);
	if (error) return { success: false, error: error.message };
	revalidatePath(`/admin/cursos/${data.course_id}/contenido`);
	return { success: true };
}

export async function updateModule(id: string, data: any, course_id: string) {
	const supabase = await createClient();
	const parsed = moduleSchema.safeParse(data);
	if (!parsed.success) return { success: false, error: "Validation Error" };
	const finalData = { ...parsed.data, updated_at: new Date().toISOString() };
	const { error } = await supabase
		.from("modules")
		.update(finalData)
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	revalidatePath(`/admin/cursos/${course_id}/contenido`);
	return { success: true };
}

export async function deleteModule(id: string, course_id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("modules")
		.update({ deleted_at: new Date().toISOString() })
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	revalidatePath(`/admin/cursos/${course_id}/contenido`);
	return { success: true };
}

export async function createLesson(data: any) {
	const supabase = await createClient();
	const parsed = lessonSchema.safeParse(data);
	if (!parsed.success) return { success: false, error: "Validation Error" };
	const { error } = await supabase.from("lessons").insert(parsed.data);
	if (error) return { success: false, error: error.message };
	revalidatePath(`/admin/cursos/${data.course_id}/contenido`);
	return { success: true };
}

export async function updateLesson(id: string, data: any, course_id: string) {
	const supabase = await createClient();
	const parsed = lessonSchema.safeParse(data);
	if (!parsed.success) return { success: false, error: "Validation Error" };
	const finalData = { ...parsed.data, updated_at: new Date().toISOString() };
	const { error } = await supabase
		.from("lessons")
		.update(finalData)
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	revalidatePath(`/admin/cursos/${course_id}/contenido`);
	return { success: true };
}

export async function deleteLesson(id: string, course_id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("lessons")
		.update({ deleted_at: new Date().toISOString() })
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	revalidatePath(`/admin/cursos/${course_id}/contenido`);
	return { success: true };
}
