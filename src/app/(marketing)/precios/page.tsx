import { CheckSquare, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";

export const metadata: Metadata = {
	title: "Planes y Precios | CursosIA Generativa",
	description:
		"Sin suscripciones trampa. Pago unico o por modulo. Starter gratis, Pro $47 por modulo, Lifetime $197. Acceso de por vida.",
	alternates: { canonical: "https://cursosia-generativa.vercel.app/precios" },
};

export default function Pricing() {
	return (
		<div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-20">
				<div className="text-center max-w-3xl mx-auto mb-20">
					<div className="inline-block bg-primary text-black font-black px-4 py-1 text-sm border-2 border-black mb-6 uppercase tracking-widest retro-shadow transform -rotate-2">
						Pricing_Tier_Selection
					</div>
					<h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-6 drop-shadow-md">
						Invierte en <br />
						<span className="text-primary border-b-8 border-primary md:inline-block">
							Tu Futuro Operativo
						</span>
					</h1>
					<p className="text-xl text-slate-400 font-bold uppercase leading-relaxed">
						Sin suscripciones trampa. Pago único o mensual simple. Acceso a todo
						el ecosistema.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
					{/* Starter Plan */}
					<div className="bg-white border-4 border-black retro-shadow flex flex-col pt-8 pb-10 px-8 relative mt-8 md:mt-0 opacity-90 hover:opacity-100 transition-opacity">
						<h3 className="text-2xl font-black text-black uppercase mb-2">
							Starter Node
						</h3>
						<p className="text-slate-600 font-bold text-sm h-12">
							Para principiantes que exploran la IA.
						</p>
						<div className="my-6">
							<span className="text-5xl font-black text-black">GRATIS</span>
						</div>
						<ul className="space-y-4 font-bold text-sm text-black mb-10 flex-grow">
							<li className="flex items-start gap-3">
								<CheckSquare className="text-green-500 w-5 h-5" />
								Acceso a Cursos Free
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-green-500 w-5 h-5" />
								Comunidad Básica
							</li>
							<li className="flex items-start gap-3 text-slate-400">
								<X className="text-slate-300 w-5 h-5" />
								Sin Certificados
							</li>
							<li className="flex items-start gap-3 text-slate-400">
								<X className="text-slate-300 w-5 h-5" />
								Soporte Limitado
							</li>
						</ul>
						<Link
							href="/login"
							className="w-full bg-white text-black font-black uppercase py-4 border-4 border-black retro-btn block text-center text-lg mt-auto"
						>
							Iniciar Gratis
						</Link>
					</div>

					{/* Pro Plan */}
					<div className="bg-primary border-4 border-black retro-shadow-lg flex flex-col pt-8 pb-10 px-8 relative transform md:-translate-y-4 z-10">
						<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white font-black uppercase px-6 py-2 text-sm border-2 border-white tracking-widest w-max">
							Recomendado
						</div>
						<h3 className="text-2xl font-black text-black uppercase mb-2">
							Pro Access
						</h3>
						<p className="text-slate-800 font-bold text-sm h-12">
							Acceso a un recurso completo y tutoría.
						</p>
						<div className="my-6">
							<span className="text-5xl font-black text-black">$47</span>
							<span className="text-black font-bold uppercase tracking-widest text-sm ml-2 border-l-2 border-black pl-2">
								USD / Módulo
							</span>
						</div>
						<ul className="space-y-4 font-bold text-sm text-black mb-10 flex-grow">
							<li className="flex items-start gap-3">
								<CheckSquare className="text-black w-5 h-5" />
								Módulos Nivel Intermedio/Avanzado
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-black w-5 h-5" />
								Proyectos Reales & Datasets
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-black w-5 h-5" />
								Certificado On-Chain
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-black w-5 h-5" />
								Discord Privado
							</li>
						</ul>
						<Link
							href="/cursos"
							className="w-full bg-black text-white font-black uppercase py-4 border-4 border-black retro-btn block text-center text-lg mt-auto hover:bg-white hover:text-black transition-colors"
						>
							Ver Cursos Pro
						</Link>
					</div>

					{/* Lifetime Plan */}
					<div className="bg-black border-4 border-primary retro-shadow flex flex-col pt-8 pb-10 px-8 relative mt-8 md:mt-0">
						<h3 className="text-2xl font-black text-white uppercase mb-2">
							Lifetime Core
						</h3>
						<p className="text-slate-400 font-bold text-sm h-12">
							Pase VIP a toda la plataforma de por vida.
						</p>
						<div className="my-6">
							<span className="text-5xl font-black text-white">$197</span>
							<span className="text-slate-400 font-bold uppercase tracking-widest text-sm ml-2 border-l-2 border-slate-600 pl-2">
								USD Único
							</span>
						</div>
						<ul className="space-y-4 font-bold text-sm text-white mb-10 flex-grow">
							<li className="flex items-start gap-3">
								<CheckSquare className="text-primary w-5 h-5" />
								Todos los cursos actuales
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-primary w-5 h-5" />
								Cursos futuros gratis
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-primary w-5 h-5" />
								Mentoría 1:1 (1 hr)
							</li>
							<li className="flex items-start gap-3">
								<CheckSquare className="text-primary w-5 h-5" />
								Prioridad Soporte Nivel 1
							</li>
						</ul>
						<button className="w-full bg-white text-black font-black uppercase py-4 border-4 border-black block text-center text-lg mt-auto opacity-50 cursor-not-allowed">
							Próximamente
						</button>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
