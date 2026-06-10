"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    userName: string;
}

const steps = [
    {
        step: "01",
        title: "Pick a habit to track",
        body: "Choose a goal that's visible to people around you — gym, sleep, diet, focus. Something they can actually observe and rate.",
    },
    {
        step: "02",
        title: "Invite friends who see you",
        body: "Send a unique link to 3–5 people in your life. They don't need an account. It takes them under 60 seconds every week.",
    },
    {
        step: "03",
        title: "They rate you anonymously",
        body: "Every Sunday your circle gets a nudge to rate your consistency. Anonymous means they'll actually be honest.",
    },
    {
        step: "04",
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
                background: "var(--color-canvas)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--spacing-lg)",
            }}
        >
            <div style={{ maxWidth: "420px", width: "100%" }}>
                <p
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "28px",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        marginBottom: "4px",
                        letterSpacing: "0.196px",
                    }}
                >
                    Hey {userName}
                </p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "17px", marginBottom: "40px", letterSpacing: "-0.374px" }}>
                    Here&apos;s how accountability actually works on MirrorLog.
                </p>

                {/* Step card */}
                <div
                    style={{
                        background: "var(--color-canvas)",
                        border: "1px solid var(--color-hairline)",
                        borderRadius: "var(--radius-lg)",
                        padding: "36px 28px",
                        marginBottom: "var(--spacing-lg)",
                        minHeight: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-body-muted)", marginBottom: "16px", letterSpacing: "-0.224px" }}>{current.step}</p>
                    <p
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "21px",
                            fontWeight: 600,
                            color: "var(--color-ink)",
                            marginBottom: "var(--spacing-sm)",
                            letterSpacing: "0.231px",
                        }}
                    >
                        {current.title}
                    </p>
                    <p style={{ color: "var(--color-body-muted)", fontSize: "17px", lineHeight: 1.47, letterSpacing: "-0.374px" }}>
                        {current.body}
                    </p>
                </div>

                {/* Progress dots */}
                <div style={{ display: "flex", gap: "var(--spacing-xs)", justifyContent: "center", marginBottom: "var(--spacing-lg)" }}>
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === step ? "20px" : "8px",
                                height: "8px",
                                borderRadius: "4px",
                                background: i === step ? "var(--color-primary)" : "var(--color-hairline)",
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
                                border: "1px solid var(--color-hairline)",
                                borderRadius: "var(--radius-pill)",
                                padding: "11px 22px",
                                color: "var(--color-body-muted)",
                                fontSize: "17px",
                                cursor: "pointer",
                                fontFamily: "var(--font-text)",
                                letterSpacing: "-0.374px",
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
                            background: "var(--color-primary)",
                            border: "none",
                            borderRadius: "var(--radius-pill)",
                            padding: "11px 22px",
                            color: "var(--color-on-dark)",
                            fontSize: "17px",
                            fontWeight: 400,
                            cursor: "pointer",
                            fontFamily: "var(--font-text)",
                            letterSpacing: "-0.374px",
                        }}
                    >
                        {loading ? "Setting up..." : isLast ? "Get started" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}
