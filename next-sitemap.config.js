/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://cursosia-generativa.vercel.app",
	generateRobotsTxt: false,
	exclude: [
		"/login",
		"/login/*",
		"/register",
		"/register/*",
		"/forgot-password",
		"/forgot-password/*",
		"/dashboard",
		"/dashboard/*",
		"/admin",
		"/admin/*",
		"/checkout",
		"/checkout/*",
	],
	changefreq: "weekly",
	priority: 0.7,
};
