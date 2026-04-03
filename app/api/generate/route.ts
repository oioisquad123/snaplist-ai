import { NextRequest, NextResponse } from "next/server";
import { getUsage, incrementUsage } from "@/lib/usage";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const FREE_LIMIT = 3;

const EBAY_SYSTEM_PROMPT = `You are an expert eBay listing writer with 10+ years of reselling experience. Analyze the product photos carefully and return ONLY valid JSON — no markdown, no code blocks, no extra text.

Required JSON structure:
{"title":"","category":"","condition":"","description":"","suggestedPrice":29.99,"itemSpecifics":{"Brand":"","Size":"","Color":"","Material":"","Style":"","Department":""}}

CRITICAL RULES:
- title: max 80 chars, keyword-rich for eBay search (include brand + model + color + size + key feature)
- category: specific eBay category name — MUST be one of: "Men's Athletic Shoes", "Women's Athletic Shoes", "Men's Casual Shoes", "Women's Casual Shoes", "Men's Dress Shoes", "Women's Boots", "Children's Shoes", "Men's Sandals", "Women's Sandals", "Sneakers", "Running Shoes", "Basketball Shoes", "Clothing", "Men's T-Shirts", "Women's Dresses", "Handbags", "Watches", "Electronics", "Sports Equipment", "Collectibles", "Home & Garden", or similar specific category
- condition: EXACTLY one of: New, Like New, Good, Fair, Poor
- description: 2-3 paragraphs as HTML string with <p> tags — describe item, features, condition, measurements if visible
- suggestedPrice: REQUIRED — estimate fair USD resale value based on brand, condition, style (e.g. 24.99, 49.99, 89.99) — NEVER return 0
- itemSpecifics.Department: Men, Women, Unisex, Boys, Girls, Baby, or N/A
- itemSpecifics.Brand: visible brand name, or "Unknown" if not visible
- All other specifics: fill in what you can see, use "N/A" if not determinable`;

const POSHMARK_SYSTEM_PROMPT = `You are an expert Poshmark reseller with deep knowledge of fashion and secondhand marketplace pricing. Analyze the product photos and return ONLY valid JSON — no markdown, no code blocks, no extra text.

Required JSON structure:
{"title":"","category":"","condition":"","description":"","suggestedPrice":29.99,"itemSpecifics":{"Brand":"","Size":"","Color":"","Material":"","Style":"","Department":""}}

CRITICAL RULES:
- title: max 80 chars, include brand + style + color — optimize for Poshmark search
- category: Poshmark category like "Women's Shoes", "Men's Shoes", "Women's Tops", "Men's Jackets", "Accessories", "Handbags", "Jewelry", etc.
- condition: EXACTLY one of: New, Like New, Good, Fair, Poor
- description: 2-3 paragraphs — mention brand, condition details, measurements, styling tips. No HTML tags (plain text).
- suggestedPrice: REQUIRED — Poshmark fair value in USD. Factor in ~20% Poshmark fee. NEVER return 0.
- itemSpecifics.Department: Men, Women, Unisex, Boys, Girls, Baby, or N/A
- itemSpecifics.Brand: visible brand name, or "Unknown"
- Fill all specifics you can determine from photos`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, platform = "ebay", textContext, context } = body;

    // Allow text-only mode (for relist from URL without images)
    const hasImages = images && Array.isArray(images) && images.length > 0 && images[0];
    const hasTextContext = textContext && typeof textContext === "string" && textContext.trim().length > 10;

    if (!hasImages && !hasTextContext) {
      return NextResponse.json(
        { error: "No images or text context provided" },
        { status: 400 }
      );
    }

    if (hasImages && images.length > 4) {
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

    // Check if pro (via Supabase subscription lookup)
    const isPro = await checkIfPro(ip, req);

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

    // Build messages with vision or text-only
    const systemPrompt = platform === "poshmark" ? POSHMARK_SYSTEM_PROMPT : EBAY_SYSTEM_PROMPT;

    let messageContent: unknown[];

    if (hasImages) {
      const imageContent = images.filter(Boolean).map((img: string) => {
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

      const userText = platform === "poshmark"
        ? "Analyze these product photos and generate a Poshmark listing. Return ONLY valid JSON."
        : "Analyze these product photos and generate an eBay listing. Return ONLY valid JSON.";

      const extraContext = context
        ? `\n\nAdditional context from original listing:\nOriginal title: ${context.originalTitle || "N/A"}\nOriginal price: $${context.originalPrice || "unknown"}\nOriginal description: ${context.originalDescription || "N/A"}`
        : "";

      messageContent = [
        { type: "text", text: userText + extraContext },
        ...imageContent,
      ];
    } else {
      // Text-only mode — for relist from URL
      const userText = platform === "poshmark"
        ? `Based on this product information, generate an optimized Poshmark listing. Return ONLY valid JSON.\n\nProduct info:\n${textContext}`
        : `Based on this product information, generate an optimized eBay listing. Return ONLY valid JSON.\n\nProduct info:\n${textContext}`;

      messageContent = [{ type: "text", text: userText }];
    }

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
          model: hasImages ? "google/gemini-2.5-flash-preview" : "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: messageContent,
            },
          ],
          system: systemPrompt,
          temperature: 0.2,
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
      // Try to extract JSON from the response (handles extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      const cleaned = jsonStr
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

    // Normalize response
    const normalized = {
      title: (parsed.title || parsed.listing_title || parsed.product_title || "Untitled Item").substring(0, 80),
      category: parsed.category || parsed.ebay_category || parsed.product_category || "Clothing & Shoes",
      condition: parsed.condition || "Good",
      description: parsed.description || parsed.product_description || parsed.item_description || "",
      suggestedPrice: (() => {
        const raw = parsed.suggestedPrice ?? parsed.suggested_price ?? parsed.price ?? parsed.estimated_price ?? parsed.market_value ?? 0;
        const num = typeof raw === "number" ? raw : parseFloat(raw);
        // If AI returned 0, default to a reasonable minimum
        return (isNaN(num) || num <= 0) ? 19.99 : num;
      })(),
      itemSpecifics: parsed.itemSpecifics || parsed.item_specifics || parsed.specifications || {
        Brand: parsed.brand || "Unknown",
        Size: parsed.size || "N/A",
        Color: parsed.color || "N/A",
        Material: parsed.material || "N/A",
        Style: parsed.style || "N/A",
        Department: parsed.department || "N/A",
      },
    };

    // Ensure condition is valid
    const validConditions = ["New", "Like New", "Good", "Fair", "Poor"];
    if (!validConditions.includes(normalized.condition)) {
      normalized.condition = "Good";
    }

    // Strip HTML from description for Poshmark
    if (platform === "poshmark") {
      normalized.description = normalized.description.replace(/<[^>]*>/g, "").trim();
    }

    // Increment usage after successful generation
    await incrementUsage(ip);
    const newUsage = await getUsage(ip);

    return NextResponse.json({
      ...normalized,
      platform,
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

// Check if the IP corresponds to a Pro subscriber
async function checkIfPro(ip: string, req: NextRequest): Promise<boolean> {
  // Check header (for future auth integration)
  if (req.headers.get("x-snaplist-pro") === "true") return true;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return false;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from("snaplist_subscribers")
      .select("status")
      .eq("ip", ip)
      .eq("status", "active")
      .single();

    return !!data;
  } catch {
    return false;
  }
}
