import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
	title: "Recuperar Contraseña | CursosIA Generativa",
	description:
		"Restablece tu contraseña de CursosIA Generativa. Ingresa tu email y recibirás un enlace de recuperación.",
	alternates: {
		canonical: "https://cursosia-generativa.vercel.app/forgot-password",
	},
	robots: { index: false, follow: false },
	openGraph: {
		title: "Recuperar Contraseña | CursosIA Generativa",
		description:
			"Restablece tu contraseña y vuelve a aprender IA Generativa.",
		url: "https://cursosia-generativa.vercel.app/forgot-password",
		images: [{ url: "/og-image.png", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Recuperar Contraseña | CursosIA Generativa",
		description:
			"Restablece tu contraseña y vuelve a aprender IA Generativa.",
	},
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordClient />;
}
