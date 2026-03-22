import { NextRequest, NextResponse } from "next/server";
import { getUsage, incrementUsage } from "@/lib/usage";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const FREE_LIMIT = 3;

const SYSTEM_PROMPT = `You are an expert eBay listing writer with 10+ years of experience selling on eBay. 
Analyze the provided product photos carefully and generate an optimized eBay listing.

Return ONLY valid JSON — no markdown, no explanation, just the raw JSON object.

Use this exact schema:
{
  "title": "string — max 80 chars, keyword-rich for eBay search (include brand, model, size, color, key features)",
  "category": "string — most specific eBay category name (e.g. 'Men's Athletic Shoes', 'Women's Handbags')",
  "condition": "New" | "Like New" | "Good" | "Fair" | "Poor",
  "description": "string — 2-3 paragraph HTML string with <p> tags. Include: what it is, key features, condition details, measurements if visible",
  "suggestedPrice": number — fair market value in USD based on condition and item type,
  "itemSpecifics": {
    "Brand": "string or Unknown",
    "Size": "string or N/A",
    "Color": "string",
    "Material": "string or N/A",
    "Style": "string",
    "Department": "Men | Women | Unisex | Boys | Girls | Baby | N/A"
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    if (images.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    // Check usage
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const usage = await getUsage(ip);

    // Check if pro (via Stripe — simplified: check header for now)
    const isPro = req.headers.get("x-snaplist-pro") === "true";

    if (!isPro && usage.count >= FREE_LIMIT) {
      return NextResponse.json(
        {
          error: "Daily limit reached",
          used: usage.count,
          limit: FREE_LIMIT,
          isPro: false,
          upgradeUrl: "/checkout?plan=monthly",
        },
        { status: 429 }
      );
    }

    // Build messages with vision
    const imageContent = images.map((img: string) => {
      // Handle base64 data URLs
      const isDataUrl = img.startsWith("data:");
      if (isDataUrl) {
        const [header, data] = img.split(",");
        const mimeType = header.match(/data:([^;]+)/)?.[1] || "image/jpeg";
        return {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${data}`,
          },
        };
      }
      return {
        type: "image_url",
        image_url: { url: img },
      };
    });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://snaplistai.com",
          "X-Title": "SnapList AI",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze these product photos and generate an eBay listing. Return ONLY valid JSON, no other text.",
                },
                ...imageContent,
              ],
            },
          ],
          system: SYSTEM_PROMPT,
          temperature: 0.3,
          max_tokens: 1500,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter error:", errText);
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse JSON — strip markdown code blocks if present
    let parsed;
    try {
      const cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse error:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Increment usage after successful generation
    await incrementUsage(ip);
    const newUsage = await getUsage(ip);

    return NextResponse.json({
      ...parsed,
      usage: {
        used: newUsage.count,
        limit: isPro ? null : FREE_LIMIT,
        isPro,
      },
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
