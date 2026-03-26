import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-02-25.clover" });

    if (webhookSecret && signature) {
      // Verify signature in production
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev mode — parse without verification
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const email = session.customer_email || session.customer_details?.email;
          const customerId = session.customer;
          const subscriptionId = session.subscription;
          const plan = session.metadata?.plan || "monthly";

          if (email) {
            await supabase.from("snaplist_subscribers").upsert(
              {
                email,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                plan,
                status: "active",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "email" }
            );
            console.log(`✅ New subscriber: ${email} (${plan})`);
          }
          break;
        }

        case "customer.subscription.updated": {
          const sub = event.data.object;
          const status = sub.status; // active, past_due, canceled, etc.
          const subscriptionId = sub.id;

          await supabase
            .from("snaplist_subscribers")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);

          console.log(`📦 Subscription ${subscriptionId} → ${status}`);
          break;
        }

        case "customer.subscription.deleted": {
          const sub = event.data.object;
          const subscriptionId = sub.id;

          await supabase
            .from("snaplist_subscribers")
            .update({ status: "canceled", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);

          console.log(`❌ Subscription canceled: ${subscriptionId}`);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          const subscriptionId = invoice.subscription;

          await supabase
            .from("snaplist_subscribers")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subscriptionId);

          console.log(`⚠️ Payment failed for subscription: ${subscriptionId}`);
          break;
        }

        default:
          console.log(`Unhandled event: ${event.type}`);
      }
    } catch (dbErr) {
      console.error("Database error in webhook:", dbErr);
      // Don't fail the webhook — return 200 so Stripe doesn't retry
    }
  }

  return NextResponse.json({ received: true });
}
