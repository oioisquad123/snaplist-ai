import { NextRequest, NextResponse } from "next/server";

// Relist API: Scrape an eBay/Poshmark listing URL and return structured data
// GET /api/relist?url=https://ebay.com/itm/...
// Returns: { title, price, images, description, category } (whatever we can scrape)

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const isEbay = hostname.includes("ebay.com");
    const isPoshmark = hostname.includes("poshmark.com");
    const isAmazon = hostname.includes("amazon.com");

    if (!isEbay && !isPoshmark && !isAmazon) {
      return NextResponse.json(
        { error: "Only eBay, Poshmark, and Amazon URLs are supported" },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch listing (HTTP ${response.status})` },
        { status: 502 }
      );
    }

    const html = await response.text();

    // Extract data from HTML
    let data: {
      title: string;
      price: number | null;
      images: string[];
      description: string;
      platform: string;
      originalUrl: string;
    } = {
      title: "",
      price: null,
      images: [],
      description: "",
      platform: isEbay ? "ebay" : isPoshmark ? "poshmark" : "amazon",
      originalUrl: url,
    };

    if (isEbay) {
      // Extract eBay title
      const titleMatch = html.match(/<h1[^>]*class="[^"]*x-item-title__mainTitle[^"]*"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/);
      if (titleMatch) data.title = titleMatch[1].replace(/<[^>]+>/g, "").trim();

      // Try meta title as fallback
      if (!data.title) {
        const metaTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/);
        if (metaTitle) data.title = metaTitle[1].replace(" | eBay", "").trim();
      }

      // Extract price
      const priceMatch = html.match(/\$[\s]*([\d,]+\.?\d{0,2})/);
      if (priceMatch) {
        data.price = parseFloat(priceMatch[1].replace(",", ""));
      }

      // Extract images from meta og:image or schema
      const ogImages = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/g) || [];
      data.images = ogImages
        .map((m) => {
          const match = m.match(/content="([^"]+)"/);
          return match ? match[1] : "";
        })
        .filter((img) => img && img.startsWith("http"))
        .slice(0, 4);

      // Extract description from meta
      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
      if (descMatch) data.description = descMatch[1];

    } else if (isPoshmark) {
      const metaTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/);
      if (metaTitle) data.title = metaTitle[1].replace(" | Poshmark", "").trim();

      const priceMatch = html.match(/"price":"(\d+\.?\d*)"/);
      if (priceMatch) data.price = parseFloat(priceMatch[1]);

      const ogImages = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/g) || [];
      data.images = ogImages
        .map((m) => {
          const match = m.match(/content="([^"]+)"/);
          return match ? match[1] : "";
        })
        .filter(Boolean)
        .slice(0, 4);

      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
      if (descMatch) data.description = descMatch[1];

    } else if (isAmazon) {
      const metaTitle = html.match(/<meta[^>]*name="title"[^>]*content="([^"]+)"/);
      if (metaTitle) data.title = metaTitle[1].replace(": Amazon.com.*", "").trim();

      const ogImages = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/g) || [];
      data.images = ogImages
        .map((m) => {
          const match = m.match(/content="([^"]+)"/);
          return match ? match[1] : "";
        })
        .filter(Boolean)
        .slice(0, 4);

      const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
      if (descMatch) data.description = descMatch[1];
    }

    // If no title found, use URL as signal
    if (!data.title && url) {
      const urlPath = parsedUrl.pathname.replace(/[-_]/g, " ").replace(/\//g, " ").trim();
      data.title = urlPath.slice(0, 80);
    }

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("Relist scrape error:", err);
    return NextResponse.json(
      { error: "Failed to scrape listing. Try pasting the URL directly." },
      { status: 500 }
    );
  }
}
