/**
 * Usage tracking — in-memory fallback + Supabase when configured
 */

interface UsageRecord {
  count: number;
  date: string;
}

// In-memory fallback for when Supabase isn't configured
const memoryStore = new Map<string, UsageRecord>();

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getUsage(ip: string): Promise<UsageRecord> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data } = await supabase
        .from("user_usage")
        .select("count")
        .eq("ip", ip)
        .eq("date", today())
        .single();

      return { count: data?.count ?? 0, date: today() };
    } catch (err) {
      console.warn("Supabase usage read failed, using memory:", err);
    }
  }

  // Memory fallback
  const key = `${ip}:${today()}`;
  return memoryStore.get(key) ?? { count: 0, date: today() };
}

export async function incrementUsage(ip: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const current = await getUsage(ip);

      await supabase.from("user_usage").upsert(
        {
          ip,
          date: today(),
          count: current.count + 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "ip,date" }
      );
      return;
    } catch (err) {
      console.warn("Supabase usage write failed, using memory:", err);
    }
  }

  // Memory fallback
  const key = `${ip}:${today()}`;
  const current = memoryStore.get(key) ?? { count: 0, date: today() };
  memoryStore.set(key, { ...current, count: current.count + 1 });
}
