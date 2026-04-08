import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const twentyFiveMinAgo = new Date(now.getTime() - 25 * 60 * 1000);

    const slots = await db.pod.findMany({
        where: {
            OR: [
                // Future and current slots
                {
                    scheduledFor: { gte: now, lte: in24Hours },
                    status: { in: ["SCHEDULED", "ACTIVE"] },
                },
                // Active pods that started up to 25 min ago
                {
                    scheduledFor: { gte: twentyFiveMinAgo, lt: now },
                    status: "ACTIVE",
                },
                // Any pod the user signed up for that isn't ended/cancelled
                {
                    signups: {
                        some: {
                            userId: user.id,
                            cancelledAt: null,
                        },
                    },
                    status: { in: ["SCHEDULED", "ACTIVE"] },
                },
            ],
        },
        include: {
            signups: {
                where: { cancelledAt: null },
                include: {
                    user: { select: { pseudonym: true } },
                },
            },
        },
        orderBy: { scheduledFor: "asc" },
    });
    // Check which slots user has signed up for
    const userSignups = await db.podSignup.findMany({
        where: { userId: user.id, cancelledAt: null },
        select: { podId: true, category: true },
    });

    const userSignupMap = new Map(userSignups.map((s) => [s.podId, s.category]));

    const result = slots.map((slot) => ({
        id: slot.id,
        scheduledFor: slot.scheduledFor,
        signupCount: slot.signups.length,
        userSignedUp: userSignupMap.has(slot.id),
        userCategory: userSignupMap.get(slot.id) || null,
    }));

    return NextResponse.json({
        slots: result,
        user: {
            pseudonym: user.pseudonym,
            podDailyCount: user.podDailyCount,
            podMonthlyCount: user.podMonthlyCount,
            podStreak: user.podStreak,
            plan: user.plan,
        },
    });
}