import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import type React from "react";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
	title: "CursosIA Generativa | Aprende Inteligencia Artificial",
	description:
		"Aprende ChatGPT, Claude, Gemini, n8n y automatización desde cero hasta experto.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={`${spaceGrotesk.variable} font-display grid-pattern`}>
				{children}
			</body>
		</html>
	);
}
