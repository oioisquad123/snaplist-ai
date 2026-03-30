import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 80-Character eBay Title Formula That Gets More Views",
  description:
    "eBay titles max at 80 characters. Most sellers waste them. This Brand + Model + Color + Size formula gets 3x more impressions on the same items.",
  keywords:
    "ebay title formula, how to write ebay title, ebay listing title tips, ebay title optimization, ebay search ranking",
};

export default function Post2() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-bold text-xl text-gray-900">SnapList AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-gray-600 text-sm hover:text-gray-900">← Blog</Link>
          <Link href="/generate" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Try Free →
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {["eBay", "SEO", "Titles"].map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            The 80-Character eBay Title Formula That Gets More Views
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <span>March 27, 2026</span>
            <span>·</span>
            <span>3 min read</span>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            eBay gives you 80 characters for your title. That&apos;s it. Most sellers use 40-50 and wonder
            why their listings don&apos;t show up. Here&apos;s the exact formula that maximizes search visibility.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900 mt-10">Why Titles Matter More Than You Think</h2>
          <p>
            eBay&apos;s Cassini search algorithm heavily weights the title. If a buyer searches
            &quot;Nike Air Force 1 white size 10&quot; and your title doesn&apos;t have all four of those words,
            you won&apos;t appear — even if your listing is perfect otherwise.
          </p>
          <p>
            Most sellers write titles like they&apos;re labeling a box: &quot;Nike Shoes Size 10.&quot;
            That&apos;s 18 characters. You have 62 more to work with. Each wasted character is a missed keyword.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10">The Formula</h2>
          <div className="bg-gray-900 text-green-400 rounded-xl p-5 font-mono text-sm">
            [Brand] [Model] [Color] [Size] [Gender/Dept] [Condition] [Key Feature]
          </div>
          <p><strong>Applied example for sneakers:</strong></p>
          <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-600">
            Nike Air Force 1 Low White Men&apos;s Size 11 Like New Triple White Leather Sneaker
          </blockquote>
          <p>That&apos;s 77 characters — almost maxed out, and every word is searchable.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10">5 Common Title Mistakes</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Using adjectives instead of keywords</strong><br />
              ❌ &quot;Beautiful White Nike Shoes&quot;<br />
              ✅ &quot;Nike Air Force 1 White Sneakers&quot;<br />
              Nobody searches &quot;beautiful.&quot; They search model names and colors.
            </li>
            <li>
              <strong>Skipping the size</strong><br />
              Size is one of the first filters buyers use. Always include it — even for one-size items.
            </li>
            <li>
              <strong>Vague condition words</strong><br />
              ❌ &quot;Gently Used&quot; — eBay&apos;s condition field handles this<br />
              ✅ &quot;Like New&quot; in the title if condition is a selling point
            </li>
            <li>
              <strong>ALL CAPS</strong><br />
              eBay&apos;s algorithm doesn&apos;t care, but buyers find it aggressive. Title Case or Sentence case is better.
            </li>
            <li>
              <strong>Ignoring the subtitle</strong><br />
              eBay has a paid subtitle field ($0.50). Skip it. Put those keywords in the title instead.
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-10">How SnapList AI Handles Titles</h2>
          <p>
            When you upload a photo, SnapList AI generates a title using this exact formula — automatically.
            It reads the brand from the label, identifies the model, pulls the colorway from the photo,
            and formats everything into a keyword-dense 80-character title.
          </p>
          <p>
            You can edit it if the AI gets something wrong (like a colorway name), but 80% of the time
            the generated title is better than what I&apos;d write manually.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-10">
            <h3 className="font-bold text-gray-900 text-lg mb-2">See it in action</h3>
            <p className="text-gray-600 mb-4">
              Upload a product photo and get an AI-generated title in 10 seconds.
              3 free listings/day, no signup.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ⚡ Generate a Title Free →
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-gray-100 py-8 mt-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/blog" className="text-blue-600 text-sm hover:underline">← Back to Blog</Link>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/generate" className="hover:text-gray-900">Try Free</Link>
            <Link href="/checkout" className="hover:text-gray-900">Pro Plan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
