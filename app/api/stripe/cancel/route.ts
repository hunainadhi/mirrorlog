import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.stripeSubId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  // Cancel at period end so they keep Pro until billing cycle ends
  await stripe.subscriptions.update(user.stripeSubId, {
    cancel_at_period_end: true,
  });

  return NextResponse.json({ success: true });
}