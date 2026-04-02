import { NextRequest, NextResponse } from "next/server";

// Generate an eBay "Sell Your Item" pre-filled URL
// eBay supports limited pre-fill via their legacy SYI URL parameters
// This creates the best possible deep link to get sellers into eBay with data pre-filled

interface ListingData {
  title: string;
  description: string;
  category?: string;
  condition?: string;
  suggestedPrice?: number;
}

const CONDITION_MAP: Record<string, string> = {
  "New": "1000",
  "Like New": "3000",
  "Good": "4000",
  "Fair": "5000",
  "Poor": "7000",
};

export async function POST(req: NextRequest) {
  try {
    const data: ListingData = await req.json();

    if (!data.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Build eBay Sell Your Item URL with best available pre-fill
    // eBay's SYI API params (limited but useful)
    const params = new URLSearchParams();
    
    params.set("title", data.title.substring(0, 80));
    
    if (data.description) {
      // eBay doesn't accept pre-filled descriptions via URL, but we can open the form
      // and user pastes. Return the description separately for easy copy.
    }
    
    if (data.suggestedPrice) {
      params.set("MinimumBidPrice", data.suggestedPrice.toString());
      params.set("BuyItNowPrice", data.suggestedPrice.toString());
    }

    if (data.condition && CONDITION_MAP[data.condition]) {
      params.set("Condition", CONDITION_MAP[data.condition]);
    }

    // eBay Sell Your Item (SYI) — best we can do without OAuth
    const ebayUrl = `https://www.ebay.com/sell/newitem?${params.toString()}`;

    return NextResponse.json({
      url: ebayUrl,
      title: data.title,
      // Return formatted description for easy copy
      description: data.description || "",
    });
  } catch (err) {
    console.error("eBay deeplink error:", err);
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    description: "POST title, description, condition, suggestedPrice → get eBay pre-filled URL",
  });
}
