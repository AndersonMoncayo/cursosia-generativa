import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { UserListClient } from "./UserListClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsuariosPage() {
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
	const { data: users } = await adminClient
		.from("profiles")
		.select("id, email, role, created_at, full_name")
		.order("created_at", { ascending: false });

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
			<header
				className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
				data-purpose="admin-header"
			>
				<div>
					<h2
						className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter"
						style={{ textShadow: "4px 4px 0px #000" }}
					>
						GESTION_USUARIOS
					</h2>
					<p className="text-white mt-2 font-mono bg-black inline-block px-2 py-1">
						ADMIN_PANEL &gt; USERS_MODULE
					</p>
				</div>
				<div className="bg-primary text-black p-4 neo-border flex flex-col items-center min-w-[160px]">
					<span className="text-xs font-bold uppercase">Total Usuarios</span>
					<span className="text-4xl font-black">{users?.length || 0}</span>
				</div>
			</header>

			<UserListClient initialUsers={users || []} currentUser={user.id} />
		</div>
	);
}
