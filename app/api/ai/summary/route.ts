import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateMirrorSummary } from "@/lib/ai";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.plan !== "PRO") {
    return NextResponse.json({ error: "AI summaries are a Pro feature" }, { status: 403 });
  }

  const { habitId, weekStart } = await req.json();
  if (!habitId || !weekStart) {
    return NextResponse.json({ error: "habitId and weekStart required" }, { status: 400 });
  }

  // Verify habit belongs to user
  const habit = await db.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });
  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  // Get this week's ratings
  const weekDate = new Date(weekStart);
  const allRatings = await db.rating.findMany({
    where: { habitId, weekStart: weekDate },
  });

  const selfRating = allRatings.find((r) => r.raterId === null);
  const circleRatings = allRatings.filter((r) => r.raterId !== null);
  const notes = circleRatings.map((r) => r.note).filter(Boolean) as string[];

  const circleAvg =
    circleRatings.length > 0
      ? parseFloat(
          (
            circleRatings.reduce((a, b) => a + b.score, 0) / circleRatings.length
          ).toFixed(1)
        )
      : null;

  const gapScore =
    selfRating && circleAvg !== null
      ? parseFloat((circleAvg - selfRating.score).toFixed(1))
      : null;

  // Get previous weeks for trend
  const previousRatings = await db.rating.findMany({
    where: {
      habitId,
      weekStart: { lt: weekDate },
    },
    orderBy: { weekStart: "desc" },
    take: 12,
  });

  // Group previous weeks
  const prevWeekMap: Record<string, { self: number | null; circle: number[] }> = {};
  for (const r of previousRatings) {
    const key = r.weekStart.toISOString();
    if (!prevWeekMap[key]) prevWeekMap[key] = { self: null, circle: [] };
    if (r.raterId === null) prevWeekMap[key].self = r.score;
    else prevWeekMap[key].circle.push(r.score);
  }

  const previousWeeks = Object.values(prevWeekMap).map((w) => {
    const circleAvg =
      w.circle.length > 0
        ? parseFloat((w.circle.reduce((a, b) => a + b, 0) / w.circle.length).toFixed(1))
        : null;
    return {
      selfScore: w.self,
      circleScore: circleAvg,
      gapScore:
        w.self !== null && circleAvg !== null
          ? parseFloat((circleAvg - w.self).toFixed(1))
          : null,
    };
  });

  const summary = await generateMirrorSummary({
    habitTitle: habit.title,
    selfScore: selfRating?.score ?? null,
    circleScore: circleAvg,
    gapScore,
    circleCount: circleRatings.length,
    notes,
    previousWeeks,
  });

  return NextResponse.json({ summary });
}