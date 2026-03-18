import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
	title: "Recuperar Contraseña | CursosIA Generativa",
	description:
		"Recupera el acceso a tu cuenta de CursosIA Generativa. Te enviaremos un enlace a tu email.",
	alternates: {
		canonical: "https://cursosia-generativa.vercel.app/forgot-password",
	},
	robots: { index: true, follow: true },
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
