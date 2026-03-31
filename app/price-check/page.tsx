"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PricingResult {
  title: string;
  pricing: {
    low: number;
    median: number;
    high: number;
    confidence: "high" | "medium" | "low";
    note: string;
  };
  source: string;
}

function PriceCheckInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingResult | null>(null);
  const [error, setError] = useState("");

  // Auto-run if query param provided
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      // Trigger search after mount
      const timer = setTimeout(() => {
        check(q);
      }, 300);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/pricing?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = {
    high: "text-green-600 bg-green-50",
    medium: "text-yellow-600 bg-yellow-50",
    low: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-bold text-xl text-gray-900">SnapList AI</span>
        </Link>
        <Link
          href="/generate"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Try Free →
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            eBay Price Checker
          </h1>
          <p className="text-gray-600 text-lg">
            Type an item name or paste an eBay title — get an instant AI price estimate based on sold comps.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Item title or keywords
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check(undefined)}
              placeholder="e.g. Nike Air Force 1 White Size 10 Men's"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={() => check()}
              disabled={loading || !query.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                loading || !query.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
              }`}
            >
              {loading ? "..." : "Check →"}
            </button>
          </div>

          {/* Quick examples */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Try:</span>
            {[
              "Nike Air Force 1 white size 10",
              "Levi 501 jeans 32x32",
              "Coach leather handbag brown",
              "AirPods Pro 2nd gen",
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => { setQuery(ex); }}
                className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-3xl mb-3 animate-bounce">🔍</div>
            <p className="text-gray-600">Checking sold comps & market data...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <p className="text-blue-800 text-sm font-medium">📊 Price estimate for: <span className="font-semibold">{result.title}</span></p>
            </div>

            <div className="p-6">
              {/* Price range */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Low</div>
                  <div className="text-2xl font-bold text-gray-700">${result.pricing.low}</div>
                  <div className="text-xs text-gray-500">conservative</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-xs text-blue-600 uppercase tracking-wide mb-1 font-semibold">Median</div>
                  <div className="text-3xl font-bold text-blue-700">${result.pricing.median}</div>
                  <div className="text-xs text-blue-600 font-medium">best estimate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">High</div>
                  <div className="text-2xl font-bold text-gray-700">${result.pricing.high}</div>
                  <div className="text-xs text-gray-500">if condition great</div>
                </div>
              </div>

              {/* Confidence + note */}
              <div className="flex items-start gap-3 mb-6">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${confidenceColor[result.pricing.confidence]}`}>
                  {result.pricing.confidence.toUpperCase()} CONFIDENCE
                </span>
                <p className="text-sm text-gray-600 flex-1">{result.pricing.note}</p>
              </div>

              {/* CTA */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-700 font-medium mb-2">Ready to list it? 📸</p>
                <p className="text-gray-500 text-sm mb-3">
                  Upload your photos → AI writes your full eBay listing in 10 seconds (title, description, specifics + this price)
                </p>
                <Link
                  href="/generate"
                  className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  ⚡ Generate Full Listing Free →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">How does this work?</h3>
          <p className="text-gray-500 text-sm">
            Our AI analyzes thousands of eBay sold listings to estimate fair market value for pre-owned items. 
            Estimates are based on typical sold prices — actual value depends on exact condition, photos, and timing.
            For the most accurate price, always check eBay&apos;s &ldquo;Sold Items&rdquo; filter directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PriceCheckPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading price checker...</div>
      </div>
    }>
      <PriceCheckInner />
    </Suspense>
  );
}
