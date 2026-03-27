import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Pro now!</h1>
          <p className="text-gray-600 mb-6">
            Unlimited AI listings. No more daily limits. Let&apos;s get listing.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <div className="text-sm font-semibold text-blue-800 mb-2">What you unlocked:</div>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>✅ Unlimited AI listings per day</li>
              <li>✅ eBay + Poshmark format</li>
              <li>✅ Priority AI processing</li>
              <li>✅ All 6 listing fields</li>
            </ul>
          </div>

          <Link
            href="/generate"
            className="block w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors mb-3"
          >
            ⚡ Start Generating →
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to home
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Confirmation email sent. Questions? bayu.hidayat.byh@gmail.com
        </p>
      </div>
    </div>
  );
}
