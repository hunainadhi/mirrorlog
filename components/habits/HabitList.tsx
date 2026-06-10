"use client";

import Link from "next/link";
import InviteRater from "./InviteRater";
import { useState } from "react";

interface Habit {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date | string;
}

interface Props {
    habits: Habit[];
    onHabitDeleted: () => void;
}

export default function HabitList({ habits, onHabitDeleted }: Props) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(habitId: string) {
        if (!confirm("Delete this habit? This cannot be undone.")) return;
        setDeletingId(habitId);

        await fetch(`/api/habits?habitId=${habitId}`, { method: "DELETE" });
        onHabitDeleted();
        setDeletingId(null);
    }

    if (habits.length === 0) {
        return (
            <div style={{
                marginTop: "16px",
                textAlign: "center",
                padding: "48px 0",
                color: "var(--color-body-muted)",
            }}>
                <p style={{ fontSize: "17px", fontWeight: 600 }}>No habits yet</p>
                <p style={{ marginTop: "var(--spacing-xs)", fontSize: "14px", letterSpacing: "-0.224px" }}>
                    Add one above to get started.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-sm)",
        }}>
            {habits.map((habit) => (
                <div
                    key={habit.id}
                    style={{
                        background: "var(--color-canvas)",
                        border: "1px solid var(--color-hairline)",
                        borderRadius: "var(--radius-lg)",
                        padding: "20px var(--spacing-lg)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--spacing-sm)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "var(--color-primary)",
                                flexShrink: 0,
                            }} />
                            <div>
                                <Link
                                    href={`/dashboard/habits/${habit.id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <p
                                        style={{
                                            color: "var(--color-ink)",
                                            fontWeight: 600,
                                            fontSize: "17px",
                                            cursor: "pointer",
                                            letterSpacing: "-0.374px",
                                        }}
                                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-primary)")}
                                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink)")}
                                    >
                                        {habit.title}
                                    </p>
                                </Link>
                                {habit.description && (
                                    <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>
                                        {habit.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(habit.id)}
                            disabled={deletingId === habit.id}
                            style={{
                                background: "transparent",
                                border: "1px solid var(--color-danger)",
                                color: "var(--color-danger)",
                                cursor: "pointer",
                                fontSize: "14px",
                                padding: "4px 10px",
                                borderRadius: "var(--radius-sm)",
                                letterSpacing: "-0.224px",
                            }}
                        >
                            {deletingId === habit.id ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                    <InviteRater habitId={habit.id} habitTitle={habit.title} />
                </div>
            ))}
        </div>
    );
}
