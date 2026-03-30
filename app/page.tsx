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
          <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:block">How it works</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:block">Pricing</Link>
          <Link href="/bulk" className="text-purple-600 hover:text-purple-800 text-sm font-medium hidden sm:block">⚡ Bulk Mode</Link>
          <Link href="/blog" className="text-gray-600 hover:text-gray-900 text-sm hidden sm:block">Blog</Link>
          <Link
            href="/generate"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Try Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>🟢</span>
          <span>Live now — no signup required</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Turn Your Photos Into a{" "}
          <span className="text-blue-600">Perfect eBay Listing</span>{" "}
          in 10 Seconds
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop spending 20 minutes writing listings. Upload 1-4 photos →
          AI generates your title, description, price, category, and item specifics instantly.
          Works for eBay and Poshmark.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Link
            href="/generate"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
          >
            ⚡ Try Free — 3 Listings/Day
          </Link>
          <a
            href="#how-it-works"
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            See How It Works
          </a>
        </div>
        <p className="text-sm text-gray-500">
          No credit card • No signup • Works on mobile • eBay + Poshmark
        </p>
      </section>

      {/* Demo preview — static mockup */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-gray-900 rounded-2xl p-6 text-left shadow-2xl">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-400 text-xs mb-3 font-mono">SnapList AI — results in ~8 seconds</div>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-500 text-xs mb-1">TITLE</div>
              <div className="text-white text-sm font-medium">Nike Air Max 90 Men&apos;s Running Shoes White Black Size 10.5 Retro Sneakers</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-500 text-xs mb-1">CATEGORY</div>
                <div className="text-white text-sm">Men&apos;s Athletic Shoes</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-500 text-xs mb-1">CONDITION</div>
                <div className="text-white text-sm">Like New</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-gray-500 text-xs mb-1">PRICE</div>
                <div className="text-green-400 text-sm font-bold">$89.99</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-500 text-xs mb-1">ITEM SPECIFICS</div>
              <div className="text-white text-sm">Brand: Nike · Size: 10.5 · Color: White/Black · Style: Running</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-gray-50 py-8 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-6">Built by a full-time reseller who does this every day</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">6,000+</div>
              <div className="text-sm text-gray-500">eBay feedback</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">183K</div>
              <div className="text-sm text-gray-500">Poshmark followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">~10 sec</div>
              <div className="text-sm text-gray-500">avg generation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4,500+</div>
              <div className="text-sm text-gray-500">active listings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">How It Works</h2>
        <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
          Three steps. Takes less time than walking to your camera roll.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "📷",
              step: "STEP 1",
              color: "blue",
              title: "Upload Photos",
              desc: "Drag & drop or tap to upload 1-4 photos. Multiple angles = better results. HEIC, JPG, PNG — all work.",
            },
            {
              icon: "🤖",
              step: "STEP 2",
              color: "purple",
              title: "AI Writes It",
              desc: "Gemini Vision AI analyzes your photos and generates a complete, keyword-optimized listing in ~10 seconds.",
            },
            {
              icon: "🛒",
              step: "STEP 3",
              color: "green",
              title: "Copy & Paste",
              desc: "Edit any field, then tap \"Copy All\" and paste directly into eBay or Poshmark. List and ship.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className={`w-16 h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                {item.icon}
              </div>
              <div className={`text-sm font-semibold text-${item.color}-600 mb-2`}>{item.step}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/generate"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Try It Free →
          </Link>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Every Field eBay Asks For</h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            AI fills in everything — not just the title. You just paste and ship.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "🏷️", title: "Optimized Title (80 chars)", desc: "Keyword-rich for eBay search ranking. Includes brand, model, size, color, key features." },
              { icon: "📝", title: "Full Description", desc: "2-3 paragraphs with item details, features, condition notes, and measurements." },
              { icon: "💰", title: "Suggested Price", desc: "AI estimates fair resale value based on brand, condition, and style recognition." },
              { icon: "📂", title: "Category", desc: "Correct eBay or Poshmark category automatically detected from photos." },
              { icon: "✅", title: "Condition Grade", desc: "New / Like New / Good / Fair / Poor — assessed from the photos you upload." },
              { icon: "📋", title: "Item Specifics", desc: "Brand, size, color, material, style, department — all pre-filled, all editable." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (founder honest section) */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">The Time Math</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">😩</div>
            <h3 className="font-bold text-gray-900 mb-3">Before SnapList AI</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>📝 Write title — 5 min</li>
              <li>🔍 Research category — 3 min</li>
              <li>✏️ Write description — 8 min</li>
              <li>💲 Look up sold comps — 5 min</li>
              <li>📋 Fill item specifics — 4 min</li>
              <li className="font-bold text-red-700 pt-2 border-t border-red-200">Total: ~25 min per listing</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">🚀</div>
            <h3 className="font-bold text-gray-900 mb-3">With SnapList AI</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>📷 Upload photos — 30 sec</li>
              <li>⚡ AI generates everything — 10 sec</li>
              <li>✏️ Quick edit if needed — 1 min</li>
              <li>📋 Copy & paste to eBay — 30 sec</li>
              <li></li>
              <li className="font-bold text-green-700 pt-2 border-t border-green-200">Total: ~2 min per listing</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-8 text-lg">
          If you list 10 items/week, that&apos;s <span className="font-bold text-gray-900">3+ hours saved every week</span>.
        </p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Simple Pricing</h2>
          <p className="text-gray-600 text-center mb-12">Start free. Upgrade when you need unlimited.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="border border-gray-200 rounded-2xl p-8 bg-white">
              <div className="text-sm font-semibold text-gray-500 mb-2">FREE</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
              <div className="text-gray-500 text-sm mb-6">forever, no card needed</div>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "3 AI listings per day",
                  "eBay + Poshmark format",
                  "All 6 listing fields",
                  "Fully editable results",
                  "Mobile friendly",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/generate"
                className="block text-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="border-2 border-blue-600 rounded-2xl p-8 relative bg-white">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                MOST POPULAR
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-2">PRO</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">$9.99</div>
              <div className="text-gray-500 text-sm mb-1">/month</div>
              <div className="text-green-600 text-sm font-medium mb-6">Or $79/year — save $40 🎉</div>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "Unlimited AI listings",
                  "Everything in Free",
                  "eBay draft export (coming soon)",
                  "Priority processing",
                  "Email support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <Link
                  href="/checkout?plan=monthly"
                  className="block text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Pro — $9.99/mo →
                </Link>
                <Link
                  href="/checkout?plan=annual"
                  className="block text-center text-blue-600 text-sm hover:text-blue-700 py-1"
                >
                  Annual plan — $79/yr (save $40)
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            At 3 listings/day free, SnapList pays for itself at ~2 listings.
            <br />Cancel anytime. No long-term commitment.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">FAQ</h2>
        <div className="space-y-6">
          {[
            {
              q: "Does it work for any product, not just shoes?",
              a: "Yes! SnapList AI works for clothing, electronics, sports equipment, home goods, collectibles — anything you can photograph. Shoes are just what we resell.",
            },
            {
              q: "What AI model does it use?",
              a: "Google Gemini 2.0 Flash Vision — one of the best multimodal AI models. It can recognize brands, conditions, sizes, and more from photos.",
            },
            {
              q: "Can I export listings directly to eBay?",
              a: "Right now you copy-paste from our app into eBay. Direct eBay draft export is coming in Pro soon — we're building the eBay API integration.",
            },
            {
              q: "Does it work on iPhone?",
              a: "Yes — SnapList AI is a mobile-first web app. Open it in Safari or Chrome on your iPhone, upload photos from your camera roll, done.",
            },
            {
              q: "Is my data private?",
              a: "Photos are sent to the AI for analysis only. We don't store your images. Usage counts are tracked by IP address only.",
            },
          ].map((item) => (
            <div key={item.q} className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop writing listings by hand.
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            3 free listings per day. No credit card. Takes 30 seconds to try.
          </p>
          <Link
            href="/generate"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            ⚡ Try SnapList AI Free →
          </Link>
          <p className="text-blue-200 text-sm mt-4">Already used by eBay &amp; Poshmark resellers</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <span>📸</span>
            <span className="font-bold">SnapList AI</span>
            <span className="text-gray-400 text-sm ml-2">by ResellerAI</span>
          </div>
          <p className="text-sm text-gray-500">
            Built by{" "}
            <a href="https://twitter.com/bhidaya1" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-700">
              @bhidaya1
            </a>{" "}
            — full-time reseller, 6K+ eBay feedback
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <a href="mailto:bayu.hidayat.byh@gmail.com" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
