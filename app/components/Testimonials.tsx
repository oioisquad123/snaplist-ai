const testimonials = [
  {
    name: "Sarah M.",
    role: "eBay seller · 500+ listings",
    text: "I used to spend 45 min writing 3 listings. Now I do 10 in that time. The titles it generates are better than what I wrote manually — more keywords, exactly the right length.",
    emoji: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Marcus T.",
    role: "Poshmark reseller · 2K followers",
    text: "Finally tried SnapList after seeing it mentioned on Reddit. Uploaded my first shoe photo and the listing was actually good. Brand, size, condition — all correct from the label in the photo. Wild.",
    emoji: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Jade K.",
    role: "Thrift flipper · eBay + Poshmark",
    text: "The bulk mode is insane. I can process a whole haul from Goodwill in an hour instead of a whole evening. The eBay CSV export saves me so much manual copy-pasting.",
    emoji: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Dev R.",
    role: "eBay seller · 1,200 feedback",
    text: "Tried it skeptically. The AI got the brand right from a tiny label, suggested the right category, and the description was honestly better than what I usually write. $9.99/mo is a no-brainer.",
    emoji: "⭐⭐⭐⭐⭐",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Sellers who switched to 10-second listings
          </h2>
          <p className="text-gray-600">Real feedback from eBay sellers and Poshmark resellers</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-sm mb-3">{t.emoji}</div>
              <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
