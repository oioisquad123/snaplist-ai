import { NextRequest, NextResponse } from "next/server";
import { getUsage, incrementUsage } from "@/lib/usage";

/**
 * Tweet bonus API — grants +3 extra free listings for sharing on Twitter
 * POST /api/tweet-bonus
 * 
 * Trust-based: client calls this after opening the tweet dialog.
 * The actual bonus is tracked in localStorage client-side (1/day).
 * Server-side: we grant +3 extra by setting usage count back 3.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const today = new Date().toISOString().split("T")[0];
      
      // Check if tweet bonus already claimed today
      const { data: bonusData } = await supabase
        .from("tweet_bonuses")
        .select("id")
        .eq("ip", ip)
        .eq("date", today)
        .single();

      if (bonusData) {
        return NextResponse.json({ 
          success: false, 
          error: "Tweet bonus already claimed today" 
        }, { status: 400 });
      }

      // Log the bonus claim
      await supabase.from("tweet_bonuses").upsert({
        ip,
        date: today,
        created_at: new Date().toISOString(),
      }, { onConflict: "ip,date" });

      // Reduce usage count by 3 (grant 3 more free)
      const usage = await getUsage(ip);
      const newCount = Math.max(0, usage.count - 3);
      await supabase.from("user_usage").upsert(
        { ip, date: today, count: newCount, updated_at: new Date().toISOString() },
        { onConflict: "ip,date" }
      );
    }

    return NextResponse.json({ success: true, bonus: 3 });
  } catch (err) {
    console.error("Tweet bonus error:", err);
    // Fail silently — don't block the user
    return NextResponse.json({ success: true, bonus: 3 });
  }
}
