import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

async function check() {
	try {
		const { data: cData, error: cErr } = await supabaseAdmin
			.from("courses")
			.select("*")
			.limit(1);
		if (cErr) console.error("Courses error:", cErr.message);
		else
			console.log(
				"Courses columns:",
				cData && cData.length > 0 ? Object.keys(cData[0]) : "no records",
			);

		const { data: pData, error: pErr } = await supabaseAdmin
			.from("posts")
			.select("*")
			.limit(1);
		if (pErr) console.error("Posts error:", pErr.message);
		else
			console.log(
				"Posts columns:",
				pData && pData.length > 0 ? Object.keys(pData[0]) : "no records",
			);
	} catch (e: any) {
		console.error("Fatal error:", e.message);
	}
}
check();
