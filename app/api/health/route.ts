import { NextResponse } from "next/server";

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  // Note: NEXT_PUBLIC_STRIPE_KEY is optional — our checkout flow uses server-side sessions
  // (hosted Stripe checkout) and doesn't require the publishable key on the client

  const checks = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "sprint-12",
    env: {
      openrouter: !!process.env.OPENROUTER_API_KEY,
      supabase: !!process.env.SUPABASE_URL,
      stripe_secret: !!stripeKey,
      stripe_webhook: !!webhookSecret,
      telegram: !!process.env.TELEGRAM_BOT_TOKEN,
      base_url: process.env.NEXT_PUBLIC_BASE_URL || "not set",
    },
    warnings: [] as string[],
  };

  if (!webhookSecret) {
    checks.warnings.push("STRIPE_WEBHOOK_SECRET not set — Pro subscriptions won't activate after payment!");
  }
  if (!stripeKey || !stripeKey.startsWith("sk_live_")) {
    checks.warnings.push("Stripe secret key missing or not live mode — payments are not real");
  }
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    checks.warnings.push("TELEGRAM_BOT_TOKEN not set — new subscriber alerts disabled");
  }

  if (checks.warnings.length > 0) {
    checks.status = "degraded";
  }

  return NextResponse.json(checks);
}
