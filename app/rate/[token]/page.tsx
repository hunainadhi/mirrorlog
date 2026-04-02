import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import RaterForm from "@/components/rater/RaterForm";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function RatePage({ params }: Props) {
  const { token } = await params;

  const rater = await db.rater.findUnique({
    where: { token },
    include: { habit: true },
  });
  if (!rater) return notFound();

  // Check if already rated this week
  const weekStart = getWeekStart();
  const existingRating = await db.rating.findFirst({
    where: {
      raterId: rater.id,
      weekStart,
    },
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.8rem",
            color: "var(--text)",
            marginBottom: "8px",
          }}
        >
          MirrorLog
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "40px" }}>
          Your friend is using MirrorLog to build better habits. Be their mirror — rate their consistency honestly.
        </p>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
            Habit
          </p>
          <p style={{ color: "var(--text)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "6px" }}>
            {rater.habit.title}
          </p>
          {rater.habit.description && (
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "24px" }}>
              {rater.habit.description}
            </p>
          )}

          {existingRating ? (
            <div
              style={{
                background: "#0f0f0f",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>✓</p>
              <p style={{ color: "var(--text)", fontSize: "0.9rem" }}>
                You already rated this week
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                Your score: {existingRating.score}/5
              </p>
            </div>
          ) : (
            <RaterForm raterId={rater.id} habitId={rater.habitId} weekStart={weekStart.toISOString()} />
          )}
        </div>
      </div>
    </div>
  );
}

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day;
  const sunday = new Date(now.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}