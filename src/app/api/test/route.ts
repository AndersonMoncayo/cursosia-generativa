export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
	const supabaseAdmin = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);

	const { data: cData, error: cErr } = await supabaseAdmin
		.from("courses")
		.select("*")
		.limit(1);
	const { data: pData, error: pErr } = await supabaseAdmin
		.from("posts")
		.select("*")
		.limit(1);

	return NextResponse.json({
		courses: cErr
			? cErr.message
			: cData && cData.length > 0
				? Object.keys(cData[0])
				: "no records",
		posts: pErr
			? pErr.message
			: pData && pData.length > 0
				? Object.keys(pData[0])
				: "no records",
	});
}
