import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const registerSchema = z
	.object({
		full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
		email: z.string().email("Email inválido"),
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres"),
		confirm_password: z.string(),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Las contraseñas no coinciden",
		path: ["confirm_password"],
	});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Email inválido"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
