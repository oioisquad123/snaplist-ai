import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-bold text-xl text-gray-900">SnapList AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
          <Link
            href="/generate"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Try Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>⚡</span>
          <span>AI-powered listing generation — 10 seconds flat</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Turn Your Photos Into a{" "}
          <span className="text-blue-600">Perfect eBay Listing</span>{" "}
          in 10 Seconds
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop spending 15-20 minutes per listing. Upload 2-4 photos, hit generate,
          and AI writes your title, description, price, and item specifics instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/generate"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Try Free — 3 Listings/Day 🚀
          </Link>
          <a
            href="#how-it-works"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            See How It Works
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-4">No credit card required • Works on mobile • 3 free listings/day</p>
      </section>

      {/* Social proof */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-4">Built by a reseller, for resellers</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold">6,000+</div>
              <div className="text-sm text-gray-500">eBay feedback</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">183K</div>
              <div className="text-sm text-gray-500">Poshmark followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10 sec</div>
              <div className="text-sm text-gray-500">avg generation time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4,500+</div>
              <div className="text-sm text-gray-500">active listings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How It Works</h2>
        <p className="text-gray-600 text-center mb-12">Three steps. Ten seconds. Done.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              📷
            </div>
            <div className="text-sm font-semibold text-blue-600 mb-2">STEP 1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Photos</h3>
            <p className="text-gray-600">
              Drag & drop or tap to upload 1-4 photos of your item. Multiple angles work best.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🤖
            </div>
            <div className="text-sm font-semibold text-purple-600 mb-2">STEP 2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Writes It</h3>
            <p className="text-gray-600">
              Gemini AI analyzes your photos and generates a keyword-rich eBay listing in seconds.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              📋
            </div>
            <div className="text-sm font-semibold text-green-600 mb-2">STEP 3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Copy to eBay</h3>
            <p className="text-gray-600">
              Edit any field, then copy everything to your clipboard and paste into eBay. Ship it.
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything eBay Needs</h2>
          <p className="text-gray-600 text-center mb-12">AI generates all required fields, not just a title.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🏷️", title: "Optimized Title", desc: "80-character keyword-rich title built for eBay search ranking" },
              { icon: "📝", title: "Full Description", desc: "2-3 paragraph description with condition notes and key features" },
              { icon: "💰", title: "Suggested Price", desc: "AI estimates fair market value based on item recognition" },
              { icon: "📂", title: "Category", desc: "Correct eBay category automatically detected from photos" },
              { icon: "✅", title: "Condition Grade", desc: "New / Like New / Good / Fair / Poor — AI assesses from photos" },
              { icon: "📋", title: "Item Specifics", desc: "Brand, size, color, material, style — all pre-filled for you" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Simple Pricing</h2>
        <p className="text-gray-600 text-center mb-12">Start free. Upgrade when you're ready to scale.</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <div className="border border-gray-200 rounded-2xl p-8">
            <div className="text-sm font-semibold text-gray-500 mb-2">FREE</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
            <div className="text-gray-500 text-sm mb-6">forever</div>
            <ul className="space-y-3 mb-8">
              {[
                "3 AI listings per day",
                "All 6 listing fields",
                "Edit before copying",
                "Mobile friendly",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/generate"
              className="block text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-blue-600 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="text-sm font-semibold text-blue-600 mb-2">PRO</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">$9.99</div>
            <div className="text-gray-500 text-sm mb-1">/month</div>
            <div className="text-green-600 text-sm font-medium mb-6">Or $79/year (save $40)</div>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited AI listings",
                "All free features",
                "eBay draft export (coming soon)",
                "Priority AI processing",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/checkout?plan=monthly"
              className="block text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to save 15 minutes per listing?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of resellers who use AI to write listings faster.
            Start with 3 free listings per day — no credit card needed.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Try SnapList AI Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span>📸</span>
            <span className="font-bold">SnapList AI</span>
          </div>
          <p className="text-sm text-gray-500">
            Built by <a href="https://twitter.com/bhidaya1" className="hover:underline">@bhidaya1</a> •{" "}
            <a href="https://resellerai.ai" className="hover:underline">ResellerAI</a>
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
