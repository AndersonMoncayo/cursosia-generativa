"use client";

import {
	BarChart2,
	BookOpen,
	FileText,
	LayoutDashboard,
	Menu,
	Settings,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ href: "/admin", label: "DASHBOARD", icon: LayoutDashboard },
	{ href: "/admin/cursos", label: "CURSOS", icon: BookOpen },
	{ href: "/admin/usuarios", label: "USUARIOS", icon: Users },
	{ href: "/admin/estadisticas", label: "ESTADÍSTICAS", icon: BarChart2 },
	{ href: "/admin/posts", label: "BLOG", icon: FileText },
];

interface AdminLayoutProps {
	children: ReactNode;
}

function SidebarContent({
	pathname,
	onClose,
}: {
	pathname: string;
	onClose?: () => void;
}) {
	return (
		<div className="h-full flex flex-col bg-black border-r-2 border-[#1acb5b]">
			{/* Logo */}
			<div className="p-4 border-b-2 border-[#1acb5b]">
				<div className="flex items-center justify-between">
					<Link
						href="/admin"
						className="text-lg font-black uppercase tracking-widest text-[#1acb5b]"
					>
						ADMIN.SYS
					</Link>
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							aria-label="Cerrar menú"
							className="text-white hover:text-[#1acb5b] p-1 lg:hidden"
						>
							<X size={20} />
						</button>
					)}
				</div>
			</div>

			{/* Nav */}
			<nav className="flex-1 p-3 space-y-1 overflow-y-auto">
				{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
					const active =
						pathname === href ||
						(href !== "/admin" && pathname.startsWith(href));
					return (
						<Link
							key={href}
							href={href}
							onClick={onClose}
							className={cn(
								"flex items-center gap-3 px-3 py-3 text-sm font-bold uppercase tracking-wide transition-all border-2",
								active
									? "bg-[#1acb5b] text-black border-black shadow-[3px_3px_0px_#1acb5b88]"
									: "text-gray-400 border-transparent hover:text-white hover:border-[#1acb5b] hover:px-5",
							)}
						>
							<Icon size={16} />
							{label}
						</Link>
					);
				})}
			</nav>

			{/* Settings */}
			<div className="p-3 border-t-2 border-[#1acb5b]">
				<Link
					href="/admin/settings"
					className="flex items-center gap-3 px-3 py-3 text-sm font-bold uppercase tracking-wide text-gray-400 border-2 border-transparent hover:text-white hover:border-[#1acb5b] transition-all"
				>
					<Settings size={16} />
					AJUSTES
				</Link>
			</div>
		</div>
	);
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const pathname = usePathname();
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<>
			<div className="min-h-screen bg-[#1a1a1a] text-white font-[Space_Grotesk,sans-serif] flex">
				{/* Sidebar — fixed desktop, hidden mobile */}
				<aside className="hidden lg:flex w-60 shrink-0 h-screen sticky top-0">
					<SidebarContent pathname={pathname} />
				</aside>

				{/* Mobile drawer overlay */}
				{drawerOpen && (
					<div
						className="fixed inset-0 bg-black/80 z-40 lg:hidden"
						onClick={() => setDrawerOpen(false)}
						role="presentation"
					/>
				)}

				{/* Mobile drawer */}
				<aside
					className={cn(
						"fixed left-0 top-0 h-full w-72 z-50 lg:hidden transition-transform duration-200",
						drawerOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<SidebarContent
						pathname={pathname}
						onClose={() => setDrawerOpen(false)}
					/>
				</aside>

				{/* Main content */}
				<div className="flex-1 flex flex-col min-w-0">
					{/* Mobile header */}
					<header className="lg:hidden flex items-center justify-between px-4 py-3 bg-black border-b-2 border-[#1acb5b]">
						<button
							type="button"
							onClick={() => setDrawerOpen(true)}
							aria-label="Abrir menú"
							className="text-[#1acb5b] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
						>
							<Menu size={22} />
						</button>
						<span className="text-sm font-black uppercase tracking-widest text-[#1acb5b]">
							ADMIN.SYS
						</span>
						<div className="w-10" />
					</header>

					<main className="flex-1 p-4 md:p-6 overflow-x-hidden">
						{children}
					</main>
				</div>
			</div>
			<Toaster
				position="top-right"
				toastOptions={{
					style: {
						background: "#1a1a1a",
						color: "#ffffff",
						border: "2px solid #1acb5b",
						fontFamily: "Space Grotesk",
						fontWeight: "bold",
					},
					success: {
						iconTheme: { primary: "#1acb5b", secondary: "#000" },
					},
					error: {
						iconTheme: { primary: "#ff4444", secondary: "#000" },
					},
				}}
			/>
		</>
	);
}
