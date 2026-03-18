"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const supabase = createClient();

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/dashboard`,
		});

		setLoading(false);
		if (error) {
			toast.error(error.message);
		} else {
			setSent(true);
			toast.success("Enlace enviado. Revisa tu correo.");
		}
	};

	return (
		<div className="bg-background-dark min-h-screen font-display grid-pattern flex flex-col">
			<Navbar />
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="w-full max-w-md">
					<div className="bg-white border-4 border-black flex flex-col retro-shadow-lg relative z-10">
						<div className="os-bar px-4 py-2 flex items-center justify-between">
							<div className="flex gap-2">
								<div className="size-3 bg-red-500 border-2 border-black"></div>
								<div className="size-3 bg-yellow-400 border-2 border-black"></div>
								<div className="size-3 bg-green-500 border-2 border-black"></div>
							</div>
							<span className="text-[10px] font-bold text-white uppercase tracking-widest">
								PWD_RESET.exe
							</span>
						</div>

						<div className="p-8 text-black">
							<h1 className="text-3xl font-black uppercase mb-2 leading-tight">
								Reiniciar Sesión
							</h1>
							<p className="text-slate-600 font-bold mb-6 text-sm uppercase">
								Ingresa tu email para recibir un enlace de recuperación.
							</p>

							{!sent ? (
								<form onSubmit={handleReset} className="space-y-6">
									<div>
										<label className="block text-xs font-black uppercase mb-2">
											Email_Asociado
										</label>
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="w-full bg-slate-100 border-2 border-black p-3 font-bold focus:bg-white focus:outline-none focus:border-primary transition-colors"
											placeholder="root@dominio.com"
										/>
									</div>
									<button
										type="submit"
										disabled={loading}
										className="w-full bg-black text-white font-black uppercase py-4 border-2 border-transparent retro-btn hover:bg-primary hover:text-black hover:border-black transition-colors disabled:opacity-50"
									>
										{loading ? "Enviando..." : "Enviar Señal →"}
									</button>
								</form>
							) : (
								<div className="bg-primary/20 border-2 border-primary p-4 text-center">
									<span className="material-symbols-outlined text-4xl text-primary mb-2">
										mark_email_read
									</span>
									<h3 className="font-black uppercase mb-1">
										Enlace Transmitido
									</h3>
									<p className="text-xs font-bold uppercase text-slate-800">
										Revisa tu bandeja de entrada (y spam).
									</p>
								</div>
							)}

							<div className="mt-8 pt-6 border-t-2 border-slate-200 text-center">
								<Link
									href="/login"
									className="text-sm font-bold uppercase hover:text-primary transition-colors hover:underline"
								>
									Abortar y volver a Login
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
