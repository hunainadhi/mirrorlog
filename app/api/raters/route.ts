import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateToken } from "@/lib/tokens";

const FREE_RATER_LIMIT = 3;
const PRO_RATER_LIMIT = 8;

// GET /api/raters?habitId=xxx — get all raters for a habit
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const habitId = searchParams.get("habitId");

  if (!habitId) return NextResponse.json({ error: "habitId required" }, { status: 400 });

  // Make sure this habit belongs to the logged in user
  const habit = await db.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });

  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  const raters = await db.rater.findMany({
    where: { habitId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(raters);
}

// POST /api/raters — invite a new rater
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { habitId, email, nickname } = await req.json();

  if (!habitId || !email) {
    return NextResponse.json({ error: "habitId and email are required" }, { status: 400 });
  }

  // Make sure this habit belongs to the logged in user
  const habit = await db.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });

  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  // Check rater limit
  const raterCount = await db.rater.count({ where: { habitId } });
  const limit = user.plan === "PRO" ? PRO_RATER_LIMIT : FREE_RATER_LIMIT;

  if (raterCount >= limit) {
    return NextResponse.json(
      { error: `You've reached the ${user.plan} plan limit of ${limit} rater(s).` },
      { status: 403 }
    );
  }

  // Check if this email is already a rater for this habit
  const existing = await db.rater.findFirst({ where: { habitId, email } });
  if (existing) {
    return NextResponse.json(
      { error: "This email is already a rater for this habit." },
      { status: 409 }
    );
  }

  const token = generateToken();

  const rater = await db.rater.create({
    data: { habitId, email, nickname, token },
  });

  return NextResponse.json(rater, { status: 201 });
}