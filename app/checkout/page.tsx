"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "monthly";

  const [plan, setPlan] = useState<"monthly" | "annual">(
    defaultPlan === "annual" ? "annual" : "monthly"
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Checkout unavailable. Please try again later.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <span>📸</span>
          <span className="font-bold text-gray-900">SnapList AI</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Pro</h1>
        <p className="text-gray-600 mb-6">Unlimited listings. No daily limits. Ever.</p>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setPlan("monthly")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              plan === "monthly"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-bold text-gray-900">Monthly</div>
            <div className="text-2xl font-bold text-blue-600">$9.99</div>
            <div className="text-xs text-gray-500">/month</div>
          </button>
          <button
            onClick={() => setPlan("annual")}
            className={`p-4 rounded-xl border-2 text-left transition-all relative ${
              plan === "annual"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              SAVE $40
            </div>
            <div className="font-bold text-gray-900">Annual</div>
            <div className="text-2xl font-bold text-blue-600">$79</div>
            <div className="text-xs text-gray-500">/year</div>
          </button>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {[
            "Unlimited AI listings per day",
            "All 6 listing fields (title, desc, price, etc.)",
            "eBay draft export (coming soon)",
            "Priority AI processing",
            "Cancel anytime",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
              <span className="text-green-500 font-bold">✓</span> {f}
            </li>
          ))}
        </ul>

        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={checkout}
          disabled={loading || !email}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting to Stripe..." : `Subscribe — ${plan === "monthly" ? "$9.99/mo" : "$79/yr"} →`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Secured by Stripe. Cancel anytime. No commitment.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageInner />
    </Suspense>
  );
}
