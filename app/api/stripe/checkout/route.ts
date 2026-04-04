import { NextRequest, NextResponse } from "next/server";

const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  annual: process.env.STRIPE_PRICE_ANNUAL || "",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://snaplist-ai-beta.vercel.app";

const COUPON_MAP: Record<string, { percent_off: number; name: string }> = {
  POSHMARK20: { percent_off: 20, name: "Poshmark Community 20% Off" },
  FLIPPROFIT: { percent_off: 25, name: "FlipProfit 25% Off" },
  LAUNCH50: { percent_off: 50, name: "Launch Week 50% Off" },
  RESELLER10: { percent_off: 10, name: "Reseller 10% Off" },
};

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe not configured yet. Coming soon!" },
        { status: 503 }
      );
    }

    const { plan, email, coupon } = await req.json();

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

    // Resolve Stripe coupon ID from promo code if provided
    let stripeCouponId: string | undefined;
    if (coupon) {
      const couponKey = coupon.toUpperCase();
      const couponDef = COUPON_MAP[couponKey];
      if (couponDef) {
        try {
          try {
            const existing = await stripe.coupons.retrieve(couponKey);
            stripeCouponId = existing.id;
          } catch {
            const created = await stripe.coupons.create({
              id: couponKey,
              percent_off: couponDef.percent_off,
              duration: "once",
              name: couponDef.name,
            });
            stripeCouponId = created.id;
          }
        } catch (couponErr) {
          console.warn("Coupon setup failed, proceeding without discount:", couponErr);
        }
      }
    }

    // Build session — two code paths to satisfy TypeScript discriminated union
    let session;
    if (stripeCouponId) {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email || undefined,
        success_url: `${BASE_URL}/success`,
        cancel_url: `${BASE_URL}/#pricing`,
        metadata: { plan, coupon: coupon || "" },
        discounts: [{ coupon: stripeCouponId }],
      });
    } else {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: email || undefined,
        success_url: `${BASE_URL}/success`,
        cancel_url: `${BASE_URL}/#pricing`,
        metadata: { plan, coupon: coupon || "" },
        allow_promotion_codes: true,
      });
    }

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
