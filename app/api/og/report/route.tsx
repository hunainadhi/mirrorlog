import { ImageResponse } from "@vercel/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get("habitId");
    const weekStart = searchParams.get("weekStart");

    if (!habitId || !weekStart) {
        return new Response("Missing params", { status: 400 });
    }

    const habit = await db.habit.findUnique({
        where: { id: habitId },
        include: { user: true },
    });
    if (!habit) return new Response("Not found", { status: 404 });

    const weekDate = new Date(weekStart);
    const allRatings = await db.rating.findMany({
        where: { habitId, weekStart: weekDate },
    });

    const selfRating = allRatings.find((r) => r.raterId === null);
    const circleRatings = allRatings.filter((r) => r.raterId !== null);

    const circleAvg =
        circleRatings.length > 0
            ? parseFloat(
                (
                    circleRatings.reduce((a, b) => a + b.score, 0) /
                    circleRatings.length
                ).toFixed(1)
            )
            : null;

    const gapScore =
        selfRating && circleAvg !== null
            ? parseFloat((circleAvg - selfRating.score).toFixed(1))
            : null;

    const gapColor =
        gapScore === null ? "#6b6860" : gapScore >= 0 ? "#c9f97f" : "#ff6b6b";
    const gapLabel =
        gapScore === null ? "—" : gapScore > 0 ? `+${gapScore}` : `${gapScore}`;

    const scores = [
        { label: "YOU", value: String(selfRating?.score ?? "—"), color: "#f0ede8" },
        { label: "CIRCLE", value: String(circleAvg ?? "—"), color: "#c9f97f" },
        { label: "GAP", value: gapLabel, color: gapColor },
    ];

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background: "#0a0a0a",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "60px",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "#f0ede8", fontSize: "28px", fontWeight: 700, margin: 0 }}>
                        MirrorLog
                    </p>
                    <p style={{ color: "#6b6860", fontSize: "18px", margin: 0 }}>
                        {habit.user.name || habit.user.email}'s MirrorReport
                    </p>
                </div>

                {/* Habit */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ color: "#6b6860", fontSize: "16px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Habit
                    </p>
                    <p style={{ color: "#f0ede8", fontSize: "40px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                        {habit.title}
                    </p>
                </div>

                {/* Scores */}
                <div style={{ display: "flex", gap: "24px" }}>
                    {scores.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                flex: 1,
                                background: "#111",
                                borderRadius: "16px",
                                padding: "28px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                border: "1px solid #1e1e1e",
                            }}
                        >
                            <p style={{ color: "#6b6860", fontSize: "14px", margin: "0 0 12px", letterSpacing: "0.1em" }}>
                                {item.label}
                            </p>
                            <p style={{ color: item.color, fontSize: "56px", fontWeight: 700, margin: 0 }}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "#6b6860", fontSize: "16px", margin: 0 }}>
                        {new Date(weekStart).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                    <p style={{ color: "#6b6860", fontSize: "16px", margin: 0 }}>
                        mirrorlog.org
                    </p>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}