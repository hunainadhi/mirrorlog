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
                color: "var(--muted)",
            }}>
                <p style={{ fontSize: "2rem" }}>◎</p>
                <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                    No habits yet. Add one above.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
        }}>
            {habits.map((habit, i) => (
                <div
                    key={habit.id}
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "20px 24px",
                        animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "var(--accent)",
                                flexShrink: 0,
                            }} />
                            <div>
                                <Link
                                    href={`/dashboard/habits/${habit.id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <p
                                        style={{
                                            color: "var(--text)",
                                            fontWeight: 500,
                                            fontSize: "0.95rem",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--accent)")}
                                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text)")}
                                    >
                                        {habit.title}
                                    </p>
                                </Link>
                                {habit.description && (
                                    <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "4px" }}>
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
                                border: "1px solid #ff6b6b",
                                color: "#ff6b6b",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                padding: "4px 10px",
                                borderRadius: "6px",
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#ff6b6b")}
                            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "var(--muted)")}
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