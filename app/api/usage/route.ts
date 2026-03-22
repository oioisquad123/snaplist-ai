import { NextRequest, NextResponse } from "next/server";
import { getUsage } from "@/lib/usage";

const FREE_LIMIT = 3;

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const isPro = req.headers.get("x-snaplist-pro") === "true";
  const usage = await getUsage(ip);

  return NextResponse.json({
    used: usage.count,
    limit: isPro ? null : FREE_LIMIT,
    remaining: isPro ? null : Math.max(0, FREE_LIMIT - usage.count),
    isPro,
    date: usage.date,
  });
}
