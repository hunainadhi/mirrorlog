"use client";

import { useEffect, useState } from "react";

interface Props {
  habitId: string;
  onRated: () => void;
}

const labels: Record<number, string> = {
  1: "Not at all",
  2: "Barely",
  3: "Somewhat",
  4: "Mostly",
  5: "Absolutely",
};

export default function SelfRating({ habitId, onRated }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [existingScore, setExistingScore] = useState<number | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const res = await fetch(`/api/self-rating?habitId=${habitId}`);
      const data = await res.json();
      setAlreadyRated(data.rated);
      setExistingScore(data.score);
      setChecking(false);
    }
    check();
  }, [habitId]);

  async function handleSubmit() {
    if (!score) return;
    setLoading(true);

    const res = await fetch("/api/self-rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, score }),
    });

    if (res.ok) {
      setAlreadyRated(true);
      setExistingScore(score);
      onRated();
    }

    setLoading(false);
  }

  if (checking) return null;

  return (
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
          marginBottom: "12px",
        }}
      >
        Your self rating this week
      </p>

      {alreadyRated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <p
            style={{
              color: "var(--accent)",
              fontSize: "1.8rem",
              fontWeight: 700,
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            {existingScore}/5
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            Rated this week. Come back next Monday.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ color: "var(--text)", fontSize: "0.85rem" }}>
            How consistent were you this week?
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setScore(val)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: "10px",
                  border: score === val ? "2px solid var(--accent)" : "1px solid var(--border)",
                  background: score === val ? "var(--accent)" : "#0f0f0f",
                  color: score === val ? "#0f0f0f" : "var(--muted)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {val}
              </button>
            ))}
          </div>
          {score && (
            <p style={{ color: "var(--accent)", fontSize: "0.8rem", textAlign: "center" }}>
              {labels[score]}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!score || loading}
            style={{
              background: score ? "var(--accent)" : "var(--border)",
              color: score ? "#0f0f0f" : "var(--muted)",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: score ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? "Saving..." : "Rate Yourself"}
          </button>
        </div>
      )}
    </div>
  );
}