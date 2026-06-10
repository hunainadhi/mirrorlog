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

    async function handleRemoveRater(raterId: string) {
        if (!confirm("Remove this rater?")) return;
        await fetch(`/api/raters?raterId=${raterId}`, { method: "DELETE" });
        await fetchRaters();
    }

    return (
        <div>
            <button
                onClick={handleOpen}
                style={{
                    background: "transparent",
                    border: "1px solid var(--color-primary)",
                    borderRadius: "var(--radius-pill)",
                    padding: "6px 14px",
                    color: "var(--color-primary)",
                    fontSize: "14px",
                    cursor: "pointer",
                    letterSpacing: "-0.224px",
                }}
            >
                + Invite Rater
            </button>

            {open && (
                <div
                    style={{
                        marginTop: "16px",
                        background: "var(--color-canvas-parchment)",
                        border: "1px solid var(--color-hairline)",
                        borderRadius: "var(--radius-md)",
                        padding: "20px",
                    }}
                >
                    <p
                        style={{
                            color: "var(--color-body-muted)",
                            fontSize: "14px",
                            marginBottom: "var(--spacing-sm)",
                            letterSpacing: "-0.224px",
                        }}
                    >
                        Invite someone to rate your consistency on &ldquo;{habitTitle}&rdquo;
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input
                            type="email"
                            placeholder="Their email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                background: "var(--color-canvas)",
                                border: "1px solid var(--color-hairline)",
                                borderRadius: "var(--radius-sm)",
                                padding: "10px 14px",
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
                        <input
                            type="text"
                            placeholder="Nickname (optional) e.g. Gym buddy"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            style={{
                                background: "var(--color-canvas)",
                                border: "1px solid var(--color-hairline)",
                                borderRadius: "var(--radius-sm)",
                                padding: "10px 14px",
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

                        {error && (
                            <p style={{ color: "var(--color-danger)", fontSize: "14px", letterSpacing: "-0.224px" }}>{error}</p>
                        )}

                        <button
                            onClick={handleInvite}
                            disabled={loading || !email}
                            style={{
                                background: email ? "var(--color-primary)" : "var(--color-hairline)",
                                color: email ? "var(--color-on-dark)" : "var(--color-body-muted)",
                                border: "none",
                                borderRadius: "var(--radius-pill)",
                                padding: "11px 22px",
                                fontSize: "17px",
                                fontWeight: 400,
                                cursor: email ? "pointer" : "not-allowed",
                                fontFamily: "var(--font-text)",
                                letterSpacing: "-0.374px",
                            }}
                        >
                            {loading ? "Inviting..." : "Send Invite"}
                        </button>
                    </div>

                    {raters.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                            <p
                                style={{
                                    color: "var(--color-body-muted)",
                                    fontSize: "14px",
                                    marginBottom: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "-0.224px",
                                }}
                            >
                                Raters ({raters.length})
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                                {raters.map((rater) => (
                                    <div
                                        key={rater.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "var(--color-surface-pearl)",
                                            borderRadius: "var(--radius-sm)",
                                            padding: "10px 14px",
                                        }}
                                    >
                                        <div>
                                            <p style={{ color: "var(--color-ink)", fontSize: "17px", letterSpacing: "-0.374px" }}>
                                                {rater.nickname || rater.email}
                                            </p>
                                            {rater.nickname && (
                                                <p style={{ color: "var(--color-body-muted)", fontSize: "12px", letterSpacing: "-0.12px" }}>
                                                    {rater.email}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                                            <button
                                                onClick={() => copyLink(rater.token)}
                                                style={{
                                                    background: "transparent",
                                                    border: "1px solid var(--color-primary)",
                                                    borderRadius: "var(--radius-sm)",
                                                    padding: "4px 10px",
                                                    color: "var(--color-primary)",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    letterSpacing: "-0.12px",
                                                }}
                                            >
                                                Copy Link
                                            </button>
                                            <button
                                                onClick={() => handleRemoveRater(rater.id)}
                                                style={{
                                                    background: "transparent",
                                                    border: "1px solid var(--color-danger)",
                                                    color: "var(--color-danger)",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    padding: "4px 10px",
                                                    borderRadius: "var(--radius-sm)",
                                                    letterSpacing: "-0.12px",
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
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
