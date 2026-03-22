import Link from "next/link";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 text-sm mb-4">Last updated: March 22, 2026</p>
      <div className="prose prose-gray">
        <h2 className="text-xl font-semibold mb-2 mt-6">Use of Service</h2>
        <p className="text-gray-700 mb-4">SnapList AI provides AI-generated eBay listing drafts for informational purposes. You are responsible for verifying all listing content before publishing on eBay or other marketplaces.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">Free Tier</h2>
        <p className="text-gray-700 mb-4">Free accounts are limited to 3 AI-generated listings per day per IP address. We reserve the right to adjust these limits.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">Pro Subscriptions</h2>
        <p className="text-gray-700 mb-4">Pro subscriptions are billed monthly or annually via Stripe. Cancel anytime — no refunds for partial periods unless required by law.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">Disclaimer</h2>
        <p className="text-gray-700 mb-4">AI-generated content may contain errors. We make no guarantees about pricing accuracy, category assignment, or listing quality. Always review before publishing.</p>
        
        <h2 className="text-xl font-semibold mb-2 mt-6">Contact</h2>
        <p className="text-gray-700">Questions? Email us at support@snaplistai.com</p>
      </div>
    </div>
  );
}
