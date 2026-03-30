import { NextRequest, NextResponse } from "next/server";

// eBay File Exchange CSV format
// Columns: Action, ItemID, SiteID, Country, Currency, StartPrice, BuyItNowPrice,
//          Quantity, Title, Description, Category, ConditionID, PicURL, Format, Duration, PaymentMethods

const CONDITION_MAP: Record<string, number> = {
  New: 1000,
  "Like New": 3000,
  Good: 4000,
  Fair: 5000,
  Poor: 7000,
};

const EBAY_CATEGORY_MAP: Record<string, number> = {
  "Men's Athletic Shoes": 15709,
  "Women's Athletic Shoes": 15710,
  "Men's Casual Shoes": 93427,
  "Women's Casual Shoes": 55793,
  "Men's Dress Shoes": 11498,
  "Women's Boots": 62349,
  "Children's Shoes": 45333,
  "Men's Sandals": 11555,
  "Women's Sandals": 62984,
  Sneakers: 15709,
  "Running Shoes": 15709,
  "Basketball Shoes": 15709,
  Clothing: 11450,
  "Men's T-Shirts": 185100,
  "Women's Dresses": 63861,
  Handbags: 169291,
  Watches: 14324,
  Electronics: 58058,
  "Sports Equipment": 888,
  Collectibles: 1,
  "Home & Garden": 11700,
};

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\n+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listings, format = "ebay_csv" } = body;

    if (!listings || !Array.isArray(listings) || listings.length === 0) {
      return NextResponse.json({ error: "No listings provided" }, { status: 400 });
    }

    if (format === "ebay_csv") {
      // eBay Bulk Listing CSV format
      const headers = [
        "Action",
        "SiteID",
        "Country",
        "Currency",
        "Title",
        "Category",
        "CategoryID",
        "ConditionID",
        "StartPrice",
        "Quantity",
        "Format",
        "Duration",
        "Description",
        "PaymentMethods",
        "ShippingType",
        "ShippingService-1:Option",
        "ShippingService-1:Cost",
        "Brand",
        "Size",
        "Color",
        "Material",
        "Style",
        "Department",
      ];

      const rows = listings.map(
        (listing: {
          title: string;
          category: string;
          condition: string;
          description: string;
          suggestedPrice: number;
          itemSpecifics: Record<string, string>;
        }) => {
          const conditionId = CONDITION_MAP[listing.condition] ?? 4000;
          const categoryId = EBAY_CATEGORY_MAP[listing.category] ?? 11450;
          const specs = listing.itemSpecifics || {};

          return [
            "Add",
            "US",
            "US",
            "USD",
            escapeCsvField(listing.title || ""),
            escapeCsvField(listing.category || "Clothing"),
            categoryId,
            conditionId,
            listing.suggestedPrice?.toFixed(2) || "9.99",
            "1",
            "FixedPriceItem",
            "GTC",
            escapeCsvField(stripHtml(listing.description || "")),
            "PayPal",
            "Calculated",
            "USPSFirstClass",
            "0.00",
            escapeCsvField(specs.Brand || ""),
            escapeCsvField(specs.Size || ""),
            escapeCsvField(specs.Color || ""),
            escapeCsvField(specs.Material || ""),
            escapeCsvField(specs.Style || ""),
            escapeCsvField(specs.Department || ""),
          ].join(",");
        }
      );

      const csv = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="snaplist-ebay-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // JSON format (for other platforms)
    return NextResponse.json({ listings, exported: listings.length });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
