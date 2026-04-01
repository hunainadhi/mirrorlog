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
        <p style={{ fontSize: "2rem", marginBottom: "8px" }}>◎</p>
        <p style={{ color: "var(--text)", fontSize: "0.95rem", fontWeight: 500 }}>
          Thanks for rating!
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
          Your response is anonymous and helps them grow.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "12px" }}>
          How consistent were they this week?
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
                background: score === val ? "var(--accent)" : "var(--surface)",
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
          <p style={{ color: "var(--accent)", fontSize: "0.8rem", marginTop: "8px", textAlign: "center" }}>
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
          background: "#0f0f0f",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "12px 16px",
          color: "var(--text)",
          fontSize: "0.85rem",
          outline: "none",
          resize: "none",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "'DM Sans', sans-serif",
        }}
      />

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>{error}</p>
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
          transition: "all 0.2s",
        }}
      >
        {loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}