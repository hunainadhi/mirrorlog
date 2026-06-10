"use client";

import { useState, useEffect } from "react";
import SlotBrowser from "./SlotBrowser";
import PodRoom from "./PodRoom";

interface Props {
    userId: string;
    userName: string;
    pseudonym: string;
    plan: string;
}

export interface Slot {
    id: string;
    scheduledFor: string;
    status: string;
    signupCount: number;
    userSignedUp: boolean;
    userCategory: string | null;
}

export interface UserStats {
    pseudonym: string;
    podDailyCount: number;
    podMonthlyCount: number;
    podStreak: number;
    plan: string;
}

export default function PodDashboard({ userId, userName, pseudonym, plan }: Props) {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeRoom, setActiveRoom] = useState<{
        token: string;
        roomUrl: string;
        roomName: string;
        podId: string;
        duration: number;
        scheduledFor: string;
    } | null>(null);

    async function fetchSlots() {
        const res = await fetch("/api/pods/slots");
        const data = await res.json();
        setSlots(data.slots || []);
        setUserStats(data.user || null);
        setLoading(false);
    }

    useEffect(() => { fetchSlots(); }, []);

    async function handleJoin(podId: string, task: string, scheduledFor: string) {
        const res = await fetch("/api/pods/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ podId, task }),
        });
        const data = await res.json();
        if (res.ok) {
            setActiveRoom({
                token: data.token,
                roomUrl: data.roomUrl,
                roomName: data.roomName,
                podId,
                duration: 25,
                scheduledFor,
            });
        } else {
            alert(data.error);
        }
    }

    if (activeRoom) {
        return (
            <PodRoom
                token={activeRoom.token}
                roomUrl={activeRoom.roomUrl}
                podId={activeRoom.podId}
                duration={activeRoom.duration}
                scheduledFor={activeRoom.scheduledFor}
                pseudonym={pseudonym}
                onLeave={() => { setActiveRoom(null); fetchSlots(); }}
            />
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>

            {/* Header */}
            <div>
                <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "4px",
                    letterSpacing: "0.196px",
                }}>
                    MirrorPod
                </p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>
                    Silent focus sessions with real people. Camera on, mic off.
                </p>
            </div>

            {/* User stats */}
            {userStats && (
                <div style={{
                    background: "var(--color-canvas)",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "var(--radius-lg)",
                    padding: "20px var(--spacing-lg)",
                    display: "flex",
                    gap: "var(--spacing-lg)",
                }}>
                    <div>
                        <p style={{ color: "var(--color-body-muted)", fontSize: "12px", marginBottom: "4px", letterSpacing: "-0.12px" }}>Your pseudonym</p>
                        <p style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>{userStats.pseudonym}</p>
                    </div>
                    <div>
                        <p style={{ color: "var(--color-body-muted)", fontSize: "12px", marginBottom: "4px", letterSpacing: "-0.12px" }}>Today</p>
                        <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>
                            {userStats.podDailyCount}/{plan === "PRO" ? 6 : 2} pods
                        </p>
                    </div>
                    <div>
                        <p style={{ color: "var(--color-body-muted)", fontSize: "12px", marginBottom: "4px", letterSpacing: "-0.12px" }}>Streak</p>
                        <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>
                            {userStats.podStreak} days
                        </p>
                    </div>
                    <div>
                        <p style={{ color: "var(--color-body-muted)", fontSize: "12px", marginBottom: "4px", letterSpacing: "-0.12px" }}>This month</p>
                        <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>
                            {userStats.podMonthlyCount}/{plan === "PRO" ? 30 : 10}
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>Loading slots...</p>
            ) : (
                <SlotBrowser
                    slots={slots}
                    plan={plan}
                    onSignup={fetchSlots}
                    onJoin={handleJoin}
                />
            )}
        </div>
    );
}
