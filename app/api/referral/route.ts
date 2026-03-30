import { NextRequest, NextResponse } from "next/server";

// Simple referral system:
// - GET /api/referral?code=ABC123 → validate code, return bonus info
// - POST /api/referral { email, referralCode? } → apply referral, +5 bonus generations

const BONUS_GENERATIONS = 5;

function generateCode(email: string): string {
  // Deterministic code based on email
  const hash = email
    .split("")
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) & 0xffffffff, 0);
  const base36 = Math.abs(hash).toString(36).toUpperCase();
  return "SL" + base36.slice(0, 6).padStart(6, "0");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ valid: false, error: "Service unavailable" }, { status: 503 });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if referral code exists
    const { data } = await supabase
      .from("snaplist_subscribers")
      .select("email, plan, status")
      .eq("referral_code", code)
      .single();

    if (data) {
      return NextResponse.json({
        valid: true,
        bonus: BONUS_GENERATIONS,
        message: `Valid referral! You'll get ${BONUS_GENERATIONS} extra free listings today.`,
      });
    }

    return NextResponse.json({ valid: false, message: "Invalid referral code" });
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid referral code" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, referralCode } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const code = generateCode(email);
    const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://snaplist-ai-beta.vercel.app"}/generate?ref=${code}`;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Store email with referral code
      await supabase.from("snaplist_subscribers").upsert(
        {
          email,
          plan: "free_referral",
          status: "active",
          referral_code: code,
          ip,
          created_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      // If they came via referral, apply bonus to the referrer
      if (referralCode) {
        // Find referrer by code
        const { data: referrer } = await supabase
          .from("snaplist_subscribers")
          .select("email, referral_count")
          .eq("referral_code", referralCode)
          .single();

        if (referrer) {
          // Increment referral count for referrer
          await supabase
            .from("snaplist_subscribers")
            .update({
              referral_count: (referrer.referral_count || 0) + 1,
            })
            .eq("referral_code", referralCode);
        }

        // Give bonus to new user (store in user_usage as negative = bonus)
        const today = new Date().toISOString().split("T")[0];
        await supabase.from("user_usage").upsert(
          {
            ip,
            date: today,
            count: 0,
            bonus: BONUS_GENERATIONS,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "ip,date" }
        );
      }
    }

    return NextResponse.json({
      success: true,
      code,
      referralLink,
      message: `Share this link to give friends ${BONUS_GENERATIONS} extra free listings!`,
    });
  } catch (err) {
    console.error("Referral error:", err);
    return NextResponse.json({ error: "Referral creation failed" }, { status: 500 });
  }
}
