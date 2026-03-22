import Link from "next/link";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-sm mb-4">Last updated: March 22, 2026</p>
      <div className="prose prose-gray">
        <h2 className="text-xl font-semibold mb-2 mt-6">What we collect</h2>
        <p className="text-gray-700 mb-4">We collect your IP address to enforce free-tier usage limits (3 listings/day). We do not store your photos — images are processed in memory and immediately discarded after listing generation.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">How we use it</h2>
        <p className="text-gray-700 mb-4">IP addresses are used solely for rate limiting. Email addresses (provided during Stripe checkout) are used for billing and account management only.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">Third parties</h2>
        <p className="text-gray-700 mb-4">We use Stripe for payments, Supabase for data storage, and OpenRouter (Google Gemini) for AI processing. Each has their own privacy policy.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">Contact</h2>
        <p className="text-gray-700">Questions? Email us at support@snaplistai.com</p>
      </div>
    </div>
  );
}
