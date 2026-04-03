export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://snaplist-ai-beta.vercel.app";

  const pages = [
    { path: "/", priority: "1.0", freq: "weekly" },
    { path: "/generate", priority: "0.9", freq: "weekly" },
    { path: "/bulk", priority: "0.8", freq: "monthly" },
    { path: "/checkout", priority: "0.7", freq: "monthly" },
    { path: "/blog", priority: "0.8", freq: "weekly" },
    { path: "/price-check", priority: "0.85", freq: "weekly" },
    { path: "/fee-calculator", priority: "0.85", freq: "monthly" },
    { path: "/blog/how-to-price-items-on-ebay", priority: "0.9", freq: "monthly" },
    { path: "/blog/how-to-write-ebay-listings-faster", priority: "0.8", freq: "monthly" },
    { path: "/blog/ebay-title-formula", priority: "0.7", freq: "monthly" },
    { path: "/blog/poshmark-listing-tips", priority: "0.7", freq: "monthly" },
    { path: "/blog/best-ai-tools-for-ebay-sellers", priority: "0.9", freq: "monthly" },
    { path: "/blog/how-to-sell-on-poshmark-fast", priority: "0.85", freq: "monthly" },
    { path: "/tools", priority: "0.85", freq: "monthly" },
    { path: "/relist", priority: "0.85", freq: "monthly" },
    { path: "/poshmark", priority: "0.9", freq: "monthly" },
    { path: "/blog/poshmark-listing-generator-free", priority: "0.9", freq: "monthly" },
    { path: "/privacy", priority: "0.3", freq: "yearly" },
    { path: "/terms", priority: "0.3", freq: "yearly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
