"use client";

import { useState } from "react";

interface Props {
  raterId: string;
  habitId: string;
  weekStart: string;
}

const labels: Record<number, string> = {
  1: "Not at all",
  2: "Barely",
  3: "Somewhat",
  4: "Mostly",
  5: "Absolutely",
};

export default function RaterForm({ raterId, habitId, weekStart }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!score) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raterId, habitId, weekStart, score, note }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      setDone(true);
    }

    setLoading(false);
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: "21px", marginBottom: "var(--spacing-xs)", color: "var(--color-primary)" }}>&#10003;</p>
        <p style={{ color: "var(--color-ink)", fontSize: "17px", fontWeight: 600, letterSpacing: "-0.374px" }}>
          Thanks for rating!
        </p>
        <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>
          Your response is anonymous and helps them grow.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "var(--spacing-sm)", letterSpacing: "-0.224px" }}>
          How consistent were they this week?
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
          <p style={{ color: "var(--color-primary)", fontSize: "14px", marginTop: "var(--spacing-xs)", textAlign: "center", letterSpacing: "-0.224px" }}>
            {labels[score]}
          </p>
        )}
      </div>

      <textarea
        placeholder="Any anonymous note? (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          color: "var(--color-ink)",
          fontSize: "17px",
          outline: "none",
          resize: "none",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "var(--font-text)",
          letterSpacing: "-0.374px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-focus)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--color-hairline)")}
      />

      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "14px", letterSpacing: "-0.224px" }}>{error}</p>
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
        {loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}
