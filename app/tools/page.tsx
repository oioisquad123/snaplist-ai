import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free eBay Seller Tools — SnapList AI",
  description:
    "Free tools for eBay sellers and Poshmark resellers. AI listing generator, price checker, fee calculator, bulk listing mode, and eBay CSV export. No signup required.",
  keywords:
    "free ebay seller tools, ebay listing generator, ebay price checker, ebay fee calculator, poshmark listing tool, reseller tools",
};

const tools = [
  {
    href: "/generate",
    emoji: "📸",
    name: "AI Listing Generator",
    tagline: "Photo → eBay/Poshmark listing in 10 seconds",
    description: "Upload 1-4 photos of any item. AI generates your title, description, price, category, and all item specifics instantly. Works for eBay and Poshmark.",
    cta: "Generate Free →",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    free: "3/day free",
  },
  {
    href: "/bulk",
    emoji: "⚡",
    name: "Bulk Listing Mode",
    tagline: "Process 10+ items in one session",
    description: "Drop photos for multiple items — AI processes them in a queue. Export to eBay File Exchange CSV for direct Seller Hub import. Pro feature.",
    cta: "Try Bulk Mode →",
    badge: "Pro",
    badgeColor: "bg-purple-100 text-purple-700",
    free: "Pro plan",
  },
  {
    href: "/price-check",
    emoji: "💰",
    name: "eBay Price Checker",
    tagline: "AI estimates sold comp prices instantly",
    description: "Type any item description and get a realistic price range (low/median/high) based on AI analysis of comparable sold listings. No eBay account needed.",
    cta: "Check Price →",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    free: "Always free",
  },
  {
    href: "/fee-calculator",
    emoji: "🧮",
    name: "eBay Fee Calculator",
    tagline: "See your real profit before you list",
    description: "Enter a sale price → instantly see eBay final value fees, payment processing, shipping estimate, and your actual profit. Also shows Poshmark fees side-by-side.",
    cta: "Calculate Fees →",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    free: "Always free",
  },
  {
    href: "/relist",
    emoji: "🔄",
    name: "Relist Optimizer",
    tagline: "Paste any listing URL → AI rewrites it better",
    description: "Paste an eBay, Poshmark, or Amazon listing URL. AI scrapes the listing and rewrites it with a stronger title, better keywords, and improved description.",
    cta: "Optimize Listing →",
    badge: "New",
    badgeColor: "bg-orange-100 text-orange-700",
    free: "Free",
  },
  {
    href: "/blog",
    emoji: "📚",
    name: "Reseller Blog",
    tagline: "Tips, formulas, and guides for eBay sellers",
    description: "Practical guides from a 6K-feedback eBay seller. Covering listing strategies, pricing methods, title formulas, and how to use AI to scale your reselling business.",
    cta: "Read Guides →",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    free: "Always free",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">📸</span>
          <span className="font-bold text-gray-900">SnapList AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:block">Blog</Link>
          <Link href="/generate" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Try Free →
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Free Tools for eBay Sellers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to list faster, price smarter, and sell more — most are completely free, no signup required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div key={tool.href} className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tool.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900 text-lg leading-tight">{tool.name}</h2>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{tool.tagline}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{tool.free}</span>
                <Link
                  href={tool.href}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-800 group-hover:translate-x-0.5 transition-transform"
                >
                  {tool.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Start with the AI Listing Generator</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Upload a photo and see your eBay listing in 10 seconds. No signup, no credit card, no friction. 
            3 free listings per day.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            ⚡ Try Free Now — No Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
