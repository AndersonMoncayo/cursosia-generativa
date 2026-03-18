const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const envFile = fs.readFileSync(".env.local", "utf8");
const env = envFile.split("\n").reduce((acc, line) => {
	const match = line.match(/^([^=]+)=(.*)$/);
	if (match) acc[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
	return acc;
}, {});

const supabaseAdmin = createClient(
	env.NEXT_PUBLIC_SUPABASE_URL,
	env.SUPABASE_SERVICE_ROLE_KEY,
);

async function check() {
	const { data: cData, error: cErr } = await supabaseAdmin
		.from("courses")
		.select("*")
		.limit(1);
	console.log(
		"Courses columns:",
		cData && cData.length > 0 ? Object.keys(cData[0]) : cErr,
	);

	const { data: pData, error: pErr } = await supabaseAdmin
		.from("posts")
		.select("*")
		.limit(1);
	console.log(
		"Posts columns:",
		pData && pData.length > 0 ? Object.keys(pData[0]) : pErr,
	);
}
check();
