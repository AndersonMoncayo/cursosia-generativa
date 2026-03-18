import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "../CourseForm";

export const dynamic = "force-dynamic";

export default async function NuevoCursoPage() {
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

	return (
		<div className="max-w-5xl mx-auto pb-12">
			<header className="mb-12" data-purpose="main-header">
				<h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
					NUEVO_CURSO
				</h1>
				<div className="flex items-center mt-2">
					<span className="text-sm font-bold tracking-[0.2em] text-gray-400">
						CREATE LEARNING NODE
					</span>
					<div className="h-[2px] flex-1 bg-primary ml-4"></div>
				</div>
			</header>

			<CourseForm />
		</div>
	);
}
