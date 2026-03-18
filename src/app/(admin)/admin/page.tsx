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
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Stat Card 1 */}
				<div className="brutalist-border p-6 bg-[#0a0a0a]">
					<p className="text-zinc-400 font-bold text-xs tracking-widest">TOTAL INCOME</p>
					{/* Dato simulado hasta tener tabla de pagos */}
					<h3 className="text-3xl font-black text-white mt-2">$0.00</h3>
					<p className="text-zinc-500 text-xs mt-1">&apos;this month&apos;</p>
				</div>
				{/* Stat Card 2 */}
				<div className="brutalist-border p-6 bg-[#0a0a0a]">
					<p className="text-zinc-400 font-bold text-xs tracking-widest">ACTIVE USERS</p>
					<h3 className="text-3xl font-black text-white mt-2">{totalUsers || 0}</h3>
					<p className="text-zinc-500 text-xs mt-1">&apos;registered&apos;</p>
				</div>
				{/* Stat Card 3 */}
				<div className="brutalist-border p-6 bg-[#0a0a0a]">
					<p className="text-zinc-400 font-bold text-xs tracking-widest">PUBLISHED COURSES</p>
					<h3 className="text-3xl font-black text-white mt-2">{totalCourses || 0}</h3>
					<p className="text-zinc-500 text-xs mt-1">&apos;in catalog&apos;</p>
				</div>
				{/* Stat Card 4 */}
				<div className="brutalist-border p-6 bg-[#0a0a0a]">
					<p className="text-zinc-400 font-bold text-xs tracking-widest">SALES TODAY</p>
					<h3 className="text-3xl font-black text-white mt-2">0</h3>
					<p className="text-zinc-500 text-xs mt-1">&apos;transactions&apos;</p>
				</div>
			</div>
			{/* END: StatCardsGrid */}

			{/* BEGIN: RecentCoursesSection */}
			<div className="brutalist-border p-6 bg-[#0a0a0a]">
				<h4 className="font-bold text-xs tracking-widest text-primary mb-4">RECENT_COURSES</h4>
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b-2 border-zinc-800">
							<th className="text-left py-2 text-zinc-400 font-bold text-xs tracking-widest">Title</th>
							<th className="text-left py-2 text-zinc-400 font-bold text-xs tracking-widest">Level</th>
							<th className="text-left py-2 text-zinc-400 font-bold text-xs tracking-widest">Price</th>
							<th className="text-left py-2 text-zinc-400 font-bold text-xs tracking-widest">Status</th>
							<th className="text-left py-2 text-zinc-400 font-bold text-xs tracking-widest">Actions</th>
						</tr>
					</thead>
					<tbody>
						{recentCourses?.map((course) => (
							<tr key={course.id} className="border-b border-zinc-800 hover:bg-zinc-900 transition-colors">
								<td className="py-3 text-white font-bold">{course.title}</td>
								<td className="py-3 text-zinc-400">{course.level}</td>
								<td className="py-3 text-white">${course.price}</td>
								<td className="py-3">
									{course.is_published ? (
										<span className="px-2 py-1 text-[10px] font-bold tracking-widest bg-primary text-black brutalist-border">
											PUBLISHED
										</span>
									) : (
										<span className="px-2 py-1 text-[10px] font-bold tracking-widest bg-zinc-700 text-zinc-300 brutalist-border">
											DRAFT
										</span>
									)}
								</td>
								<td className="py-3">
									<Link href={`/admin/cursos/${course.id}`} className="text-primary font-bold text-xs hover:underline mr-3">EDIT</Link>
									<Link href={`/cursos/${course.slug}`} className="text-zinc-400 font-bold text-xs hover:underline">VIEW</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* END: RecentCoursesSection */}

			{/* BEGIN: RecentActivitySection */}
			<div className="brutalist-border p-6 bg-[#0a0a0a]">
				<h4 className="font-bold text-xs tracking-widest text-primary mb-4">RECENT_USERS</h4>
				<ul className="space-y-2">
					{recentActivity?.map((user) => (
						<li key={user.id} className="flex items-center justify-between py-2 border-b border-zinc-800">
							<span className="text-white text-sm">User registration: {user.email}</span>
							<span className="text-zinc-500 text-xs">
								{new Date(user.created_at).toLocaleString()}
							</span>
						</li>
					))}
				</ul>
				<Link href="/admin/usuarios" className="mt-4 inline-block text-primary font-bold text-xs tracking-widest hover:underline">
					VIEW_ALL_USERS
				</Link>
			</div>
			{/* END: RecentActivitySection */}
		</div>
	);
}
