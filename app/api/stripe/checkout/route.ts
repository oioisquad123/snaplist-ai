import { NextRequest, NextResponse } from "next/server";

const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  annual: process.env.STRIPE_PRICE_ANNUAL || "",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snaplist-ai-beta.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe not configured yet. Coming soon!" },
        { status: 503 }
      );
    }

    const { plan, email } = await req.json();

    if (!plan || !(plan in PRICES)) {
      return NextResponse.json(
        { error: "Invalid plan. Choose 'monthly' or 'annual'" },
        { status: 400 }
      );
    }

    const priceId = PRICES[plan as keyof typeof PRICES];

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured for this plan. Contact support." },
        { status: 503 }
      );
    }

    // Lazy import Stripe to avoid module-load error when key is missing
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2026-02-25.clover",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/#pricing`,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan") || "monthly";

  return NextResponse.redirect(`${BASE_URL}/checkout?plan=${plan}`);
}
