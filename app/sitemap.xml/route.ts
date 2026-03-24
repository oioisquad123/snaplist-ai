export function GET() {
  const baseUrl = "https://snaplistai.com";
  const pages = ["/", "/generate", "/checkout", "/privacy", "/terms"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>${page === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${page === "/" ? "1.0" : page === "/generate" ? "0.9" : "0.5"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
