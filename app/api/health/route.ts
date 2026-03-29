import { NextResponse } from "next/server";

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_KEY || "";

  const checks = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "sprint-8",
    env: {
      openrouter: !!process.env.OPENROUTER_API_KEY,
      supabase: !!process.env.SUPABASE_URL,
      stripe_secret: !!stripeKey,
      stripe_public: !!stripePublicKey,
      stripe_webhook: !!webhookSecret,
      base_url: process.env.NEXT_PUBLIC_BASE_URL || "not set",
    },
    warnings: [] as string[],
  };

  if (!webhookSecret) {
    checks.warnings.push("STRIPE_WEBHOOK_SECRET not set — Pro subscriptions won't activate after payment!");
  }
  if (!stripePublicKey) {
    checks.warnings.push("NEXT_PUBLIC_STRIPE_KEY not set — checkout page may not render correctly");
  }
  if (!stripeKey.startsWith("sk_live_")) {
    checks.warnings.push("Using test Stripe key — payments are not real");
  }

  if (checks.warnings.length > 0) {
    checks.status = "degraded";
  }

  return NextResponse.json(checks);
}
