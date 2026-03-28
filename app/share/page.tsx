"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SharePageInner() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Check out this AI-generated eBay listing!";
  const price = searchParams.get("price") || "0";
  const category = searchParams.get("category") || "Item";
  const condition = searchParams.get("condition") || "Good";

  const twitterText = encodeURIComponent(
    `Just used SnapList AI to write an eBay listing in 10 seconds! 📸⚡\n\n"${title.substring(0, 60)}..." → $${price}\n\nTry it free: snaplist-ai-beta.vercel.app\n\n#eBay #reselling #AItools`
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your listing is ready!</h1>
        <p className="text-gray-600 mb-8">AI wrote that in ~10 seconds. Not bad, right?</p>

        {/* Listing preview card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left shadow-md">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">TITLE</div>
          <div className="font-semibold text-gray-900 mb-4">{title}</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-400 mb-1">PRICE</div>
              <div className="font-bold text-green-600">${price}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">CONDITION</div>
              <div className="text-gray-700">{condition}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">CATEGORY</div>
              <div className="text-gray-700 truncate">{category}</div>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-3 mb-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${twitterText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X (Twitter)
          </a>
          <Link
            href="/generate"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            ⚡ Generate Another Listing
          </Link>
        </div>

        {/* Upgrade nudge */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="font-semibold text-gray-900 mb-1">Want unlimited listings?</p>
          <p className="text-gray-600 text-sm mb-3">Free plan: 3/day. Pro: unlimited for $9.99/mo</p>
          <Link
            href="/checkout?plan=monthly"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <SharePageInner />
    </Suspense>
  );
}
