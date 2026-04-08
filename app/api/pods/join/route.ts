import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createDailyRoom, createDailyToken } from "@/lib/daily";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { podId, task } = await req.json();
  if (!podId || !task) {
    return NextResponse.json({ error: "podId and task required" }, { status: 400 });
  }

  // Verify user has a signup for this pod
  const signup = await db.podSignup.findFirst({
    where: { podId, userId: user.id, cancelledAt: null },
  });
  if (!signup) {
    return NextResponse.json({ error: "You are not signed up for this pod" }, { status: 403 });
  }

  const pod = await db.pod.findUnique({
    where: { id: podId },
    include: { members: true, signups: { where: { cancelledAt: null } } },
  });
  if (!pod) return NextResponse.json({ error: "Pod not found" }, { status: 404 });

  // Create Daily room if not exists
  let roomUrl = pod.dailyRoomUrl;
  let roomName = pod.dailyRoomName;

  if (!roomUrl) {
    roomName = `mirrorpod-${podId}`;
    const room = await createDailyRoom(roomName, 60);
    roomUrl = room.url;

    await db.pod.update({
      where: { id: podId },
      data: {
        dailyRoomUrl: roomUrl,
        dailyRoomName: roomName,
        status: "ACTIVE",
        startedAt: new Date(),
        endsAt: new Date(Date.now() + pod.duration * 60 * 1000),
      },
    });
  }

  // Add as member if not already
const existingMember = await db.podMember.findFirst({
  where: { podId, userId: user.id },
});

const isNewJoin = !existingMember;

if (isNewJoin) {
  await db.podMember.create({
    data: { podId, userId: user.id, task },
  });

  // Only increment counts on first join
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastPodDate = user.lastPodDate ? new Date(user.lastPodDate) : null;
  const isNewDay = !lastPodDate || lastPodDate < today;

  await db.user.update({
    where: { id: user.id },
    data: {
      podDailyCount: isNewDay ? 1 : { increment: 1 },
      podMonthlyCount: { increment: 1 },
      lastPodDate: new Date(),
    },
  });
}
  // Generate Daily token
  const token = await createDailyToken(roomName!, user.pseudonym || user.name || user.email);

  return NextResponse.json({ token, roomUrl, roomName });
}