import { BookOpen, CreditCard, Play } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/atoms/LogoutButton";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Fetch enrollments
	const { data: enrollments } = await supabase
		.from("enrollments")
		.select("*, courses(*)")
		.eq("user_id", user.id);

	return (
		<div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-8 border-primary pb-8 gap-6">
					<div>
						<h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-4">
							HOLA, <span className="text-primary italic">ESTUDIANTE</span>
						</h1>
						<div className="flex flex-col md:flex-row gap-4">
							<div className="inline-flex items-center gap-3 bg-black border-4 border-primary px-4 py-2 retro-shadow text-primary font-mono text-sm uppercase">
								<span>SYS.USER:</span>
								<span className="text-white font-black">{user.email}</span>
							</div>
							<div className="inline-flex items-center gap-3 bg-black border-4 border-slate-700 px-4 py-2 retro-shadow text-slate-400 font-mono text-sm uppercase">
								<span>REGISTRADO:</span>
								<span className="text-white font-black">
									{new Date(user.created_at).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					{/* Main Content: Enrollments */}
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-black uppercase text-white mb-6 flex items-center gap-3">
							<BookOpen className="text-primary w-6 h-6" /> MIS MÓDULOS ACTIVOS
						</h2>

						{!enrollments || enrollments.length === 0 ? (
							<div className="bg-black border-4 border-slate-700 p-12 text-center relative overflow-hidden group">
								<div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
								<h3 className="text-2xl font-black text-white uppercase mb-4 tracking-widest relative z-10">
									NO TIENES CURSOS INSCRITOS
								</h3>
								<p className="text-slate-400 font-bold mb-8 relative z-10">
									El sistema no detecta módulos activos en tu terminal.
								</p>
								<Link
									href="/cursos"
									className="bg-primary text-black font-black px-8 py-4 uppercase border-4 border-black inline-block retro-shadow retro-btn hover:bg-white transition-colors relative z-10"
								>
									EXPLORAR CATÁLOGO
								</Link>
							</div>
						) : (
							<div className="space-y-6">
								{enrollments.map((enr: any) => (
									<div
										key={enr.id}
										className="bg-white border-4 border-black p-6 retro-shadow-lg flex flex-col md:flex-row items-center gap-6 group hover:-translate-y-1 transition-transform"
									>
										{enr.courses.thumbnail_url ? (
											<div className="w-full md:w-48 h-32 bg-slate-200 border-4 border-black overflow-hidden relative">
												<img
													src={enr.courses.thumbnail_url}
													alt={enr.courses.title}
													className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
												/>
											</div>
										) : (
											<div className="w-full md:w-48 h-32 bg-primary border-4 border-black flex items-center justify-center relative">
												<span className="font-black text-2xl uppercase tracking-tighter text-black">
													MOD
												</span>
											</div>
										)}

										<div className="flex-1 w-full">
											<div className="flex justify-between items-start mb-2">
												<h3 className="text-2xl font-black text-black uppercase tracking-tight">
													{enr.courses.title}
												</h3>
											</div>
											<div className="mb-6">
												<div className="flex justify-between text-xs font-black uppercase text-slate-500 mb-2">
													<span>PROGRESO</span>
													<span>{enr.progress}%</span>
												</div>
												<div className="h-3 w-full bg-slate-200 border-2 border-black p-px">
													<div
														className="h-full bg-primary"
														style={{ width: `${enr.progress}%` }}
													></div>
												</div>
											</div>
											<Link
												href={`/dashboard/curso/${enr.courses.slug}`}
												className="bg-black text-white font-black px-6 py-3 uppercase border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors flex items-center justify-center gap-2 w-full md:w-auto inline-flex"
											>
												<Play className="w-4 h-4" /> CONTINUAR MÓDULO
											</Link>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Sidebar: Quick Links */}
					<div className="lg:col-span-1 space-y-6">
						<h2 className="text-2xl font-black uppercase text-white mb-6">
							ACCESOS RÁPIDOS
						</h2>

						<Link
							href="/cursos"
							className="bg-background-dark border-4 border-slate-700 p-6 flex items-center gap-4 group retro-shadow block hover:border-primary transition-colors hover:bg-[#1acb5b]"
						>
							<div className="w-12 h-12 bg-black flex items-center justify-center text-primary group-hover:text-white transition-colors">
								<BookOpen className="w-6 h-6" />
							</div>
							<div>
								<h3 className="font-black text-white group-hover:text-black uppercase text-lg transition-colors">
									CATÁLOGO
								</h3>
							</div>
						</Link>

						<Link
							href="/precios"
							className="bg-background-dark border-4 border-slate-700 p-6 flex items-center gap-4 group retro-shadow block hover:border-primary transition-colors hover:bg-[#1acb5b]"
						>
							<div className="w-12 h-12 bg-black flex items-center justify-center text-primary group-hover:text-white transition-colors">
								<CreditCard className="w-6 h-6" />
							</div>
							<div>
								<h3 className="font-black text-white group-hover:text-black uppercase text-lg transition-colors">
									PRECIOS
								</h3>
							</div>
						</Link>

						<Link
							href="/blog"
							className="bg-background-dark border-4 border-slate-700 p-6 flex items-center gap-4 group retro-shadow block hover:border-primary transition-colors hover:bg-[#1acb5b]"
						>
							<div className="w-12 h-12 bg-black flex items-center justify-center text-primary group-hover:text-white transition-colors">
								<BookOpen className="w-6 h-6" />
							</div>
							<div>
								<h3 className="font-black text-white group-hover:text-black uppercase text-lg transition-colors">
									BLOG
								</h3>
							</div>
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
