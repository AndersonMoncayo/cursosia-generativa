import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
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

	const [
		{ count: totalUsers },
		{ count: totalCourses },
		{ data: recentCourses },
		{ data: recentActivity },
	] = await Promise.all([
		adminClient.from("profiles").select("*", { count: "exact", head: true }),
		adminClient
			.from("courses")
			.select("*", { count: "exact", head: true })
			.eq("is_published", true),
		adminClient
			.from("courses")
			.select("id, title, level, price, is_published, slug")
			.order("created_at", { ascending: false })
			.limit(5),
		adminClient
			.from("profiles")
			.select("id, email, created_at, role")
			.order("created_at", { ascending: false })
			.limit(5),
	]);

	return (
		<div className="space-y-8">
			{/* BEGIN: HeaderSection */}
			<header className="mb-10" data-purpose="main-header">
				<h2 className="text-3xl font-black text-white tracking-tighter">
					RESUMEN_SISTEMA
				</h2>
				<p className="text-primary font-bold text-sm tracking-widest mt-1">
					REAL-TIME METRICS
				</p>
				<div className="w-full h-1 bg-primary mt-4 brutalist-border border-none"></div>
			</header>
			{/* END: HeaderSection */}

			{/* BEGIN: StatCardsGrid */}
			<section
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
				data-purpose="stats-dashboard"
			>
				{/* Stat Card 1 */}
				<div className="bg-[#222222] brutalist-border brutalist-shadow">
					<div className="border-b-4 border-black px-3 py-1 flex items-center gap-1.5 os-bar">
						<div className="os-dot bg-[#ff5f57]"></div>
						<div className="os-dot bg-[#ffbd2e]"></div>
						<div className="os-dot bg-[#27c93f]"></div>
					</div>
					<div className="p-6">
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
							TOTAL INCOME
						</p>
						{/* Dato simulado hasta tener tabla de pagos, la instruccion mandó a cargar Users, Courses, y Activity */}
						<h3 className="text-3xl font-black text-white my-2">$0.00</h3>
						<p className="text-xs text-primary font-bold">'this month'</p>
					</div>
				</div>

				{/* Stat Card 2 */}
				<div className="bg-[#222222] brutalist-border brutalist-shadow">
					<div className="border-b-4 border-black px-3 py-1 flex items-center gap-1.5 os-bar">
						<div className="os-dot bg-[#ff5f57]"></div>
						<div className="os-dot bg-[#ffbd2e]"></div>
						<div className="os-dot bg-[#27c93f]"></div>
					</div>
					<div className="p-6">
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
							ACTIVE USERS
						</p>
						<h3 className="text-3xl font-black text-white my-2">
							{totalUsers || 0}
						</h3>
						<p className="text-xs text-primary font-bold">'registered'</p>
					</div>
				</div>

				{/* Stat Card 3 */}
				<div className="bg-[#222222] brutalist-border brutalist-shadow">
					<div className="border-b-4 border-black px-3 py-1 flex items-center gap-1.5 os-bar">
						<div className="os-dot bg-[#ff5f57]"></div>
						<div className="os-dot bg-[#ffbd2e]"></div>
						<div className="os-dot bg-[#27c93f]"></div>
					</div>
					<div className="p-6">
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
							PUBLISHED COURSES
						</p>
						<h3 className="text-3xl font-black text-white my-2">
							{totalCourses || 0}
						</h3>
						<p className="text-xs text-primary font-bold">'in catalog'</p>
					</div>
				</div>

				{/* Stat Card 4 */}
				<div className="bg-[#222222] brutalist-border brutalist-shadow">
					<div className="border-b-4 border-black px-3 py-1 flex items-center gap-1.5 os-bar">
						<div className="os-dot bg-[#ff5f57]"></div>
						<div className="os-dot bg-[#ffbd2e]"></div>
						<div className="os-dot bg-[#27c93f]"></div>
					</div>
					<div className="p-6">
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
							SALES TODAY
						</p>
						<h3 className="text-3xl font-black text-white my-2">0</h3>
						<p className="text-xs text-primary font-bold">'transactions'</p>
					</div>
				</div>
			</section>
			{/* END: StatCardsGrid */}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* BEGIN: RecentCoursesSection */}
				<section
					className="lg:col-span-2"
					data-purpose="courses-table-container"
				>
					<div className="flex items-center gap-2 mb-4">
						<div className="w-4 h-4 bg-primary brutalist-border border-2"></div>
						<h4 className="text-xl font-black text-white uppercase tracking-tight">
							RECENT_COURSES
						</h4>
					</div>
					<div className="bg-[#222222] brutalist-border brutalist-shadow overflow-hidden overflow-x-auto">
						<table className="w-full text-left" id="courses-table">
							<thead>
								<tr className="bg-zinc-800 border-b-4 border-black">
									<th className="p-4 text-xs font-black uppercase tracking-widest">
										Title
									</th>
									<th className="p-4 text-xs font-black uppercase tracking-widest">
										Level
									</th>
									<th className="p-4 text-xs font-black uppercase tracking-widest">
										Price
									</th>
									<th className="p-4 text-xs font-black uppercase tracking-widest">
										Status
									</th>
									<th className="p-4 text-xs font-black uppercase tracking-widest">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y-4 divide-black">
								{recentCourses?.map((course) => (
									<tr
										key={course.id}
										className="hover:bg-zinc-900 transition-colors hidden sm:table-row"
									>
										<td className="p-4 font-bold text-sm truncate max-w-[200px]">
											{course.title}
										</td>
										<td className="p-4 text-xs font-medium uppercase">
											{course.level}
										</td>
										<td className="p-4 font-black">${course.price}</td>
										<td className="p-4">
											{course.is_published ? (
												<span className="bg-primary text-black px-2 py-0.5 text-[10px] font-black brutalist-border border-2">
													PUBLISHED
												</span>
											) : (
												<span className="bg-zinc-600 text-white px-2 py-0.5 text-[10px] font-black brutalist-border border-2">
													DRAFT
												</span>
											)}
										</td>
										<td className="p-4 flex gap-2">
											<Link
												href={`/admin/cursos/${course.id}/editar`}
												className="bg-white text-black px-2 py-1 text-[10px] font-black brutalist-border border-2 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
											>
												EDIT
											</Link>
											<Link
												href={`/admin/cursos/${course.id}/contenido`}
												className="bg-zinc-700 text-white px-2 py-1 text-[10px] font-black brutalist-border border-2 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
											>
												VIEW
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
				{/* END: RecentCoursesSection */}

				{/* BEGIN: RecentActivitySection */}
				<section data-purpose="activity-log">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-4 h-4 bg-white brutalist-border border-2"></div>
						<h4 className="text-xl font-black text-white uppercase tracking-tight">
							RECENT_USERS
						</h4>
					</div>
					<div className="bg-[#222222] brutalist-border brutalist-shadow p-4">
						<ul className="space-y-6">
							{recentActivity?.map((user) => (
								<li key={user.id} className="flex items-start gap-3">
									<div
										className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${user.role === "admin" ? "bg-primary" : "bg-white"}`}
									></div>
									<div className="truncate">
										<p className="text-xs text-white font-bold leading-tight truncate">
											User registration: {user.email}
										</p>
										<p className="text-[10px] text-zinc-500 font-mono mt-1">
											{new Date(user.created_at).toLocaleString()}
										</p>
									</div>
								</li>
							))}
						</ul>
						<Link
							href="/admin/usuarios"
							className="block text-center w-full mt-6 py-2 brutalist-border border-2 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
						>
							VIEW_ALL_USERS
						</Link>
					</div>
				</section>
				{/* END: RecentActivitySection */}
			</div>
		</div>
	);
}
