import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPostsPage() {
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
	const { data: posts } = await adminClient
		.from("posts")
		.select("id, title, created_at, is_published")
		.order("created_at", { ascending: false });

	const activePosts = posts?.filter((p) => p.is_published).length || 0;
	const draftPosts = posts?.filter((p) => !p.is_published).length || 0;

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
				className="flex flex-col md:flex-row justify-between md:items-center mb-12 bg-white text-black p-6 brutalist-border brutalist-shadow"
				data-purpose="content-header"
			>
				<div className="flex items-center gap-4 mb-4 md:mb-0">
					<div className="flex gap-2">
						<div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black"></div>
						<div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black"></div>
						<div className="w-4 h-4 rounded-full bg-primary border-2 border-black"></div>
					</div>
					<h2 className="text-3xl font-bold tracking-tighter italic">
						GESTION_POSTS
					</h2>
				</div>
				<Link
					href="/admin/posts/nuevo"
					className="bg-primary px-6 py-3 font-bold brutalist-border brutalist-shadow hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
				>
					<span className="text-2xl">+</span> NUEVO POST
				</Link>
			</header>
			{/* END: Header Section */}

			{/* BEGIN: Posts Table Container */}
			<section
				className="bg-white brutalist-border brutalist-shadow overflow-hidden"
				data-purpose="posts-management"
			>
				{/* OS Window Bar */}
				<div className="bg-black text-primary px-4 py-2 flex justify-between items-center text-xs font-mono">
					<span>POST_MANAGER_V1.0.EXE</span>
					<span>ITEMS: {posts?.length || 0}</span>
				</div>

				<div className="overflow-x-auto">
					<table
						className="w-full text-left border-collapse min-w-[600px]"
						id="posts-table"
					>
						<thead className="bg-gray-100 border-b-4 border-black">
							<tr className="text-black uppercase text-sm">
								<th className="p-4 border-r-4 border-black">ID</th>
								<th className="p-4 border-r-4 border-black">TITLE</th>
								<th className="p-4 border-r-4 border-black">DATE</th>
								<th className="p-4 border-r-4 border-black">STATUS</th>
								<th className="p-4 text-center">ACTIONS</th>
							</tr>
						</thead>
						<tbody className="text-black font-medium">
							{posts?.map((post) => (
								<tr
									key={post.id}
									className="border-b-4 border-black hover:bg-primary/10 transition-colors"
								>
									<td className="p-4 border-r-4 border-black font-mono text-xs">
										{post.id.substring(0, 6)}...
									</td>
									<td className="p-4 border-r-4 border-black truncate max-w-[200px] md:max-w-xs">
										{post.title}
									</td>
									<td className="p-4 border-r-4 border-black">
										{new Date(post.created_at).toISOString().split("T")[0]}
									</td>
									<td className="p-4 border-r-4 border-black">
										{post.is_published ? (
											<span className="border-2 border-black font-bold px-2 py-0.5 uppercase text-xs bg-primary">
												PUBLISHED
											</span>
										) : (
											<span className="border-2 border-black font-bold px-2 py-0.5 uppercase text-xs bg-yellow-400">
												DRAFT
											</span>
										)}
									</td>
									<td className="p-4 flex gap-2 justify-center">
										<button
											className="p-1 border-2 border-black bg-white hover:bg-yellow-400 transition-colors"
											title="Edit"
										>
											✎
										</button>
										<button
											className="p-1 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors"
											title="Delete"
										>
											✕
										</button>
									</td>
								</tr>
							))}
							{(!posts || posts.length === 0) && (
								<tr>
									<td
										colSpan={5}
										className="p-8 text-center text-gray-500 font-bold uppercase italic cursor-default"
									>
										NO HAY POSTS PUBLICADOS AÚN
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Table Footer */}
				<div
					className="bg-black text-white p-4 flex justify-between items-center"
					data-purpose="table-pagination"
				>
					<span className="font-mono text-sm">
						TOTAL_ITEMS: {posts?.length || 0}
					</span>
					<div className="flex gap-2">
						<button className="px-3 py-1 bg-primary text-black font-bold border-2 border-white hover:bg-white transition-colors">
							PREV
						</button>
						<button className="px-3 py-1 bg-primary text-black font-bold border-2 border-white hover:bg-white transition-colors">
							NEXT
						</button>
					</div>
				</div>
			</section>
			{/* END: Posts Table Container */}

			{/* BEGIN: Quick Stats */}
			<section
				className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
				data-purpose="dashboard-widgets"
			>
				<div className="bg-primary p-6 brutalist-border brutalist-shadow text-black">
					<p className="text-xs font-bold uppercase">Publicaciones Activas</p>
					<h3 className="text-5xl font-bold">{activePosts}</h3>
				</div>
				<div className="bg-white p-6 brutalist-border brutalist-shadow text-black">
					<p className="text-xs font-bold uppercase">Lecturas Totales (24h)</p>
					<h3 className="text-5xl font-bold">1.2k</h3>
				</div>
				<div className="bg-yellow-400 p-6 brutalist-border brutalist-shadow text-black">
					<p className="text-xs font-bold uppercase">Borradores Pendientes</p>
					<h3 className="text-5xl font-bold">{draftPosts}</h3>
				</div>
			</section>
			{/* END: Quick Stats */}
		</div>
	);
}
