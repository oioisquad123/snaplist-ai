import { NextRequest, NextResponse } from "next/server";

/**
 * Coupon validation API
 * GET /api/coupon?code=POSHMARK20
 * POST /api/coupon { code: "POSHMARK20", plan: "monthly" }
 */

interface Coupon {
  code: string;
  discountPercent: number;
  label: string;
  validUntil?: string; // ISO date
  maxUses?: number;
  description: string;
}

// Hardcoded coupons — add new ones here
const COUPONS: Record<string, Coupon> = {
  POSHMARK20: {
    code: "POSHMARK20",
    discountPercent: 20,
    label: "20% Off",
    description: "20% off for Poshmark community members",
    validUntil: "2026-05-31",
  },
  FLIPPROFIT: {
    code: "FLIPPROFIT",
    discountPercent: 25,
    label: "25% Off",
    description: "25% off for FlipProfit users",
    validUntil: "2026-06-30",
  },
  LAUNCH50: {
    code: "LAUNCH50",
    discountPercent: 50,
    label: "50% Off Launch Special",
    description: "50% off launch week special",
    validUntil: "2026-04-14",
  },
  RESELLER10: {
    code: "RESELLER10",
    discountPercent: 10,
    label: "10% Off",
    description: "10% off for resellers",
  },
};

function isCouponValid(coupon: Coupon): { valid: boolean; reason?: string } {
  if (coupon.validUntil) {
    const expiry = new Date(coupon.validUntil);
    if (new Date() > expiry) {
      return { valid: false, reason: "This coupon has expired" };
    }
  }
  return { valid: true };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const coupon = COUPONS[code];
  if (!coupon) {
    return NextResponse.json({ error: "Invalid coupon code", valid: false }, { status: 404 });
  }

  const { valid, reason } = isCouponValid(coupon);
  if (!valid) {
    return NextResponse.json({ error: reason, valid: false }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    label: coupon.label,
    description: coupon.description,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
