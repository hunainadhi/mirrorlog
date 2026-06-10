"use client";

import { useState } from "react";
import { Slot } from "./PodDashboard";

const CATEGORIES = [
  { value: "STUDY", label: "Study", emoji: "📚" },
  { value: "CODING", label: "Coding", emoji: "💻" },
  { value: "WRITING", label: "Writing", emoji: "✍️" },
  { value: "READING", label: "Reading", emoji: "📖" },
  { value: "DESIGN", label: "Design", emoji: "🎨" },
  { value: "JOB_HUNT", label: "Job Hunt", emoji: "💼" },
  { value: "ADMIN", label: "Admin", emoji: "📋" },
  { value: "LEARNING", label: "Learning", emoji: "🧠" },
  { value: "BUSINESS", label: "Business", emoji: "📈" },
  { value: "DEEP_WORK", label: "Deep Work", emoji: "🎯" },
];

interface Props {
  slots: Slot[];
  plan: string;
  onSignup: () => void;
  onJoin: (podId: string, task: string, scheduledFor: string) => void;
}

export default function SlotBrowser({ slots, plan, onSignup, onJoin }: Props) {
  const [signingUpFor, setSigningUpFor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [joiningPodId, setJoiningPodId] = useState<string | null>(null);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(podId: string) {
    if (!selectedCategory) return;
    setLoading(true);

    const res = await fetch("/api/pods/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ podId, category: selectedCategory }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
    } else {
      setSigningUpFor(null);
      setSelectedCategory("");
      onSignup();
    }
    setLoading(false);
  }

  async function handleCancel(podId: string) {
    const res = await fetch(`/api/pods/signup?podId=${podId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.penalized) {
      alert("Late cancellation — 1 pod credit deducted from today.");
    }
    onSignup();
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }

  function isVisible(slot: Slot) {
    if (slot.status === "ACTIVE") return true;
    const podTime = new Date(slot.scheduledFor);
    const now = new Date();
    const diff = podTime.getTime() - now.getTime();
    return diff <= 5 * 60 * 1000 && diff >= -25 * 60 * 1000;
  }

  function isEnabled(slot: Slot) {
    if (slot.status === "ACTIVE") return true;
    const podTime = new Date(slot.scheduledFor);
    const now = new Date();
    const diff = podTime.getTime() - now.getTime();
    return diff <= 0 && diff >= -25 * 60 * 1000;
  }

  function timeUntil(dateStr: string) {
    const podTime = new Date(dateStr);
    const now = new Date();
    const diff = podTime.getTime() - now.getTime();
    if (diff < 0) return "Started";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `in ${hrs}h ${mins % 60}m`;
    return `in ${mins}m`;
  }

  if (slots.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-body-muted)" }}>
        <p style={{ fontSize: "17px", fontWeight: 600, marginBottom: "var(--spacing-xs)" }}>No upcoming slots</p>
        <p style={{ fontSize: "14px", letterSpacing: "-0.224px" }}>Check back soon.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
      <p style={{
        color: "var(--color-body-muted)",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "-0.224px",
      }}>
        Upcoming slots — next 24 hours
      </p>

      {slots.map((slot) => (
        <div
          key={slot.id}
          style={{
            background: "var(--color-canvas)",
            border: `1px solid ${slot.userSignedUp ? "var(--color-primary)" : "var(--color-hairline)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "20px var(--spacing-lg)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-sm)" }}>
            <div>
              <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", margin: 0, letterSpacing: "-0.374px" }}>
                {formatTime(slot.scheduledFor)}
              </p>
              <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>
                {slot.signupCount} signed up · {timeUntil(slot.scheduledFor)}
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--spacing-xs)", alignItems: "center" }}>
              {slot.userSignedUp && (
                <span style={{
                  background: "rgba(0,102,204,0.08)",
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "var(--radius-pill)",
                  letterSpacing: "-0.12px",
                }}>
                  {CATEGORIES.find(c => c.value === slot.userCategory)?.emoji} {CATEGORIES.find(c => c.value === slot.userCategory)?.label}
                </span>
              )}
              {slot.status === "ACTIVE" && (
                <span style={{
                  background: "rgba(255,59,48,0.08)",
                  color: "var(--color-danger)",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "var(--radius-pill)",
                  letterSpacing: "-0.12px",
                }}>
                  LIVE
                </span>
              )}
            </div>
          </div>

          {slot.userSignedUp && isVisible(slot) && (
            <div style={{ marginBottom: "var(--spacing-sm)" }}>
              {joiningPodId === slot.id ? (
                <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                  <input
                    placeholder="What are you working on?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    style={{
                      flex: 1,
                      background: "var(--color-canvas)",
                      border: "1px solid var(--color-hairline)",
                      borderRadius: "var(--radius-sm)",
                      padding: "8px 12px",
                      color: "var(--color-ink)",
                      fontSize: "17px",
                      outline: "none",
                      letterSpacing: "-0.374px",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-focus)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-hairline)")}
                  />
                  <button
                    onClick={() => { onJoin(slot.id, task, slot.scheduledFor); setJoiningPodId(null); }}
                    disabled={!task || !isEnabled(slot)}
                    style={{
                      background: task && isEnabled(slot) ? "var(--color-primary)" : "var(--color-hairline)",
                      color: task && isEnabled(slot) ? "var(--color-on-dark)" : "var(--color-body-muted)",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: 400,
                      cursor: task && isEnabled(slot) ? "pointer" : "not-allowed",
                      fontFamily: "var(--font-text)",
                      letterSpacing: "-0.224px",
                    }}
                  >
                    Join Now
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => isEnabled(slot) && setJoiningPodId(slot.id)}
                  disabled={!isEnabled(slot)}
                  style={{
                    width: "100%",
                    background: isEnabled(slot) ? "var(--color-primary)" : "var(--color-hairline)",
                    color: isEnabled(slot) ? "var(--color-on-dark)" : "var(--color-body-muted)",
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    padding: "11px 22px",
                    fontSize: "17px",
                    fontWeight: 400,
                    cursor: isEnabled(slot) ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-text)",
                    marginBottom: "var(--spacing-xs)",
                    letterSpacing: "-0.374px",
                  }}
                >
                  {isEnabled(slot) ? "Join Pod" : `Opens at ${new Date(slot.scheduledFor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                </button>
              )}
            </div>
          )}

          {!slot.userSignedUp ? (
            signingUpFor === slot.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", margin: 0, letterSpacing: "-0.224px" }}>
                  Pick your category:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      style={{
                        background: selectedCategory === cat.value ? "var(--color-primary)" : "var(--color-canvas)",
                        color: selectedCategory === cat.value ? "var(--color-on-dark)" : "var(--color-body-muted)",
                        border: `1px solid ${selectedCategory === cat.value ? "var(--color-primary)" : "var(--color-hairline)"}`,
                        borderRadius: "var(--radius-pill)",
                        padding: "6px 12px",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontFamily: "var(--font-text)",
                        letterSpacing: "-0.224px",
                      }}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                  <button
                    onClick={() => { setSigningUpFor(null); setSelectedCategory(""); }}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1px solid var(--color-hairline)",
                      borderRadius: "var(--radius-pill)",
                      padding: "8px",
                      color: "var(--color-body-muted)",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "var(--font-text)",
                      letterSpacing: "-0.224px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSignup(slot.id)}
                    disabled={!selectedCategory || loading}
                    style={{
                      flex: 2,
                      background: selectedCategory ? "var(--color-primary)" : "var(--color-hairline)",
                      color: selectedCategory ? "var(--color-on-dark)" : "var(--color-body-muted)",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      padding: "8px",
                      fontSize: "14px",
                      fontWeight: 400,
                      cursor: selectedCategory ? "pointer" : "not-allowed",
                      fontFamily: "var(--font-text)",
                      letterSpacing: "-0.224px",
                    }}
                  >
                    {loading ? "Signing up..." : "Confirm Signup"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSigningUpFor(slot.id)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-primary)",
                  borderRadius: "var(--radius-pill)",
                  padding: "8px 16px",
                  color: "var(--color-primary)",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-text)",
                  letterSpacing: "-0.224px",
                }}
              >
                Sign Up
              </button>
            )
          ) : (
            !isVisible(slot) && (
              <button
                onClick={() => handleCancel(slot.id)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-danger)",
                  borderRadius: "var(--radius-pill)",
                  padding: "6px 14px",
                  color: "var(--color-danger)",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-text)",
                  letterSpacing: "-0.224px",
                }}
              >
                Cancel Signup
              </button>
            )
          )}
        </div>
      ))}
    </div>
  );
}
