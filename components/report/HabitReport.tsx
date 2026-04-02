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
  isPro: boolean;
}

export default function HabitReport({ habitId, habitTitle, userId, isPro }: Props) {
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

          {latestWeek && (
            <AISummary
              habitId={habitId}
              weekStart={latestWeek.weekStart}
              isPro={isPro}
            />
          )}

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

function AISummary({
  habitId,
  weekStart,
  isPro,
}: {
  habitId: string;
  weekStart: string;
  isPro: boolean;
}) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSummary() {
    setLoading(true);
    const res = await fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, weekStart }),
    });
    const data = await res.json();
    if (res.ok) setSummary(data.summary);
    else setError(data.error);
    setLoading(false);
  }

  if (!isPro) {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>✦</p>
        <p style={{ color: "var(--text)", fontWeight: 500, marginBottom: "6px" }}>
          AI MirrorSummary
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
          Get a personalized plain-English summary of your week — Pro only.
        </p>
        
        <a
          href="/settings"
          style={{
            background: "var(--accent)",
            color: "#0f0f0f",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          ✦ AI MirrorSummary
        </p>
        {!summary && (
          <button
            onClick={fetchSummary}
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "#0f0f0f",
              border: "none",
              borderRadius: "8px",
              padding: "6px 14px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "0.85rem" }}>{error}</p>
      )}

      {summary ? (
        <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.7 }}>
          {summary}
        </p>
      ) : (
        !loading && (
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            Click generate to get your personalized weekly summary.
          </p>
        )
      )}
    </div>
  );
}