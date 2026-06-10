"use client";

import { useEffect, useState } from "react";

interface Props {
  token: string;
  roomUrl: string;
  podId: string;
  duration: number;
  scheduledFor: string;
  pseudonym: string;
  onLeave: () => void;
}

function getTimeLeft(scheduledFor: string, duration: number): number {
  const start = new Date(scheduledFor).getTime();
  const end = start + duration * 60 * 1000;
  const now = Date.now();
  const remaining = Math.floor((end - now) / 1000);
  return Math.max(0, remaining);
}

export default function PodRoom({ token, roomUrl, podId, duration, scheduledFor, pseudonym, onLeave }: Props) {
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(scheduledFor, duration));
    const [cameraWarning, setCameraWarning] = useState(false);
    const [cameraOffSeconds, setCameraOffSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer);
                    handleLeave();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const dailyUrl = `${roomUrl}?t=${token}&micOff=1`;

    async function handleLeave() {
        await fetch("/api/pods/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ podId }),
        });
        onLeave();
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Session header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "28px",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        margin: 0,
                        letterSpacing: "0.196px",
                    }}>
                        Focus Session
                    </p>
                    <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>
                        You are <span style={{ color: "var(--color-primary)" }}>{pseudonym}</span> · Mic permanently off
                    </p>
                </div>
                <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    fontWeight: 600,
                    color: timeLeft < 60 ? "var(--color-danger)" : "var(--color-primary)",
                    margin: 0,
                    lineHeight: 1.1,
                }}>
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </p>
            </div>

            {/* Camera warning */}
            {cameraWarning && (
                <div style={{
                    background: "rgba(255,59,48,0.08)",
                    border: "1px solid var(--color-danger)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                    textAlign: "center",
                }}>
                    <p style={{ color: "var(--color-danger)", fontWeight: 600, margin: 0, fontSize: "17px", letterSpacing: "-0.374px" }}>
                        Your camera has been off for 2+ minutes
                    </p>
                    <p style={{ color: "var(--color-danger)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>
                        Please turn it back on. Continued absence may trigger a vote to remove you.
                    </p>
                </div>
            )}

            {/* Video iframe */}
            <iframe
                src={dailyUrl}
                allow="camera; microphone; fullscreen; display-capture"
                style={{
                    width: "100%",
                    height: "500px",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-canvas-parchment)",
                }}
            />

            {/* Rules reminder */}
            <div style={{
                background: "var(--color-canvas-parchment)",
                borderRadius: "var(--radius-md)",
                padding: "14px 18px",
                display: "flex",
                gap: "20px",
            }}>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", margin: 0, letterSpacing: "-0.224px" }}>Mic off</p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", margin: 0, letterSpacing: "-0.224px" }}>Camera on</p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", margin: 0, letterSpacing: "-0.224px" }}>No chat</p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", margin: 0, letterSpacing: "-0.224px" }}>Stay focused</p>
            </div>

            {/* Leave button */}
            <button
                onClick={handleLeave}
                style={{
                    background: "transparent",
                    border: "1px solid var(--color-danger)",
                    borderRadius: "var(--radius-pill)",
                    padding: "11px 22px",
                    color: "var(--color-danger)",
                    fontSize: "17px",
                    fontWeight: 400,
                    cursor: "pointer",
                    fontFamily: "var(--font-text)",
                    letterSpacing: "-0.374px",
                }}
            >
                Leave Session
            </button>
        </div>
    );
}
