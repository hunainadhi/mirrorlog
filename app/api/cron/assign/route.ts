import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createDailyRoom } from "@/lib/daily";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fiveMinFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  // Mark expired pods as ENDED
  const expiredPods = await db.pod.findMany({
    where: {
      status: "ACTIVE",
      scheduledFor: {
        lte: new Date(now.getTime() - 25 * 60 * 1000),
      },
    },
  });

  for (const pod of expiredPods) {
    await db.pod.update({
      where: { id: pod.id },
      data: { status: "ENDED", endsAt: new Date() },
    });
  }

  // Find slots starting in the next 5 minutes that haven't been assigned yet
  const upcomingSlots = await db.pod.findMany({
    where: {
      scheduledFor: { lte: fiveMinFromNow, gte: now },
      status: "SCHEDULED",
      dailyRoomName: null,
    },
    include: {
      signups: {
        where: { cancelledAt: null },
        include: { user: true },
      },
    },
  });

  let assignedPods = 0;

  for (const slot of upcomingSlots) {
    const signups = slot.signups;
    if (signups.length === 0) {
      await db.pod.update({
        where: { id: slot.id },
        data: { status: "CANCELLED" },
      });
      continue;
    }

    // Group signups by category first
    const categoryGroups: Record<string, typeof signups> = {};
    for (const signup of signups) {
      const cat = signup.category;
      if (!categoryGroups[cat]) categoryGroups[cat] = [];
      categoryGroups[cat].push(signup);
    }

    // Create pods of max 5 — try to keep same category together
    const pods: typeof signups[] = [];
    let currentPod: typeof signups = [];

    for (const cat of Object.keys(categoryGroups)) {
      for (const signup of categoryGroups[cat]) {
        if (currentPod.length >= 5) {
          pods.push(currentPod);
          currentPod = [];
        }
        currentPod.push(signup);
      }
    }
    if (currentPod.length > 0) pods.push(currentPod);

    // Create a Daily room and pod record for each group
    for (const group of pods) {
      const roomName = `mirrorpod-${slot.id}-${Date.now()}`;
      const room = await createDailyRoom(roomName, 60);

      const isFirstGroup = pods.indexOf(group) === 0;

      let podRecord;
      if (isFirstGroup) {
        podRecord = await db.pod.update({
          where: { id: slot.id },
          data: {
            dailyRoomUrl: room.url,
            dailyRoomName: roomName,
            category: group[0].category,
          },
        });
      } else {
        podRecord = await db.pod.create({
          data: {
            scheduledFor: slot.scheduledFor,
            status: "SCHEDULED",
            dailyRoomUrl: room.url,
            dailyRoomName: roomName,
            category: group[0].category,
            duration: slot.duration,
          },
        });
      }

      for (const signup of group) {
        await db.podSignup.update({
          where: { id: signup.id },
          data: { podId: podRecord.id },
        });
      }

      assignedPods++;
    }
  }

  return NextResponse.json({ assignedPods });
}

export async function POST(req: Request) {
  return GET(req);
}