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
        background: "var(--color-canvas)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-lg)",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 600,
            color: "var(--color-ink)",
            marginBottom: "var(--spacing-xs)",
            letterSpacing: "0.196px",
          }}
        >
          MirrorLog
        </p>
        <p style={{ color: "var(--color-body-muted)", fontSize: "17px", marginBottom: "40px", letterSpacing: "-0.374px" }}>
          Your friend is using MirrorLog to build better habits. Be their mirror — rate their consistency honestly.
        </p>

        <div
          style={{
            background: "var(--color-canvas)",
            border: "1px solid var(--color-hairline)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--spacing-lg)",
          }}
        >
          <p style={{ color: "var(--color-body-muted)", fontSize: "14px", letterSpacing: "-0.224px", marginBottom: "var(--spacing-xs)" }}>
            Habit
          </p>
          <p style={{ color: "var(--color-ink)", fontSize: "17px", fontWeight: 600, marginBottom: "6px", letterSpacing: "-0.374px" }}>
            {rater.habit.title}
          </p>
          {rater.habit.description && (
            <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "var(--spacing-lg)", letterSpacing: "-0.224px" }}>
              {rater.habit.description}
            </p>
          )}

          {existingRating ? (
            <div
              style={{
                background: "var(--color-canvas-parchment)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "21px", marginBottom: "var(--spacing-xs)", color: "var(--color-primary)" }}>&#10003;</p>
              <p style={{ color: "var(--color-ink)", fontSize: "17px", letterSpacing: "-0.374px" }}>
                You already rated this week
              </p>
              <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>
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
  const day = now.getDay();
  const diff = now.getDate() - day;
  const sunday = new Date(now.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}
