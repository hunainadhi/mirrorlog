import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPodReminderEmail } from "@/lib/email";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in15Min = new Date(now.getTime() + 15 * 60 * 1000);
  const in20Min = new Date(now.getTime() + 20 * 60 * 1000);

  // Find pods starting in 15-20 minutes
  const upcomingPods = await db.pod.findMany({
    where: {
      scheduledFor: { gte: in15Min, lte: in20Min },
      status: "SCHEDULED",
    },
    include: {
      signups: {
        where: { cancelledAt: null },
        include: { user: true },
      },
    },
  });

  let sent = 0;
  let failed = 0;

  for (const pod of upcomingPods) {
    for (const signup of pod.signups) {
      try {
        await sendPodReminderEmail({
          to: signup.user.email,
          name: signup.user.name || "there",
          scheduledFor: pod.scheduledFor,
          category: signup.category,
          podId: pod.id,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send reminder to ${signup.user.email}:`, err);
        failed++;
      }
    }
  }

  return NextResponse.json({ sent, failed });
}

export async function POST(req: Request) {
  return GET(req);
}