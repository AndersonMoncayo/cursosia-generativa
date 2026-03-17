/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://cursosia-generativa.vercel.app',
  generateRobotsTxt: false,
  exclude: ['/dashboard', '/dashboard/*', '/admin', '/admin/*', '/login'],
  changefreq: 'weekly',
  priority: 0.7,
}
