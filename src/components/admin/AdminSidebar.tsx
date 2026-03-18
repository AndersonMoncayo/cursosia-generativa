"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
	const pathname = usePathname();

	const navItems = [
		{ name: "RESUMEN", href: "/admin" },
		{ name: "CURSOS", href: "/admin/cursos" },
		{ name: "USUARIOS", href: "/admin/usuarios" },
		{ name: "POSTS", href: "/admin/posts" },
		{ name: "ESTADISTICAS", href: "/admin/estadisticas" },
		{ name: "CONFIGURACION", href: "/admin/configuracion" },
	];

	return (
		<aside className="w-[200px] bg-[#0a0a0a] brutalist-border border-l-0 border-t-0 border-b-0 min-h-screen flex flex-col fixed left-0 top-0 z-50">
			<div
				className="p-6 border-b-4 border-black"
				data-purpose="sidebar-header"
			>
				<h1 className="text-primary font-bold text-xs tracking-widest">
					ADMIN_PANEL //
				</h1>
				<p className="text-white text-sm font-bold mt-1">cursosia-generativa</p>
				<div className="flex items-center gap-2 mt-4">
					<span className="w-2 h-2 bg-primary animate-pulse"></span>
					<span className="text-[10px] text-primary font-bold tracking-tighter">
						SYSTEM ACTIVE
					</span>
				</div>
			</div>

			<nav
				className="flex-1 mt-6 px-4 space-y-2"
				data-purpose="sidebar-navigation"
			>
				{navItems.map((item) => {
					const isActive =
						item.href === "/admin"
							? pathname === "/admin"
							: pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`block px-4 py-3 brutalist-border text-sm font-bold transition-all ${
								isActive
									? "bg-[#1acb5b] text-[#000000] brutalist-shadow"
									: "text-white hover:bg-zinc-800"
							}`}
						>
							{item.name}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t-4 border-black">
				<Link
					href="/dashboard"
					className="block w-full px-4 py-3 brutalist-border text-sm font-bold text-white hover:bg-zinc-800 transition-all text-center"
				>
					← DASHBOARD
				</Link>
			</div>
		</aside>
	);
}
