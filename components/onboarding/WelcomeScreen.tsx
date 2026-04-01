"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userName: string;
}

const steps = [
  {
    emoji: "🪞",
    title: "Meet your Mirror",
    body: "MirrorLog shows you the gap between how you see yourself and how the people around you see you.",
  },
  {
    emoji: "🎯",
    title: "Set a habit",
    body: "Create a goal you want to be held accountable to. Something visible to people around you — like going to the gym, waking up early, or reading daily.",
  },
  {
    emoji: "👥",
    title: "Invite your circle",
    body: "Send a link to 3–5 people who can observe your behavior. They don't need an account. Every week they rate your consistency anonymously.",
  },
  {
    emoji: "📊",
    title: "See your MirrorReport",
    body: "Every Monday you see your self-score vs your circle's score. The gap between them is where the real growth happens.",
  },
];

export default function WelcomeScreen({ userName }: Props) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLast = step === steps.length - 1;
  const current = steps[step];

  async function handleFinish() {
    setLoading(true);
    await fetch("/api/onboarding", { method: "POST" });
    router.push("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.5rem",
            color: "var(--text)",
            marginBottom: "4px",
          }}
        >
          Hey {userName} 👋
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "40px" }}>
          Welcome to MirrorLog. Here's how it works.
        </p>

        {/* Step card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "36px 28px",
            marginBottom: "24px",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{current.emoji}</p>
          <p
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.4rem",
              color: "var(--text)",
              marginBottom: "12px",
            }}
          >
            {current.title}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {current.body}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === step ? "var(--accent)" : "var(--border)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "12px",
                color: "var(--muted)",
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={isLast ? handleFinish : () => setStep(step + 1)}
            disabled={loading}
            style={{
              flex: 1,
              background: "var(--accent)",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              color: "#0f0f0f",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? "Setting up..." : isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}