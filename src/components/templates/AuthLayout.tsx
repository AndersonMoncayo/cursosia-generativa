import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
	return (
		<div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center px-4 font-[Space_Grotesk,sans-serif]">
			{/* Grid overlay */}
			<div
				className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="relative z-10 w-full max-w-md">
				{/* Logo */}
				<div className="mb-8 text-center">
					<Link href="/" className="inline-block">
						<span className="text-2xl font-black text-[#1acb5b] uppercase tracking-widest">
							CursosIA
						</span>
						<span className="text-2xl font-black text-white uppercase tracking-widest">
							{" "}
							Generativa
						</span>
					</Link>
				</div>

				{/* Card */}
				<div className="bg-[#111] border-2 border-black shadow-[6px_6px_0px_#1acb5b]">
					{/* OS Window Bar */}
					<div className="flex items-center justify-between px-3 py-2 bg-black border-b-2 border-black">
						<span className="text-xs font-bold uppercase tracking-widest text-[#1acb5b]">
							{title ?? "AUTH.SYS"}
						</span>
						<div className="flex gap-1">
							<div className="w-3 h-3 bg-yellow-400 border border-black" />
							<div className="w-3 h-3 bg-[#1acb5b] border border-black" />
							<div className="w-3 h-3 bg-red-500 border border-black" />
						</div>
					</div>

					<div className="p-6">
						{subtitle && (
							<p className="text-gray-400 text-sm mb-6">{subtitle}</p>
						)}
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
