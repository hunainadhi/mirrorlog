"use client";

import { useState } from "react";

interface Props {
  onHabitCreated: () => void;
}

export default function HabitForm({ onHabitCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      setTitle("");
      setDescription("");
      onHabitCreated();
    }

    setLoading(false);
  }

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
          fontFamily: "var(--font-display)",
          fontSize: "21px",
          fontWeight: 600,
          color: "var(--color-ink)",
          marginBottom: "20px",
          letterSpacing: "0.231px",
        }}
      >
        New Habit
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
        <input
          type="text"
          placeholder="e.g. Go to the gym 4x a week"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            background: "var(--color-canvas)",
            border: "1px solid var(--color-hairline)",
            borderRadius: "var(--radius-sm)",
            padding: "12px 16px",
            color: "var(--color-ink)",
            fontSize: "17px",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            letterSpacing: "-0.374px",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-focus)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-hairline)")}
        />

        <textarea
          placeholder="Describe what success looks like (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          disabled={loading || !title}
          style={{
            background: title ? "var(--color-primary)" : "var(--color-hairline)",
            color: title ? "var(--color-on-dark)" : "var(--color-body-muted)",
            border: "none",
            borderRadius: "var(--radius-pill)",
            padding: "11px 22px",
            fontSize: "17px",
            fontWeight: 400,
            cursor: title ? "pointer" : "not-allowed",
            fontFamily: "var(--font-text)",
            letterSpacing: "-0.374px",
          }}
        >
          {loading ? "Saving..." : "Add Habit"}
        </button>
      </div>
    </div>
  );
}
