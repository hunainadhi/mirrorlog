import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const FREE_HABIT_LIMIT = 1;
const PRO_HABIT_LIMIT = 5;

// GET /api/habits — fetch all habits for logged in user
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const habits = await db.habit.findMany({
    where: { userId: user.id, active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(habits);
}

// POST /api/habits — create a new habit
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check habit limit based on plan
  const habitCount = await db.habit.count({
    where: { userId: user.id, active: true },
  });

  const limit = user.plan === "PRO" ? PRO_HABIT_LIMIT : FREE_HABIT_LIMIT;

  if (habitCount >= limit) {
    return NextResponse.json(
      { error: `You've reached the ${user.plan} plan limit of ${limit} habit(s). Upgrade to Pro for more.` },
      { status: 403 }
    );
  }

  const { title, description } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const habit = await db.habit.create({
    data: {
      userId: user.id,
      title,
      description,
    },
  });

  return NextResponse.json(habit, { status: 201 });
}