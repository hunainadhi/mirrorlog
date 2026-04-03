import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      if (!userId) break;

      await db.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          stripeSubId: session.subscription,
          stripePriceId: session.line_items?.data[0]?.price?.id,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const user = await db.user.findFirst({
        where: { stripeCustomerId: sub.customer },
      });
      if (!user) break;

      await db.user.update({
        where: { id: user.id },
        data: {
          plan: sub.status === "active" ? "PRO" : "FREE",
          stripePriceId: sub.items.data[0]?.price?.id,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const user = await db.user.findFirst({
        where: { stripeCustomerId: sub.customer },
      });
      if (!user) break;

      await db.user.update({
        where: { id: user.id },
        data: { plan: "FREE", stripeSubId: null, stripePriceId: null },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}