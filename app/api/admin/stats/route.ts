import { NextRequest, NextResponse } from "next/server";

const ADMIN_KEY = process.env.ADMIN_KEY || "snaplist123";

export async function GET(req: NextRequest) {
  // Simple key auth
  const { searchParams } = new URL(req.url);
  const referer = req.headers.get("referer") || "";
  const key = searchParams.get("key");

  // Allow if coming from admin page (same origin) or has key
  const isAdminPage = referer.includes("/admin");
  if (!isAdminPage && key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      totalUsers: 0,
      totalGenerations: 0,
      totalLeads: 0,
      totalSubscribers: 0,
      todayGenerations: 0,
      topIPs: [],
      recentLeads: [],
      recentSubscribers: [],
    });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey);

  const today = new Date().toISOString().split("T")[0];

  const [
    usageStats,
    todayStats,
    leadsResult,
    subscribersResult,
    topIPsResult,
    recentLeadsResult,
    recentSubsResult,
  ] = await Promise.allSettled([
    // Total unique users (IPs) and generations
    supabase.from("user_usage").select("ip, count"),
    // Today's generations
    supabase.from("user_usage").select("count").eq("date", today),
    // Total leads count
    supabase
      .from("snaplist_subscribers")
      .select("*", { count: "exact", head: true })
      .like("plan", "lead_%"),
    // Active subscribers count
    supabase
      .from("snaplist_subscribers")
      .select("*", { count: "exact", head: true })
      .in("plan", ["monthly", "annual"])
      .eq("status", "active"),
    // Top IPs by usage (all time)
    supabase
      .from("user_usage")
      .select("ip, count")
      .order("count", { ascending: false })
      .limit(10),
    // Recent leads
    supabase
      .from("snaplist_subscribers")
      .select("email, plan, status, created_at")
      .like("plan", "lead_%")
      .order("created_at", { ascending: false })
      .limit(20),
    // Recent subscribers
    supabase
      .from("snaplist_subscribers")
      .select("email, plan, status, created_at")
      .in("plan", ["monthly", "annual", "pro"])
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  // Parse results safely
  const usageData = usageStats.status === "fulfilled" ? (usageStats.value.data ?? []) : [];
  const todayData = todayStats.status === "fulfilled" ? (todayStats.value.data ?? []) : [];
  const totalGenerations = usageData.reduce((sum: number, row: { count: number }) => sum + (row.count || 0), 0);
  const uniqueIPs = new Set(usageData.map((r: { ip: string }) => r.ip)).size;
  const todayGenerations = todayData.reduce((sum: number, row: { count: number }) => sum + (row.count || 0), 0);

  const totalLeads = leadsResult.status === "fulfilled" ? (leadsResult.value.count ?? 0) : 0;
  const totalSubscribers = subscribersResult.status === "fulfilled" ? (subscribersResult.value.count ?? 0) : 0;

  // Top IPs by total usage (aggregate across dates)
  const ipTotals = new Map<string, number>();
  usageData.forEach((r: { ip: string; count: number }) => {
    ipTotals.set(r.ip, (ipTotals.get(r.ip) || 0) + (r.count || 0));
  });
  const topIPs = Array.from(ipTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));

  const recentLeads = recentLeadsResult.status === "fulfilled" ? (recentLeadsResult.value.data ?? []) : [];
  const recentSubscribers = recentSubsResult.status === "fulfilled" ? (recentSubsResult.value.data ?? []) : [];

  return NextResponse.json({
    totalUsers: uniqueIPs,
    totalGenerations,
    todayGenerations,
    totalLeads,
    totalSubscribers,
    topIPs,
    recentLeads,
    recentSubscribers,
  });
}
