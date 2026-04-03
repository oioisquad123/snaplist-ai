import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Poshmark Listing Generator — AI Writes Your Listing in 10 Seconds",
  description:
    "Upload photos of your clothing or shoes → AI writes your Poshmark title, description, and price estimate in under 10 seconds. Free for Poshmark sellers. No signup.",
  openGraph: {
    title: "Free Poshmark Listing Generator — AI in 10 Seconds",
    description:
      "Stop writing Poshmark listings manually. Upload photos → AI writes everything. Free, no signup.",
    url: "https://snaplist-ai-beta.vercel.app/poshmark",
  },
};

const POSHMARK_TIPS = [
  {
    icon: "✍️",
    title: "Keyword-Rich Titles",
    desc: 'AI includes brand + style + color + size (e.g., "Zara Floral Midi Dress Boho Women Size S NWT")',
  },
  {
    icon: "💰",
    title: "Poshmark-Aware Pricing",
    desc: "Prices factor in Poshmark's 20% fee so you actually profit what you expect",
  },
  {
    icon: "📱",
    title: "Mobile-First",
    desc: "Works perfectly on iPhone — take photos and generate in under a minute",
  },
  {
    icon: "🎯",
    title: "No HTML",
    desc: "Poshmark descriptions are plain text — AI knows not to add HTML tags",
  },
];

export default function PoshmarkPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-bold text-xl text-gray-900">SnapList AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link>
          <Link href="/tools" className="text-gray-600 hover:text-gray-900 text-sm">Tools</Link>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900 text-sm">Blog</Link>
          <Link
            href="/generate"
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Try Free →
          </Link>
        </div>
      </nav>

      {/* Hero — Poshmark-specific */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>🛍️</span>
          <span>Built for Poshmark sellers — Posh Ambassador approved</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Free Poshmark Listing Generator
          <span className="block text-red-500 mt-1">AI Writes Everything in 10 Seconds</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload 1-4 photos of your item → AI generates your Poshmark title,
          description, price estimate, brand, size, and category. No signup. No credit card.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Link
            href="/generate"
            className="bg-red-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-600 transition-all shadow-lg"
          >
            📸 Generate Poshmark Listing Free
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Free: 3 listings/day · Pro: unlimited ($9.99/mo)
        </p>
      </section>

      {/* How it works */}
      <section className="bg-red-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Take photos",
                desc: "Snap 1-4 photos of your item. Front, back, tag, details — the more, the better.",
                icon: "📷",
              },
              {
                step: "2",
                title: "Switch to Poshmark mode",
                desc: 'On the generate page, select "Poshmark" — AI optimizes specifically for Posh.',
                icon: "🔄",
              },
              {
                step: "3",
                title: "Copy & paste",
                desc: "Copy the AI-generated title and description straight into Poshmark. Done.",
                icon: "✅",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Poshmark-specific features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Designed for Poshmark Sellers
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Not just a generic AI — SnapList knows how Poshmark search works and what
          buyers look for.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {POSHMARK_TIPS.map((tip) => (
            <div key={tip.title} className="bg-gray-50 rounded-2xl p-5 flex gap-4">
              <div className="text-2xl">{tip.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* From the builder */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gray-900 rounded-2xl p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">👟</div>
            <div>
              <p className="text-gray-200 mb-4">
                &ldquo;I have 3,000+ listings on Poshmark and 183K followers. Writing each listing
                used to take me 15-20 minutes. I built SnapList to do it in 10 seconds —
                and now I use it for every single item I list.&rdquo;
              </p>
              <div className="text-gray-400 text-sm">
                — Bayu, Posh Ambassador II · @amelia_r_shoes (183K followers) · eBay Top Rated Seller
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Poshmark listing examples */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Example AI-Generated Listing
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl mx-auto">
            <div className="text-xs text-gray-400 mb-1 font-mono">📸 Input: 2 photos of Zara dress</div>
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Title</div>
                <div className="text-gray-900 font-medium">Zara Floral Midi Dress Boho Women Size S NWT Pink Wrap Style Sundress</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description (Poshmark-optimized, plain text)</div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  Beautiful Zara floral midi dress in size Small. New with tags — never worn.
                  Features a feminine wrap-style silhouette with a pink and white floral print.
                  Perfect for summer events, brunch dates, or beach vacations.
                  <br /><br />
                  Measurements: Bust 34&quot;, Waist 28&quot;, Length 42&quot;. 100% viscose —
                  lightweight and flowy. Color is accurate to photos.
                  <br /><br />
                  Ships same day or next day in a poly mailer. Open to reasonable offers!
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Price</div>
                  <div className="font-bold text-green-600">$38.00</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Brand</div>
                  <div className="font-medium text-gray-900">Zara</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Size</div>
                  <div className="font-medium text-gray-900">Small (S)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Start Listing Faster Today
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Free: 3 Poshmark listings per day, no signup. Pro ($9.99/mo) for unlimited.
        </p>
        <Link
          href="/generate"
          className="bg-red-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-red-600 transition-all inline-block shadow-lg"
        >
          📸 Try Free Now →
        </Link>
        <p className="text-sm text-gray-400 mt-4">
          Works on iPhone · Desktop · No signup needed
        </p>
      </section>

      {/* Related tools */}
      <section className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
            More Free Tools for Sellers
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/", label: "eBay Listing Generator" },
              { href: "/bulk", label: "Bulk Mode" },
              { href: "/price-check", label: "Price Checker" },
              { href: "/fee-calculator", label: "Fee Calculator" },
              { href: "/relist", label: "Relist Optimizer" },
              { href: "/blog/how-to-sell-on-poshmark-fast", label: "Poshmark Selling Tips" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
