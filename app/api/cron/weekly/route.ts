import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWeeklyNudgeEmail } from "@/lib/email";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Include the user (owner) when fetching habits
  const habits = await db.habit.findMany({
    where: { active: true },
    include: {
      raters: true,
      user: true,
    },
  });

  let sent = 0;
  let failed = 0;

  for (const habit of habits) {
    for (const rater of habit.raters) {
      try {
        await sendWeeklyNudgeEmail({
          to: rater.email,
          nickname: rater.nickname,
          habitTitle: habit.title,
          token: rater.token,
          ownerName: habit.user.name || habit.user.email,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send nudge to ${rater.email}:`, err);
        failed++;
      }
    }
  }

  return NextResponse.json({ sent, failed });
}