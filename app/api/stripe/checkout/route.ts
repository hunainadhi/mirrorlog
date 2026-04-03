import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { priceId } = await req.json();
  if (!priceId) return NextResponse.json({ error: "priceId required" }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Create or retrieve Stripe customer
  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    // Save customer ID to DB
    const { db } = await import("@/lib/db");
    await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/settings`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: session.url });
}