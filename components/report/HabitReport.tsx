"use client";

import { useEffect, useState } from "react";
import SelfRating from "./SelfRating";
import GapChart from "./GapChart";

interface Week {
  weekStart: string;
  selfScore: number | null;
  circleScore: number | null;
  circleCount: number;
  gapScore: number | null;
  notes: string[];
}

interface Props {
  habitId: string;
  habitTitle: string;
  userId: string;
}

export default function HabitReport({ habitId, habitTitle, userId }: Props) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchReport() {
    const res = await fetch(`/api/reports?habitId=${habitId}`);
    const data = await res.json();
    setWeeks(data.weeks || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchReport();
  }, [habitId]);

  const latestWeek = weeks[weeks.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.8rem",
            color: "var(--text)",
            marginBottom: "4px",
          }}
        >
          {habitTitle}
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Your MirrorReport
        </p>
      </div>

      {/* Self rating this week */}
      <SelfRating habitId={habitId} onRated={fetchReport} />

      {loading ? (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading...</p>
      ) : weeks.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
            color: "var(--muted)",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>◎</p>
          <p style={{ fontSize: "0.9rem" }}>No data yet.</p>
          <p style={{ fontSize: "0.8rem", marginTop: "4px" }}>
            Rate yourself and invite your circle to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Latest week summary */}
          {latestWeek && (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "16px",
                }}
              >
                This Week
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <ScoreCard label="You" score={latestWeek.selfScore} />
                <ScoreCard label="Circle" score={latestWeek.circleScore} />
                <GapCard gap={latestWeek.gapScore} />
              </div>

              {latestWeek.notes.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "10px",
                    }}
                  >
                    Anonymous Notes
                  </p>
                  {latestWeek.notes.map((note, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#0f0f0f",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "8px",
                        color: "var(--text)",
                        fontSize: "0.85rem",
                        fontStyle: "italic",
                      }}
                    >
                      "{note}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Trend chart */}
          {weeks.length > 1 && <GapChart weeks={weeks} />}
        </>
      )}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#0f0f0f",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "8px" }}>
        {label}
      </p>
      <p
        style={{
          color: "var(--text)",
          fontSize: "1.8rem",
          fontWeight: 700,
          fontFamily: "'DM Serif Display', serif",
        }}
      >
        {score !== null ? score : "—"}
      </p>
    </div>
  );
}

function GapCard({ gap }: { gap: number | null }) {
  const color =
    gap === null ? "var(--muted)" : gap > 0 ? "var(--accent)" : "#ff6b6b";
  const label =
    gap === null ? "—" : gap > 0 ? `+${gap}` : `${gap}`;
  const description =
    gap === null
      ? "No data"
      : gap > 0
      ? "Circle rates you higher"
      : gap < 0
      ? "You rate yourself higher"
      : "Perfect alignment";

  return (
    <div
      style={{
        flex: 1,
        background: "#0f0f0f",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "8px" }}>
        Gap
      </p>
      <p
        style={{
          color,
          fontSize: "1.8rem",
          fontWeight: 700,
          fontFamily: "'DM Serif Display', serif",
        }}
      >
        {label}
      </p>
      <p style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "4px" }}>
        {description}
      </p>
    </div>
  );
}