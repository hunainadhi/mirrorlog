import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const sunday = new Date(now.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

// GET /api/self-rating?habitId=xxx — check if already self rated this week
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");
  if (!habitId) return NextResponse.json({ error: "habitId required" }, { status: 400 });

  const weekStart = getWeekStart();

  const existing = await db.rating.findFirst({
    where: {
      habitId,
      raterId: null,
      weekStart,
    },
  });

  return NextResponse.json({ rated: !!existing, score: existing?.score ?? null });
}

// POST /api/self-rating — owner rates themselves
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habitId, score } = await req.json();

  if (!habitId || !score) {
    return NextResponse.json({ error: "habitId and score required" }, { status: 400 });
  }

  if (score < 1 || score > 5) {
    return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 });
  }

  // Verify habit belongs to user
  const habit = await db.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });
  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  const weekStart = getWeekStart();

  // Prevent double self-rating
  const existing = await db.rating.findFirst({
    where: { habitId, raterId: null, weekStart },
  });
  if (existing) {
    return NextResponse.json({ error: "Already self-rated this week" }, { status: 409 });
  }

  const rating = await db.rating.create({
    data: {
      habitId,
      raterId: null,
      weekStart,
      score,
    },
  });

  return NextResponse.json(rating, { status: 201 });
}