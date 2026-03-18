"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function enrollFreeCourse(courseId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/registro");
	}

	// Verificamos que sea gratis por seguridad
	const { data: course } = await supabase
		.from("courses")
		.select("price, slug")
		.eq("id", courseId)
		.single();

	if (!course || course.price !== 0) {
		redirect("/dashboard");
	}

	// Insertar asumiendo tabla enrollments
	await supabase.from("enrollments").upsert(
		{
			user_id: user.id,
			course_id: courseId,
		},
		{
			onConflict: "user_id,course_id",
			ignoreDuplicates: true,
		},
	);

	// Redirigir al panel
	redirect("/dashboard");
}

import { revalidatePath } from "next/cache";
import { z } from "zod";

const inlineModuleSchema = z.object({
	title: z.string().min(1).optional(),
	is_published: z.boolean().optional(),
});

const inlineLessonSchema = z.object({
	title: z.string().min(1).optional(),
	video_url: z.string().optional(),
	duration_min: z.number().int().optional(),
	is_free: z.boolean().optional(),
	is_published: z.boolean().optional(),
});

export async function updateModuleInline(id: string, data: any) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin")
		return { success: false, error: "Unauthorized" };

	const parsed = inlineModuleSchema.safeParse(data);
	if (!parsed.success) return { success: false, error: "Validation Error" };

	const finalData = { ...parsed.data, updated_at: new Date().toISOString() };
	const { error } = await supabase
		.from("modules")
		.update(finalData)
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	return { success: true };
}

export async function toggleModulePublishInline(
	id: string,
	is_published: boolean,
) {
	return updateModuleInline(id, { is_published });
}

export async function createLessonInline(course_id: string, module_id: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin")
		return { success: false, error: "Unauthorized" };

	const { data: moduleData } = await supabase
		.from("modules")
		.select("course_id")
		.eq("id", module_id)
		.single();

	const insertData = {
		course_id: moduleData?.course_id || course_id,
		module_id,
		title: "Nueva Lección",
		order_index: 999,
		duration_min: 0,
		is_free: false,
		is_published: false,
	};

	const { error } = await supabase.from("lessons").insert(insertData);
	if (error) return { success: false, error: error.message };
	return { success: true };
}

export async function updateLessonInline(id: string, data: any) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin")
		return { success: false, error: "Unauthorized" };

	const parsed = inlineLessonSchema.safeParse(data);
	if (!parsed.success) return { success: false, error: "Validation Error" };

	const finalData = { ...parsed.data, updated_at: new Date().toISOString() };
	const { error } = await supabase
		.from("lessons")
		.update(finalData)
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	return { success: true };
}

export async function deleteLessonInline(id: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin")
		return { success: false, error: "Unauthorized" };

	const { error } = await supabase
		.from("lessons")
		.update({ deleted_at: new Date().toISOString() })
		.eq("id", id);
	if (error) return { success: false, error: error.message };
	return { success: true };
}
