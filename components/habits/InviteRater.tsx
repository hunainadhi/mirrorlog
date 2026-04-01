"use client";

import { useState } from "react";

interface Rater {
  id: string;
  email: string;
  nickname: string | null;
  token: string;
}

interface Props {
  habitId: string;
  habitTitle: string;
}

export default function InviteRater({ habitId, habitTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [raters, setRaters] = useState<Rater[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  async function fetchRaters() {
    const res = await fetch(`/api/raters?habitId=${habitId}`);
    const data = await res.json();
    setRaters(data);
    setFetched(true);
  }

  async function handleOpen() {
    setOpen(true);
    if (!fetched) await fetchRaters();
  }

  async function handleInvite() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/raters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, email, nickname }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
    } else {
      setEmail("");
      setNickname("");
      await fetchRaters();
    }

    setLoading(false);
  }

  function getRaterLink(token: string) {
    return `${window.location.origin}/rate/${token}`;
  }

  async function copyLink(token: string) {
    await navigator.clipboard.writeText(getRaterLink(token));
    alert("Link copied!");
  }

  return (
    <div>
      <button
        onClick={handleOpen}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "6px 14px",
          color: "var(--muted)",
          fontSize: "0.8rem",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
          (e.target as HTMLButtonElement).style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
          (e.target as HTMLButtonElement).style.color = "var(--muted)";
        }}
      >
        + Invite Rater
      </button>

      {open && (
        <div
          style={{
            marginTop: "16px",
            background: "#0f0f0f",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.8rem",
              marginBottom: "12px",
            }}
          >
            Invite someone to rate your consistency on "{habitTitle}"
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="email"
              placeholder="Their email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "var(--text)",
                fontSize: "0.85rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              placeholder="Nickname (optional) e.g. Gym buddy"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "var(--text)",
                fontSize: "0.85rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>{error}</p>
            )}

            <button
              onClick={handleInvite}
              disabled={loading || !email}
              style={{
                background: email ? "var(--accent)" : "var(--border)",
                color: email ? "#0f0f0f" : "var(--muted)",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: email ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loading ? "Inviting..." : "Send Invite"}
            </button>
          </div>

          {raters.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "0.75rem",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Raters ({raters.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {raters.map((rater) => (
                  <div
                    key={rater.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "var(--surface)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                    }}
                  >
                    <div>
                      <p style={{ color: "var(--text)", fontSize: "0.85rem" }}>
                        {rater.nickname || rater.email}
                      </p>
                      {rater.nickname && (
                        <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                          {rater.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => copyLink(rater.token)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        color: "var(--muted)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Copy Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}