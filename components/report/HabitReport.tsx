"use client";

import { useEffect, useState } from "react";
import SelfRating from "./SelfRating";
import GapChart from "./GapChart";

interface Week {
    weekStart: string;
    selfScore: number | null;
    circleScore: number | null;
    circleCount: number;
    gapScore: number | null;
    notes: string[];
}

interface Props {
    habitId: string;
    habitTitle: string;
    userId: string;
    isPro: boolean;
    aiSummaryCount: number;
}

export default function HabitReport({ habitId, habitTitle, userId, isPro, aiSummaryCount }: Props) {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchReport() {
        const res = await fetch(`/api/reports?habitId=${habitId}`);
        const data = await res.json();
        setWeeks(data.weeks || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchReport();
    }, [habitId]);

    const latestWeek = weeks[weeks.length - 1];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
            <div>
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
                    {habitTitle}
                </p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>
                    Your MirrorReport
                </p>
            </div>

            <SelfRating habitId={habitId} onRated={fetchReport} />

            {loading ? (
                <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>Loading...</p>
            ) : weeks.length === 0 ? (
                <div
                    style={{
                        background: "var(--color-canvas)",
                        border: "1px solid var(--color-hairline)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--spacing-xl)",
                        textAlign: "center",
                        color: "var(--color-body-muted)",
                    }}
                >
                    <p style={{ fontSize: "17px", fontWeight: 600, marginBottom: "var(--spacing-xs)" }}>No data yet</p>
                    <p style={{ fontSize: "14px", letterSpacing: "-0.224px" }}>
                        Rate yourself and invite your circle to get started.
                    </p>
                </div>
            ) : (
                <>
                    {latestWeek && (
                        <div
                            style={{
                                background: "var(--color-canvas)",
                                border: "1px solid var(--color-hairline)",
                                borderRadius: "var(--radius-lg)",
                                padding: "var(--spacing-lg)",
                            }}
                        >
                            <p
                                style={{
                                    color: "var(--color-body-muted)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    letterSpacing: "-0.224px",
                                    marginBottom: "16px",
                                }}
                            >
                                This Week
                            </p>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <ScoreCard label="You" score={latestWeek.selfScore} />
                                <ScoreCard label="Circle" score={latestWeek.circleScore} isCircle />
                                <GapCard gap={latestWeek.gapScore} />
                            </div>

                            {latestWeek.notes.length > 0 && (
                                <div style={{ marginTop: "20px" }}>
                                    <p
                                        style={{
                                            color: "var(--color-body-muted)",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            letterSpacing: "-0.224px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Anonymous Notes
                                    </p>
                                    {latestWeek.notes.map((note, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                background: "var(--color-canvas-parchment)",
                                                borderRadius: "var(--radius-sm)",
                                                padding: "10px 14px",
                                                marginBottom: "var(--spacing-xs)",
                                                borderLeft: "3px solid var(--color-primary)",
                                                color: "var(--color-ink)",
                                                fontSize: "17px",
                                                fontStyle: "italic",
                                                letterSpacing: "-0.374px",
                                            }}
                                        >
                                            &ldquo;{note}&rdquo;
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {latestWeek && (
                        <AISummary
                            habitId={habitId}
                            weekStart={latestWeek.weekStart}
                            isPro={isPro}
                            hasUsedFreeSummary={!isPro && aiSummaryCount >= 1}
                        />
                    )}

                    {weeks.length > 1 && <GapChart weeks={weeks} />}
                </>
            )}
        </div>
    );
}

function ScoreCard({ label, score, isCircle }: { label: string; score: number | null; isCircle?: boolean }) {
    return (
        <div
            style={{
                flex: 1,
                background: "var(--color-canvas-parchment)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                textAlign: "center",
            }}
        >
            <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "var(--spacing-xs)", letterSpacing: "-0.224px" }}>
                {label}
            </p>
            <p
                style={{
                    color: isCircle ? "var(--color-primary)" : "var(--color-ink)",
                    fontSize: "28px",
                    fontWeight: 600,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.196px",
                }}
            >
                {score !== null ? score : "—"}
            </p>
        </div>
    );
}

function GapCard({ gap }: { gap: number | null }) {
    const color =
        gap === null ? "var(--color-body-muted)" : gap > 0 ? "var(--color-primary)" : "var(--color-danger)";
    const label =
        gap === null ? "—" : gap > 0 ? `+${gap}` : `${gap}`;
    const description =
        gap === null
            ? "No data"
            : gap > 0
                ? "Circle rates you higher"
                : gap < 0
                    ? "You rate yourself higher"
                    : "Perfect alignment";

    return (
        <div
            style={{
                flex: 1,
                background: "var(--color-canvas-parchment)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                textAlign: "center",
            }}
        >
            <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "var(--spacing-xs)", letterSpacing: "-0.224px" }}>
                Gap
            </p>
            <p
                style={{
                    color,
                    fontSize: "28px",
                    fontWeight: 600,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.196px",
                }}
            >
                {label}
            </p>
            <p style={{ color: "var(--color-body-muted)", fontSize: "12px", marginTop: "4px", letterSpacing: "-0.12px" }}>
                {description}
            </p>
        </div>
    );
}

function AISummary({
    habitId,
    weekStart,
    isPro,
    hasUsedFreeSummary,
}: {
    habitId: string;
    weekStart: string;
    isPro: boolean;
    hasUsedFreeSummary: boolean;
}) {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchSummary() {
        setLoading(true);
        const res = await fetch("/api/ai/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ habitId, weekStart }),
        });
        const data = await res.json();
        if (res.ok) setSummary(data.summary);
        else setError(data.error);
        setLoading(false);
    }

    if (!isPro && hasUsedFreeSummary) {
        return (
            <div
                style={{
                    background: "var(--color-canvas)",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--spacing-lg)",
                    textAlign: "center",
                }}
            >
                <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", marginBottom: "6px", letterSpacing: "-0.374px" }}>
                    AI MirrorSummary
                </p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "16px", letterSpacing: "-0.224px" }}>
                    You&apos;ve used your free AI summary. Upgrade to Pro for unlimited weekly summaries.
                </p>

                <a
                    href="/dashboard/settings"
                    style={{
                        background: "var(--color-primary)",
                        color: "var(--color-on-dark)",
                        padding: "11px 22px",
                        borderRadius: "var(--radius-pill)",
                        textDecoration: "none",
                        fontSize: "17px",
                        fontWeight: 400,
                        letterSpacing: "-0.374px",
                    }}
                >
                    Upgrade to Pro
                </a>
            </div>
        );
    }

    return (
        <div
            style={{
                background: "var(--color-canvas)",
                border: "1px solid var(--color-hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <p
                    style={{
                        color: "var(--color-body-muted)",
                        fontSize: "14px",
                        fontWeight: 600,
                        letterSpacing: "-0.224px",
                    }}
                >
                    AI MirrorSummary
                </p>
                {!summary && (
                    <button
                        onClick={fetchSummary}
                        disabled={loading}
                        style={{
                            background: "var(--color-primary)",
                            color: "var(--color-on-dark)",
                            border: "none",
                            borderRadius: "var(--radius-pill)",
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: 400,
                            cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: "var(--font-text)",
                            letterSpacing: "-0.224px",
                        }}
                    >
                        {loading ? "Generating..." : "Generate"}
                    </button>
                )}
            </div>

            {error && (
                <p style={{ color: "var(--color-danger)", fontSize: "14px", letterSpacing: "-0.224px" }}>{error}</p>
            )}

            {summary ? (
                <p style={{ color: "var(--color-ink)", fontSize: "17px", lineHeight: 1.47, letterSpacing: "-0.374px" }}>
                    {summary}
                </p>
            ) : (
                !loading && (
                    <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>
                        Click generate to get your personalized weekly summary.
                    </p>
                )
            )}
        </div>
    );
}
