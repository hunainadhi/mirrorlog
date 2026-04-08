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
  onJoin: (podId: string, task: string) => void;
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

  function isJoinable(slot: Slot) {
    if (slot.status === "ACTIVE") return true;
    const podTime = new Date(slot.scheduledFor);
    const now = new Date();
    const diff = podTime.getTime() - now.getTime();
    return diff <= 5 * 60 * 1000 && diff >= -25 * 60 * 1000;
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
      <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)" }}>
        <p style={{ fontSize: "2rem", marginBottom: "8px" }}>◎</p>
        <p style={{ fontSize: "0.9rem" }}>No upcoming slots available.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{
        color: "var(--muted)",
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}>
        Upcoming slots — next 24 hours
      </p>

      {slots.map((slot) => (
        <div
          key={slot.id}
          style={{
            background: "var(--surface)",
            border: `1px solid ${slot.userSignedUp ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "16px",
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>
                {formatTime(slot.scheduledFor)}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                {slot.signupCount} signed up · {timeUntil(slot.scheduledFor)}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {slot.userSignedUp && (
                <span style={{
                  background: "#c9f97f22",
                  color: "var(--accent)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "100px",
                }}>
                  {CATEGORIES.find(c => c.value === slot.userCategory)?.emoji} {CATEGORIES.find(c => c.value === slot.userCategory)?.label}
                </span>
              )}
              {slot.status === "ACTIVE" && (
                <span style={{
                  background: "#ff6b6b22",
                  color: "#ff6b6b",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "100px",
                }}>
                  LIVE
                </span>
              )}
            </div>
          </div>

          {/* Join button if within 5 min or active */}
          {slot.userSignedUp && isJoinable(slot) && (
            <div style={{ marginBottom: "12px" }}>
              {joiningPodId === slot.id ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    placeholder="What are you working on?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    style={{
                      flex: 1,
                      background: "#0f0f0f",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      color: "var(--text)",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => { onJoin(slot.id, task); setJoiningPodId(null); }}
                    disabled={!task}
                    style={{
                      background: task ? "var(--accent)" : "var(--border)",
                      color: task ? "#0f0f0f" : "var(--muted)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: task ? "pointer" : "not-allowed",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Join Now
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setJoiningPodId(slot.id)}
                  style={{
                    width: "100%",
                    background: "var(--accent)",
                    color: "#0f0f0f",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "8px",
                  }}
                >
                  Join Pod
                </button>
              )}
            </div>
          )}

          {/* Signup / Cancel */}
          {!slot.userSignedUp ? (
            signingUpFor === slot.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>
                  Pick your category:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      style={{
                        background: selectedCategory === cat.value ? "var(--accent)" : "#0f0f0f",
                        color: selectedCategory === cat.value ? "#0f0f0f" : "var(--muted)",
                        border: `1px solid ${selectedCategory === cat.value ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => { setSigningUpFor(null); setSelectedCategory(""); }}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "8px",
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSignup(slot.id)}
                    disabled={!selectedCategory || loading}
                    style={{
                      flex: 2,
                      background: selectedCategory ? "var(--accent)" : "var(--border)",
                      color: selectedCategory ? "#0f0f0f" : "var(--muted)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: selectedCategory ? "pointer" : "not-allowed",
                      fontFamily: "'DM Sans', sans-serif",
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
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Sign Up
              </button>
            )
          ) : (
            !isJoinable(slot) && (
              <button
                onClick={() => handleCancel(slot.id)}
                style={{
                  background: "transparent",
                  border: "1px solid #ff6b6b",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  color: "#ff6b6b",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
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