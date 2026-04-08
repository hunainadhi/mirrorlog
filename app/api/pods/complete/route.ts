import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { podId } = await req.json();
  if (!podId) return NextResponse.json({ error: "podId required" }, { status: 400 });

  // Mark member as completed
  const member = await db.podMember.findFirst({
    where: { podId, userId: user.id },
  });

  if (member) {
    await db.podMember.update({
      where: { id: member.id },
      data: { completedAt: new Date() },
    });
  }

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastPodDate = user.lastPodDate ? new Date(user.lastPodDate) : null;
  const lastPodDay = lastPodDate ? new Date(lastPodDate) : null;
  if (lastPodDay) lastPodDay.setHours(0, 0, 0, 0);

  let newStreak = user.podStreak;

  if (!lastPodDay) {
    newStreak = 1;
  } else if (lastPodDay.getTime() === yesterday.getTime()) {
    newStreak = user.podStreak + 1;
  } else if (lastPodDay.getTime() === today.getTime()) {
    // Already completed one today — keep streak
    newStreak = user.podStreak;
  } else {
    // Missed a day — reset
    newStreak = 1;
  }

  // Pro bonus: +1 pod at 3 and 5 day streak
  let bonusPods = 0;
  if (user.plan === "PRO" && (newStreak === 3 || newStreak === 5)) {
    bonusPods = 1;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      podStreak: newStreak,
      lastPodDate: new Date(),
      podDailyCount: bonusPods > 0
        ? { decrement: bonusPods } // give back a credit
        : undefined,
    },
  });

  return NextResponse.json({ streak: newStreak, bonusPods });
}