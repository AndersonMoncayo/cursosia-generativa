import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CourseListClient } from "./CourseListClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCursosPage() {
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
	const { data: courses } = await adminClient
		.from("courses")
		.select("id, title, slug, level, price, is_published, created_at")
		.is("deleted_at", null)
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
			{/* BEGIN: Header */}
			<header
				className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-6"
				data-purpose="page-header"
			>
				<div>
					<h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">
						GESTION_CURSOS
					</h1>
					<div className="h-2 w-32 bg-primary mt-2"></div>
				</div>
				<Link
					href="/admin/cursos/nuevo"
					className="neo-border bg-primary text-black font-black px-6 py-4 text-sm lg:text-xl neo-shadow neo-button flex items-center justify-center gap-2"
				>
					<span>+</span> NUEVO CURSO
				</Link>
			</header>
			{/* END: Header */}

			<CourseListClient initialCourses={courses || []} />
		</div>
	);
}
