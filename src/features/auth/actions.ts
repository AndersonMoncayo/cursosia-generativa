"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/database.types";
import { loginSchema, registerSchema } from "./schemas";

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export async function loginAction(formData: FormData): Promise<ActionResult> {
	const raw = Object.fromEntries(formData.entries());
	const parsed = loginSchema.safeParse(raw);

	if (!parsed.success) {
		return {
			ok: false,
			error: parsed.error.issues[0]?.message ?? "Datos inválidos",
		};
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: parsed.data.email,
		password: parsed.data.password,
	});

	if (error) {
		return { ok: false, error: "Credenciales incorrectas" };
	}

	return { ok: true, data: undefined };
}

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
export async function registerAction(
	formData: FormData,
): Promise<ActionResult> {
	const raw = Object.fromEntries(formData.entries());
	const parsed = registerSchema.safeParse(raw);

	if (!parsed.success) {
		return {
			ok: false,
			error: parsed.error.issues[0]?.message ?? "Datos inválidos",
		};
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signUp({
		email: parsed.data.email,
		password: parsed.data.password,
		options: {
			data: { full_name: parsed.data.full_name },
			emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
		},
	});

	if (error) {
		return { ok: false, error: error.message };
	}

	return { ok: true, data: undefined };
}

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export async function logoutAction(): Promise<ActionResult> {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		return { ok: false, error: error.message };
	}

	return { ok: true, data: undefined };
}

// ─────────────────────────────────────────
// ROLE MANAGEMENT
// ─────────────────────────────────────────
export async function updateUserRole(
	userId: string,
	targetRole: string,
): Promise<{ success: boolean; error?: string; data?: void }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return { success: false, error: "Unauthorized" };
	if (user.id === userId)
		return { success: false, error: "No puedes cambiar tu propio rol" };

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin" && profile?.role !== "superadmin")
		return { success: false, error: "Forbidden" };

	const { createAdminClient } = await import("@/lib/supabase/admin");
	const adminClient = createAdminClient();

	const { error } = await adminClient
		.from("profiles")
		.update({ role: targetRole })
		.eq("id", userId);

	if (error) return { success: false, error: error.message };
	return { success: true, data: undefined };
}
