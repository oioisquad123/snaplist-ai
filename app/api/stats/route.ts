import { NextResponse } from "next/server";

// Public stats endpoint for landing page social proof counter
export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // Fallback values if Supabase isn't available
  const fallback = {
    totalUsers: 47,
    totalGenerations: 312,
    totalListings: 312,
  };

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: usageData } = await supabase
      .from("user_usage")
      .select("ip, count");

    const totalUsers = new Set(usageData?.map((r: { ip: string }) => r.ip) || []).size;
    const totalGenerations = usageData?.reduce((sum: number, r: { count: number }) => sum + (r.count || 0), 0) || 0;

    // Pad numbers to look less empty early on
    const displayUsers = Math.max(totalUsers, 23);
    const displayListings = Math.max(totalGenerations, displayUsers * 6);

    return NextResponse.json(
      {
        totalUsers: displayUsers,
        totalGenerations: displayListings,
        totalListings: displayListings,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      }
    );
  } catch {
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  }
}
