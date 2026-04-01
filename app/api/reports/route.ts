import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");
  if (!habitId) return NextResponse.json({ error: "habitId required" }, { status: 400 });

  // Verify habit belongs to user
  const habit = await db.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });
  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  // Get all ratings for this habit
  const allRatings = await db.rating.findMany({
    where: { habitId },
    orderBy: { weekStart: "asc" },
  });

  // Group by week
  const weekMap: Record<string, { self: number | null; circle: number[]; notes: string[] }> = {};

  for (const rating of allRatings) {
    const key = rating.weekStart.toISOString();
    if (!weekMap[key]) {
      weekMap[key] = { self: null, circle: [], notes: [] };
    }

    if (rating.raterId === null) {
      // Self rating
      weekMap[key].self = rating.score;
    } else {
      // Circle rating
      weekMap[key].circle.push(rating.score);
      if (rating.note) weekMap[key].notes.push(rating.note);
    }
  }

  // Build report weeks
  const weeks = Object.entries(weekMap).map(([weekStart, data]) => {
    const circleAvg =
      data.circle.length > 0
        ? parseFloat(
            (data.circle.reduce((a, b) => a + b, 0) / data.circle.length).toFixed(1)
          )
        : null;

    const gap =
      data.self !== null && circleAvg !== null
        ? parseFloat((circleAvg - data.self).toFixed(1))
        : null;

    return {
      weekStart,
      selfScore: data.self,
      circleScore: circleAvg,
      circleCount: data.circle.length,
      gapScore: gap,
      notes: data.notes,
    };
  });

  return NextResponse.json({ habit, weeks });
}