import { NextRequest, NextResponse } from "next/server";

// Internal notification endpoint — called after new subscriber/lead
// Sends alert to Bayu via Telegram bot
// POST /api/notify { type: "subscriber"|"lead", email, plan?, amount? }

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID || "8080996292";

async function sendTelegram(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("TELEGRAM_BOT_TOKEN not set — skipping notification");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error("Telegram notification failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Basic auth — only internal calls
  const authHeader = req.headers.get("x-notify-key");
  const expectedKey = process.env.NOTIFY_KEY || "snaplist-notify-2026";

  if (authHeader !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, email, plan, amount } = await req.json();

    let message = "";

    if (type === "subscriber") {
      const planStr = plan === "annual" ? "Annual ($79/yr)" : "Monthly ($9.99/mo)";
      const amountStr = amount ? ` — $${amount}` : "";
      message = `💰 <b>New SnapList Pro subscriber!</b>

📧 Email: ${email || "unknown"}
💳 Plan: ${planStr}${amountStr}

Check Stripe: https://dashboard.stripe.com/customers`;
    } else if (type === "lead") {
      message = `📧 <b>New SnapList lead captured!</b>

Email: ${email || "unknown"}
Plan interest: ${plan || "free limit wall"}

Total leads growing — nice!`;
    } else if (type === "milestone") {
      message = `🎉 <b>SnapList AI milestone!</b>

${email || "Unknown milestone"} — ${plan || ""}`;
    } else {
      message = `📊 SnapList AI notification: ${type} — ${email || ""}`;
    }

    const sent = await sendTelegram(message);

    return NextResponse.json({ success: true, notified: sent });
  } catch (err) {
    console.error("Notify error:", err);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}

// GET — quick health check for notification system
export async function GET() {
  return NextResponse.json({
    status: "ok",
    telegram: !!TELEGRAM_BOT_TOKEN,
    chatId: TELEGRAM_CHAT_ID ? "configured" : "missing",
  });
}
