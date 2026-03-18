import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
	title: "Iniciar Sesión | CursosIA Generativa",
	description:
		"Accede a tu cuenta de CursosIA Generativa. Aprende IA Generativa, ChatGPT, N8N y automatizaciones con cursos prácticos en español.",
	alternates: {
		canonical: "https://cursosia-generativa.vercel.app/login",
	},
	robots: { index: true, follow: true },
	openGraph: {
		title: "Iniciar Sesión | CursosIA Generativa",
		description:
			"Accede a tu cuenta y continúa aprendiendo IA Generativa en español.",
		url: "https://cursosia-generativa.vercel.app/login",
		images: [{ url: "/og-image.png", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Iniciar Sesión | CursosIA Generativa",
		description:
			"Accede a tu cuenta y continúa aprendiendo IA Generativa en español.",
	},
};

export default function LoginPage() {
	return <LoginClient />;
}
