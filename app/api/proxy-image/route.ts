import { NextRequest, NextResponse } from "next/server";

// Image proxy: fetch external images server-side to avoid CORS issues
// GET /api/proxy-image?url=https://...

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  // Security: only allow known image hosts
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const allowedHosts = [
    "i.ebayimg.com",
    "ebayimg.com",
    "m.media-amazon.com",
    "images-na.ssl-images-amazon.com",
    "di2ponv0v5otw.cloudfront.net",
    "poshmark.com",
    "images.poshmark.com",
  ];

  const isAllowed = allowedHosts.some((h) => parsedUrl.hostname.includes(h));

  if (!isAllowed) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.ebay.com/",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Image fetch failed" }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Proxy image error:", err);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
