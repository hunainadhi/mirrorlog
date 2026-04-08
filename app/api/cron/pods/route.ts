import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Runs every 30 minutes via Vercel cron
// Creates pod slots for the next 24 hours

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Round up to next 30 min slot
  const nextSlot = new Date(now);
  nextSlot.setSeconds(0);
  nextSlot.setMilliseconds(0);
  const minutes = nextSlot.getMinutes();
  if (minutes < 30) {
    nextSlot.setMinutes(30);
  } else {
    nextSlot.setMinutes(0);
    nextSlot.setHours(nextSlot.getHours() + 1);
  }

  let created = 0;
  const slot = new Date(nextSlot);

  while (slot <= in24Hours) {
    // Check if slot already exists
    const existing = await db.pod.findFirst({
      where: { scheduledFor: slot, status: "SCHEDULED" },
    });

    if (!existing) {
      await db.pod.create({
        data: {
          scheduledFor: new Date(slot),
          status: "SCHEDULED",
        },
      });
      created++;
    }

    // Next slot 30 min later
    slot.setMinutes(slot.getMinutes() + 30);
  }

  return NextResponse.json({ created });
}

export async function POST(req: Request) {
  return GET(req);
}