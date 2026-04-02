import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapList AI Blog — eBay Listing Tips, Poshmark Tricks & AI Reselling",
  description:
    "Practical guides for eBay sellers and Poshmark resellers. Learn how to write killer listings faster with AI, price items for maximum profit, and grow your reselling business.",
  keywords:
    "ebay listing tips, poshmark listing guide, how to write ebay listings faster, ai ebay listing generator, reselling tips 2024",
};

const posts = [
  {
    slug: "best-ai-tools-for-ebay-sellers",
    title: "Best AI Tools for eBay Sellers in 2026 (Ranked + Tested)",
    date: "April 2, 2026",
    readTime: "7 min read",
    excerpt:
      "I run a 6,000-feedback eBay store and tested every AI tool that promises to make reselling faster. Most are trash. A few are genuinely life-changing. Here's the honest ranked breakdown.",
    tags: ["AI Tools", "eBay", "Review"],
    emoji: "🤖",
    isNew: true,
  },
  {
    slug: "how-to-sell-on-poshmark-fast",
    title: "How to Sell on Poshmark Fast in 2026 (7 Tricks That Actually Work)",
    date: "April 2, 2026",
    readTime: "6 min read",
    excerpt:
      "Built a closet to 183K followers on Poshmark. These are the 7 tactics that actually move items — not generic advice you've seen a hundred times. Includes the AI listing shortcut.",
    tags: ["Poshmark", "Strategy", "2026"],
    emoji: "👗",
    isNew: true,
  },
  {
    slug: "how-to-price-items-on-ebay",
    title: "How to Price Items on eBay in 2026 (The Exact Method a 6K Seller Uses)",
    date: "March 31, 2026",
    readTime: "6 min read",
    excerpt:
      "Stop guessing eBay prices. The exact 3-step method to price any item using sold comps — plus how AI can do it in seconds from just a photo. Includes quick-reference table by category.",
    tags: ["eBay", "Pricing", "Strategy"],
    emoji: "💰",
  },
  {
    slug: "how-to-write-ebay-listings-faster",
    title: "How to Write eBay Listings 10x Faster (Without Cutting Corners)",
    date: "March 28, 2026",
    readTime: "4 min read",
    excerpt:
      "If you're manually writing each eBay listing, you're bleeding hours every week. Here's the exact system I use to list 20+ items/day using AI — with better titles and descriptions than I ever wrote by hand.",
    tags: ["eBay", "Productivity", "AI Tools"],
    emoji: "⚡",
  },
  {
    slug: "ebay-title-formula",
    title: "The 80-Character eBay Title Formula That Gets More Views",
    date: "March 27, 2026",
    readTime: "3 min read",
    excerpt:
      "eBay titles max out at 80 characters. Most sellers waste half of them. This formula — Brand + Model + Color + Size + Key Feature — is how I get 3x more impressions on the same items.",
    tags: ["eBay", "SEO", "Titles"],
    emoji: "🔍",
  },
  {
    slug: "poshmark-listing-tips",
    title: "7 Poshmark Listing Tricks That Get Offers Within 24 Hours",
    date: "March 26, 2026",
    readTime: "5 min read",
    excerpt:
      "183K followers on Poshmark taught me what works: lighting, descriptions, pricing, and the exact time to share. Plus: why AI-generated descriptions outperform hand-written ones for search.",
    tags: ["Poshmark", "Listing Tips", "Sales"],
    emoji: "👗",
  },
  {
    slug: "ai-listing-generator-review",
    title: "I Tested 5 AI eBay Listing Generators — Here's What Actually Works",
    date: "March 25, 2026",
    readTime: "6 min read",
    excerpt:
      "ChatGPT, Claude, Gemini, and two dedicated apps. I ran the same sneaker photos through all 5. The results were surprising — most got the price wrong by 40%+. One nailed it every time.",
    tags: ["AI Tools", "Review", "eBay"],
    emoji: "🤖",
  },
  {
    slug: "ebay-item-specifics-guide",
    title: "eBay Item Specifics: The Hidden Ranking Factor Most Sellers Ignore",
    date: "March 24, 2026",
    readTime: "4 min read",
    excerpt:
      "eBay's algorithm uses item specifics (Brand, Size, Color, Style) to rank listings in search. Most casual sellers skip them. Here's exactly which fields matter most and how to fill them in 10 seconds with AI.",
    tags: ["eBay", "SEO", "Item Specifics"],
    emoji: "📊",
  },
  {
    slug: "reselling-at-scale",
    title: "How I Scaled to 1,500+ eBay Listings While Working a Full-Time Job",
    date: "March 22, 2026",
    readTime: "7 min read",
    excerpt:
      "The automation stack that runs my eBay store 24/7 — from AI-generated listings to automated offers to buyers. Spoiler: the hardest part isn't the tech, it's the sourcing system.",
    tags: ["Reselling", "Automation", "Scale"],
    emoji: "🚀",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-bold text-xl text-gray-900">SnapList AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-blue-600 font-medium text-sm">Blog</Link>
          <Link
            href="/generate"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Try Free →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The SnapList Blog
          </h1>
          <p className="text-xl text-gray-600">
            Practical guides for eBay sellers, Poshmark resellers, and thrift flippers.
            Written by a full-time reseller with 6K+ eBay feedback.
          </p>
        </div>

        {/* Featured post */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
            <span>⚡</span>
            <span>Most Popular</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {posts[0].title}
          </h2>
          <p className="text-gray-600 mb-5">{posts[0].excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{posts[0].date}</span>
              <span>{posts[0].readTime}</span>
            </div>
            <Link
              href={`/blog/${posts[0].slug}`}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Read article →
            </Link>
          </div>
        </div>

        {/* Post grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{post.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400">{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Stop writing listings by hand.
          </h2>
          <p className="text-gray-400 mb-6">
            3 free AI listings per day. No credit card. Works for eBay and Poshmark.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-400 transition-colors"
          >
            ⚡ Try SnapList AI Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span>📸</span>
            <span className="font-bold">SnapList AI</span>
            <span className="text-gray-400 text-sm ml-2">by ResellerAI</span>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <Link href="/generate" className="hover:text-gray-900">Try Free</Link>
            <Link href="/blog" className="hover:text-gray-900">Blog</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
