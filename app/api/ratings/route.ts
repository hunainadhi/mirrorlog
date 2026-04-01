import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { raterId, habitId, weekStart, score, note } = await req.json();

  if (!raterId || !habitId || !weekStart || !score) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate score range
  if (score < 1 || score > 5) {
    return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 });
  }

  // Make sure the rater exists
  const rater = await db.rater.findUnique({ where: { id: raterId } });
  if (!rater) return NextResponse.json({ error: "Rater not found" }, { status: 404 });

  // Prevent double rating same week
  const existing = await db.rating.findFirst({
    where: { raterId, weekStart: new Date(weekStart) },
  });

  if (existing) {
    return NextResponse.json({ error: "Already rated this week" }, { status: 409 });
  }

  const rating = await db.rating.create({
    data: {
      raterId,
      habitId,
      weekStart: new Date(weekStart),
      score,
      note,
    },
  });

  return NextResponse.json(rating, { status: 201 });
}