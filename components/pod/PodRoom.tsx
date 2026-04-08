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
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "1.5rem",
                        color: "var(--text)",
                        margin: 0,
                    }}>
                        Focus Session
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                        You are <span style={{ color: "var(--accent)" }}>{pseudonym}</span> · Mic permanently off
                    </p>
                </div>
                <p style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "2.5rem",
                    color: timeLeft < 60 ? "#ff6b6b" : "var(--accent)",
                    margin: 0,
                }}>
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </p>
            </div>

            {/* Camera warning */}
            {cameraWarning && (
                <div style={{
                    background: "#ff6b6b22",
                    border: "1px solid #ff6b6b",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                }}>
                    <p style={{ color: "#ff6b6b", fontWeight: 600, margin: 0 }}>
                        📹 Your camera has been off for 2+ minutes
                    </p>
                    <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "4px" }}>
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
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    background: "#0f0f0f",
                }}
            />

            {/* Rules reminder */}
            <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                gap: "20px",
            }}>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>🔇 Mic off</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>📹 Camera on</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>💬 No chat</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>🎯 Stay focused</p>
            </div>

            {/* Leave button */}
            <button
                onClick={handleLeave}
                style={{
                    background: "#ff6b6b22",
                    border: "1px solid #ff6b6b",
                    borderRadius: "10px",
                    padding: "12px",
                    color: "#ff6b6b",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                Leave Session
            </button>
        </div>
    );
}