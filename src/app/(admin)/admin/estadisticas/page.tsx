import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEstadisticasPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "admin" && profile?.role !== "superadmin") {
		redirect("/cursos");
	}

	const adminClient = createAdminClient();
	const { data: purchases } = await adminClient
		.from("purchases")
		.select("amount, created_at, course_id")
		.order("created_at", { ascending: false })
		.limit(100);

	const totalIncome =
		purchases?.reduce((acc, p) => acc + Number(p.amount || 0), 0) || 0;
	const totalSales = purchases?.length || 0;
	const avgTicket = totalSales > 0 ? totalIncome / totalSales : 0;

	// Group by course_id to get top courses
	const courseCounts = purchases?.reduce((acc: any, p) => {
		if (!acc[p.course_id]) acc[p.course_id] = { count: 0, income: 0 };
		acc[p.course_id].count += 1;
		acc[p.course_id].income += Number(p.amount || 0);
		return acc;
	}, {});

	const topCourses = Object.entries(courseCounts || {})
		.map(([id, stats]: [string, any]) => ({
			id,
			count: stats.count,
			income: stats.income,
			conversion: (stats.count / totalSales) * 100, // Rough percentage of total sales
		}))
		.sort((a, b) => b.income - a.income)
		.slice(0, 5);

	return (
		<div className="pb-12">
			<div className="mb-6">
				<Link
					href="/admin"
					className="text-white hover:text-primary font-bold text-sm tracking-widest flex items-center gap-2 w-fit"
				>
					← VOLVER AL DASHBOARD
				</Link>
			</div>
			{/* BEGIN: Header Section */}
			<header
				className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
				data-purpose="main-header"
			>
				<div>
					<h2 className="text-4xl font-black uppercase tracking-tighter bg-white text-black px-4 py-2 brutalist-border inline-block brutalist-shadow">
						ESTADISTICAS_SISTEMA
					</h2>
					<p className="mt-2 text-zinc-400 font-mono tracking-widest text-sm uppercase">
						&gt; REAL_TIME_DATA
					</p>
				</div>
				<div
					className="flex gap-2 bg-black p-2 brutalist-border"
					data-purpose="period-selector"
				>
					<button className="px-4 py-1 font-bold text-sm brutalist-border bg-zinc-800 hover:bg-primary hover:text-black transition-colors">
						7D
					</button>
					<button className="px-4 py-1 font-bold text-sm brutalist-border bg-primary text-black transition-colors">
						30D
					</button>
					<button className="px-4 py-1 font-bold text-sm brutalist-border bg-zinc-800 hover:bg-primary hover:text-black transition-colors">
						90D
					</button>
					<button className="px-4 py-1 font-bold text-sm brutalist-border bg-zinc-800 hover:bg-primary hover:text-black transition-colors">
						ALL
					</button>
				</div>
			</header>
			{/* END: Header Section */}

			{/* BEGIN: Metrics Grid */}
			<section
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
				data-purpose="metrics-dashboard"
			>
				<div className="bg-white p-6 brutalist-border brutalist-shadow text-black transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#000]">
					<p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">
						TOTAL INCOME
					</p>
					<p className="text-4xl font-black tracking-tighter">
						${totalIncome.toFixed(2)}
					</p>
					<div className="mt-4 flex items-center text-xs font-bold text-green-600 bg-green-100 w-fit px-2 py-1 brutalist-border">
						LIVE ↑
					</div>
				</div>

				<div className="bg-white p-6 brutalist-border brutalist-shadow text-black transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#000]">
					<p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">
						RECORDED PURCHASES
					</p>
					<p className="text-4xl font-black tracking-tighter">{totalSales}</p>
					<div className="mt-4 flex items-center text-xs font-bold text-green-600 bg-green-100 w-fit px-2 py-1 brutalist-border">
						LIVE ↑
					</div>
				</div>

				<div className="bg-white p-6 brutalist-border brutalist-shadow text-black transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#000]">
					<p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">
						COURSES SOLD
					</p>
					<p className="text-4xl font-black tracking-tighter">{totalSales}</p>
					<div className="mt-4 flex items-center text-xs font-bold text-blue-600 bg-blue-100 w-fit px-2 py-1 brutalist-border">
						~ ↓
					</div>
				</div>

				<div className="bg-white p-6 brutalist-border brutalist-shadow text-black transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#000]">
					<p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">
						AVG TICKET
					</p>
					<p className="text-4xl font-black tracking-tighter">
						${avgTicket.toFixed(2)}
					</p>
					<div className="mt-4 flex items-center text-xs font-bold text-green-600 bg-green-100 w-fit px-2 py-1 brutalist-border">
						LIVE ↑
					</div>
				</div>
			</section>
			{/* END: Metrics Grid */}

			{/* BEGIN: Income Chart Section */}
			<section className="mb-10" data-purpose="performance-chart">
				<div className="bg-[#0d0d0d] brutalist-border brutalist-shadow p-6">
					<div className="flex justify-between items-center mb-8">
						<h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
							<span className="w-4 h-4 bg-primary"></span>
							INGRESOS_MENSUALES
						</h3>
						<p className="text-xs font-mono text-zinc-500">
							CANVAS_RENDER_ACTIVE
						</p>
					</div>
					<div className="relative h-64 w-full bg-[#111] overflow-hidden flex items-end">
						<svg
							className="w-full h-full"
							preserveAspectRatio="none"
							viewBox="0 0 1000 200"
						>
							<line
								stroke="#222"
								strokeWidth="1"
								x1="0"
								x2="1000"
								y1="50"
								y2="50"
							></line>
							<line
								stroke="#222"
								strokeWidth="1"
								x1="0"
								x2="1000"
								y1="100"
								y2="100"
							></line>
							<line
								stroke="#222"
								strokeWidth="1"
								x1="0"
								x2="1000"
								y1="150"
								y2="150"
							></line>
							<path
								d="M0,200 L0,150 L100,160 L200,120 L300,140 L400,80 L500,100 L600,60 L700,90 L800,40 L900,60 L1000,20 L1000,200 Z"
								fill="#1acb5b"
								fillOpacity="0.15"
							></path>
							<path
								d="M0,150 L100,160 L200,120 L300,140 L400,80 L500,100 L600,60 L700,90 L800,40 L900,60 L1000,20"
								fill="none"
								stroke="#1acb5b"
								strokeLinecap="square"
								strokeLinejoin="miter"
								strokeWidth="4"
							></path>
						</svg>
						<div
							className="absolute inset-0 pointer-events-none opacity-20"
							style={{
								backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
								backgroundSize: "4px 4px",
							}}
						></div>
					</div>
					<div className="mt-4 flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">
						<span>01 OCT</span>
						<span>05 OCT</span>
						<span>10 OCT</span>
						<span>15 OCT</span>
						<span>20 OCT</span>
						<span>25 OCT</span>
						<span>30 OCT</span>
					</div>
				</div>
			</section>
			{/* END: Income Chart Section */}

			{/* BEGIN: Top Courses Table */}
			<section className="mb-10" data-purpose="rankings-table">
				<div className="bg-white text-black brutalist-border brutalist-shadow p-6">
					<h3 className="text-2xl font-black uppercase tracking-tighter mb-6 underline decoration-4 underline-offset-4">
						RANKING_CURSOS_TOP
					</h3>
					<div className="overflow-x-auto">
						<table
							className="w-full text-left border-collapse"
							id="rankings-table"
						>
							<thead>
								<tr className="border-b-4 border-black font-black uppercase text-sm tracking-widest">
									<th className="py-4 px-2">RANK</th>
									<th className="py-4 px-2">COURSE_ID</th>
									<th className="py-4 px-2">SALES</th>
									<th className="py-4 px-2">INCOME</th>
									<th className="py-4 px-2">SHARE OF TOTAL</th>
								</tr>
							</thead>
							<tbody className="font-bold">
								{topCourses.map((tc, idx) => (
									<tr
										key={tc.id}
										className={`border-b-2 border-zinc-200 ${idx === 0 ? "bg-primary text-black" : "hover:bg-zinc-100"}`}
									>
										<td className="py-4 px-2">
											#{String(idx + 1).padStart(2, "0")}
										</td>
										<td className="py-4 px-2 uppercase tracking-tight">
											{tc.id.substring(0, 16)}...
										</td>
										<td className="py-4 px-2">{tc.count}</td>
										<td className="py-4 px-2 font-black">
											${tc.income.toFixed(2)}
										</td>
										<td className="py-4 px-2">
											<div className="w-24 bg-black/10 h-6 border-2 border-black relative">
												<div
													className="absolute inset-y-0 left-0 bg-black"
													style={{ width: `${Math.min(tc.conversion, 100)}%` }}
												></div>
												<span
													className={`absolute inset-0 flex items-center justify-center text-[10px] ${tc.conversion > 40 ? "text-white" : idx === 0 ? "text-black" : "text-black"}`}
												>
													{tc.conversion.toFixed(1)}%
												</span>
											</div>
										</td>
									</tr>
								))}
								{topCourses.length === 0 && (
									<tr>
										<td
											colSpan={5}
											className="py-8 text-center text-gray-500 uppercase italic"
										>
											No hay compras registradas
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="mt-6 flex justify-end">
						<button className="bg-black text-white px-6 py-2 font-black uppercase tracking-widest text-xs brutalist-border hover:bg-primary hover:text-black transition-all brutalist-shadow active:translate-y-1 active:shadow-none">
							Ver_Informe_Completo_JSON
						</button>
					</div>
				</div>
			</section>
			{/* END: Top Courses Table */}
		</div>
	);
}
