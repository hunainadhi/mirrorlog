import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWeeklyNudgeEmail, sendOwnerReportEmail } from "@/lib/email";

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const sunday = new Date(now.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

function getLastWeekStart(): Date {
  const weekStart = getWeekStart();
  const lastWeek = new Date(weekStart);
  lastWeek.setDate(lastWeek.getDate() - 7);
  return lastWeek;
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSunday = new Date().getDay() === 0;
  const isMonday = new Date().getDay() === 1;
  
  const habits = await db.habit.findMany({
    where: { active: true },
    include: { raters: true, user: true },
  });

  let sent = 0;
  let failed = 0;

  // Sunday — send nudge emails to raters
  if (isSunday) {
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
  }

  // Monday — send MirrorReport emails to owners
  if (isMonday) {
    const lastWeekStart = getLastWeekStart();

    for (const habit of habits) {
      try {
        // Get all ratings for last week
        const allRatings = await db.rating.findMany({
          where: { habitId: habit.id, weekStart: lastWeekStart },
        });

        const selfRating = allRatings.find((r) => r.raterId === null);
        const circleRatings = allRatings.filter((r) => r.raterId !== null);
        const notes = circleRatings.map((r) => r.note).filter(Boolean) as string[];

        const circleAvg =
          circleRatings.length > 0
            ? parseFloat(
                (
                  circleRatings.reduce((a, b) => a + b.score, 0) /
                  circleRatings.length
                ).toFixed(1)
              )
            : null;

        const gapScore =
          selfRating && circleAvg !== null
            ? parseFloat((circleAvg - selfRating.score).toFixed(1))
            : null;

        // Only send if there's at least some data
        if (selfRating || circleRatings.length > 0) {
          await sendOwnerReportEmail({
            to: habit.user.email,
            name: habit.user.name || "there",
            habitTitle: habit.title,
            habitId: habit.id,
            selfScore: selfRating?.score ?? null,
            circleScore: circleAvg,
            gapScore,
            circleCount: circleRatings.length,
            notes,
          });
          sent++;
        }
      } catch (err) {
        console.error(`Failed to send report to ${habit.user.email}:`, err);
        failed++;
      }
    }
  }

  return NextResponse.json({ sent, failed });
}

export async function GET(req: Request) {
  return POST(req);
}