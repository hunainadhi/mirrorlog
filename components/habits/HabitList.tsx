"use client";

import InviteRater from "./InviteRater";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
}

interface Props {
  habits: Habit[];
}

export default function HabitList({ habits }: Props) {
  if (habits.length === 0) {
    return (
      <div
        style={{
          marginTop: "16px",
          textAlign: "center",
          padding: "48px 0",
          color: "var(--muted)",
        }}
      >
        <p style={{ fontSize: "2rem" }}>◎</p>
        <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
          No habits yet. Add one above.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {habits.map((habit, i) => (
        <div
          key={habit.id}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px 24px",
            animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
              }}
            />
            <div>
              <p style={{ color: "var(--text)", fontWeight: 500, fontSize: "0.95rem" }}>
                {habit.title}
              </p>
              {habit.description && (
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                  {habit.description}
                </p>
              )}
            </div>
          </div>
          <InviteRater habitId={habit.id} habitTitle={habit.title} />
        </div>
      ))}
    </div>
  );
}