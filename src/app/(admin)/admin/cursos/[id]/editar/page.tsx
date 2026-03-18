import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "../../CourseForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditarCursoPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
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

	const { id } = await params;

	const adminClient = createAdminClient();
	const { data: course } = await adminClient
		.from("courses")
		.select("*")
		.eq("id", id)
		.single();

	if (!course) {
		redirect("/admin/cursos");
	}

	return (
		<div className="pb-12">
			<div className="mb-6">
				<Link
					href="/admin/cursos"
					className="text-white hover:text-primary font-bold text-sm tracking-widest flex items-center gap-2 w-fit"
				>
					← VOLVER A CURSOS
				</Link>
			</div>
			<header className="mb-12" data-purpose="main-header">
				<h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
					EDITAR_CURSO
				</h1>
				<div className="flex items-center mt-2">
					<span className="text-sm font-bold tracking-[0.2em] text-gray-400">
						UPDATE LOGIC NODE
					</span>
					<div className="h-[2px] flex-1 bg-yellow-500 ml-4"></div>
				</div>
			</header>

			<CourseForm course={course} />
		</div>
	);
}
