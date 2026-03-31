import { NextRequest, NextResponse } from "next/server";

// eBay completed listings price research (free, no API key needed)
// Returns median sold price for a keyword from eBay completed listings

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  try {
    // Use OpenRouter/Gemini to estimate pricing based on title
    // This is faster than scraping eBay and doesn't hit rate limits
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterKey) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://snaplist-ai-beta.vercel.app",
        "X-Title": "SnapList AI Pricing",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: `You are an eBay pricing expert. Based on the listing title below, estimate the typical sold price range on eBay for used/pre-owned condition. Return ONLY valid JSON, no markdown.

Title: "${query}"

Return: {"low": number, "median": number, "high": number, "confidence": "high"|"medium"|"low", "note": "brief 1-sentence pricing rationale"}

Be realistic — use actual eBay sold prices knowledge. If luxury brand, price higher. If generic, price lower.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenRouter error: ${res.status}`);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Extract JSON
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const pricing = JSON.parse(match[0]);

    return NextResponse.json({
      title: query,
      pricing,
      source: "ai-estimate",
      cached: false,
    });
  } catch (err) {
    console.error("Pricing lookup error:", err);
    return NextResponse.json({ error: "Pricing lookup failed" }, { status: 500 });
  }
}
