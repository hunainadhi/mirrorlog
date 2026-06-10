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
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
      }}
    >
      <p
        style={{
          color: "var(--color-body-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.224px",
          marginBottom: "var(--spacing-sm)",
        }}
      >
        Your self rating this week
      </p>

      {alreadyRated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <p
            style={{
              color: "var(--color-primary)",
              fontSize: "28px",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              letterSpacing: "0.196px",
            }}
          >
            {existingScore}/5
          </p>
          <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>
            Rated this week. Come back next Monday.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <p style={{ color: "var(--color-ink)", fontSize: "17px", letterSpacing: "-0.374px" }}>
            How consistent were you this week?
          </p>
          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setScore(val)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: "var(--radius-sm)",
                  border: score === val ? "2px solid var(--color-primary)" : "1px solid var(--color-hairline)",
                  background: score === val ? "var(--color-primary)" : "var(--color-canvas)",
                  color: score === val ? "var(--color-on-dark)" : "var(--color-body-muted)",
                  fontSize: "17px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {val}
              </button>
            ))}
          </div>
          {score && (
            <p style={{ color: "var(--color-primary)", fontSize: "14px", textAlign: "center", letterSpacing: "-0.224px" }}>
              {labels[score]}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!score || loading}
            style={{
              background: score ? "var(--color-primary)" : "var(--color-hairline)",
              color: score ? "var(--color-on-dark)" : "var(--color-body-muted)",
              border: "none",
              borderRadius: "var(--radius-pill)",
              padding: "11px 22px",
              fontSize: "17px",
              fontWeight: 400,
              cursor: score ? "pointer" : "not-allowed",
              fontFamily: "var(--font-text)",
              letterSpacing: "-0.374px",
            }}
          >
            {loading ? "Saving..." : "Rate Yourself"}
          </button>
        </div>
      )}
    </div>
  );
}
