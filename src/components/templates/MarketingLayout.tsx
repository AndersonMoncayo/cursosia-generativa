import type { ReactNode } from "react";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";

interface MarketingLayoutProps {
	children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
	return (
		<div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col font-[Space_Grotesk,sans-serif]">
			{/* Grid overlay pattern */}
			<div
				className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
			<Navbar />
			<main className="relative z-10 flex-1">{children}</main>
			<Footer />
		</div>
	);
}
