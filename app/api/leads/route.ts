import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { email, source = "free_limit_wall", platform = "ebay" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!supabaseUrl || !supabaseKey) {
      console.log("Lead captured (no DB):", email, source, ip);
      return NextResponse.json({ success: true, redirect: "/checkout?plan=monthly" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use snaplist_subscribers with plan='lead' as leads storage
    // When they upgrade, plan will be updated to 'pro'/'monthly'/'annual' by the webhook
    const { error } = await supabase
      .from("snaplist_subscribers")
      .upsert(
        {
          email: email.toLowerCase().trim(),
          plan: `lead_${source}_${platform}`,
          status: "pending_upgrade",
          created_at: new Date().toISOString(),
        },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      console.error("Lead insert error:", error.message);
      // Don't fail — still redirect them
    } else {
      console.log(`Lead captured: ${email} (${source}, ${platform}) from ${ip}`);
    }

    return NextResponse.json({
      success: true,
      redirect: "/checkout?plan=monthly",
    });
  } catch (err) {
    console.error("Leads API error:", err);
    // Always return success — DB failure shouldn't break UX
    return NextResponse.json({ success: true, redirect: "/checkout?plan=monthly" });
  }
}

export async function GET() {
  // Count leads
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { count } = await supabase
      .from("snaplist_subscribers")
      .select("*", { count: "exact", head: true })
      .like("plan", "lead_%");

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
