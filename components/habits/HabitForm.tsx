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
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "28px",
      }}
    >
      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.25rem",
          color: "var(--text)",
          marginBottom: "20px",
        }}
      >
        New Habit
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="e.g. Go to the gym 4x a week"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            background: "#0f0f0f",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "var(--text)",
            fontSize: "0.9rem",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />

        <textarea
          placeholder="Describe what success looks like (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            background: "#0f0f0f",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "var(--text)",
            fontSize: "0.9rem",
            outline: "none",
            resize: "none",
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !title}
          style={{
            background: title ? "var(--accent)" : "var(--border)",
            color: title ? "#0f0f0f" : "var(--muted)",
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: title ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {loading ? "Saving..." : "Add Habit"}
        </button>
      </div>
    </div>
  );
}