import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
	title: "Crear Cuenta | CursosIA Generativa",
	description:
		"Crea tu cuenta gratuita en CursosIA Generativa y empieza a aprender IA Generativa hoy.",
	alternates: {
		canonical: "https://cursosia-generativa.vercel.app/register",
	},
	robots: { index: true, follow: true },
	openGraph: {
		title: "Crear Cuenta | CursosIA Generativa",
		description:
			"Regístrate gratis y empieza a aprender IA Generativa desde cero.",
		url: "https://cursosia-generativa.vercel.app/register",
		images: [{ url: "/og-image.png", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Crear Cuenta | CursosIA Generativa",
		description:
			"Regístrate gratis y empieza a aprender IA Generativa desde cero.",
	},
};

export default function RegisterPage() {
	return <RegisterClient />;
}
