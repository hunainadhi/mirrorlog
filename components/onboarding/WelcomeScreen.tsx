"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    userName: string;
}

const steps = [
    {
        emoji: "🎯",
        title: "Pick a habit to track",
        body: "Choose a goal that's visible to people around you — gym, sleep, diet, focus. Something they can actually observe and rate.",
    },
    {
        emoji: "👥",
        title: "Invite friends who see you",
        body: "Send a unique link to 3–5 people in your life. They don't need an account. It takes them under 60 seconds every week.",
    },
    {
        emoji: "🔒",
        title: "They rate you anonymously",
        body: "Every Sunday your circle gets a nudge to rate your consistency. Anonymous means they'll actually be honest.",
    },
    {
        emoji: "🪞",
        title: "Your mirror reflects the truth",
        body: "See what you think you did vs what your circle actually saw. The gap between them is where real growth happens.",
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
                    Here's how accountability actually works on MirrorLog.
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