import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const FREE_DAILY_LIMIT = 2;
const FREE_MONTHLY_LIMIT = 10;
const PRO_DAILY_LIMIT = 6;
const PRO_MONTHLY_LIMIT = 30;

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { podId, category } = await req.json();
  if (!podId || !category) {
    return NextResponse.json({ error: "podId and category required" }, { status: 400 });
  }

  // Check pod exists and is still schedulable
  const pod = await db.pod.findUnique({ where: { id: podId } });
  if (!pod) return NextResponse.json({ error: "Pod not found" }, { status: 404 });
  if (pod.status !== "SCHEDULED") {
    return NextResponse.json({ error: "Pod is no longer available" }, { status: 400 });
  }

  // Check not signing up within 5 min of start
  const fiveMinBefore = new Date(pod.scheduledFor.getTime() - 5 * 60 * 1000);
  if (new Date() > fiveMinBefore) {
    return NextResponse.json({ error: "Too late to sign up — pod starts in less than 5 minutes" }, { status: 400 });
  }

  // Check daily and monthly limits
  const dailyLimit = user.plan === "PRO" ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const monthlyLimit = user.plan === "PRO" ? PRO_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT;

  // Reset daily count if last pod was yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastPodDate = user.lastPodDate ? new Date(user.lastPodDate) : null;
  const isNewDay = !lastPodDate || lastPodDate < today;

  const currentDailyCount = isNewDay ? 0 : user.podDailyCount;

  if (currentDailyCount >= dailyLimit) {
    return NextResponse.json({
      error: `You've reached your daily limit of ${dailyLimit} pods. ${user.plan === "FREE" ? "Upgrade to Pro for more." : ""}`,
    }, { status: 403 });
  }

  if (user.podMonthlyCount >= monthlyLimit) {
    return NextResponse.json({
      error: `You've reached your monthly limit of ${monthlyLimit} pods.`,
    }, { status: 403 });
  }

  // Check already signed up
  const existing = await db.podSignup.findFirst({
    where: { podId, userId: user.id, cancelledAt: null },
  });
  if (existing) {
    return NextResponse.json({ error: "Already signed up for this slot" }, { status: 409 });
  }

  const signup = await db.podSignup.create({
    data: { podId, userId: user.id, category },
  });

  return NextResponse.json(signup, { status: 201 });
}

// Cancel signup
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const podId = searchParams.get("podId");
  if (!podId) return NextResponse.json({ error: "podId required" }, { status: 400 });

  const pod = await db.pod.findUnique({ where: { id: podId } });
  if (!pod) return NextResponse.json({ error: "Pod not found" }, { status: 404 });

  // Check if cancelling within 5 min — penalize
  const fiveMinBefore = new Date(pod.scheduledFor.getTime() - 5 * 60 * 1000);
  const isLateCancellation = new Date() > fiveMinBefore;

  const signup = await db.podSignup.findFirst({
    where: { podId, userId: user.id, cancelledAt: null },
  });

  if (!signup) return NextResponse.json({ error: "Signup not found" }, { status: 404 });

  await db.podSignup.update({
    where: { id: signup.id },
    data: { cancelledAt: new Date() },
  });

  // Penalize late cancellation — deduct 1 from daily count
  if (isLateCancellation) {
    await db.user.update({
      where: { id: user.id },
      data: { podDailyCount: { increment: 1 } },
    });
    return NextResponse.json({ cancelled: true, penalized: true });
  }

  return NextResponse.json({ cancelled: true, penalized: false });
}