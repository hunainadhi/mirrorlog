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
  } | null>(null);

  async function fetchSlots() {
    const res = await fetch("/api/pods/slots");
    const data = await res.json();
    setSlots(data.slots || []);
    setUserStats(data.user || null);
    setLoading(false);
  }

  useEffect(() => { fetchSlots(); }, []);

  async function handleJoin(podId: string, task: string) {
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
        pseudonym={pseudonym}
        onLeave={() => { setActiveRoom(null); fetchSlots(); }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.8rem",
          color: "var(--text)",
          marginBottom: "4px",
        }}>
          MirrorPod
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Silent focus sessions with real people. Camera on, mic off.
        </p>
      </div>

      {/* User stats */}
      {userStats && (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px 24px",
          display: "flex",
          gap: "24px",
        }}>
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "4px" }}>Your pseudonym</p>
            <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>{userStats.pseudonym}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "4px" }}>Today</p>
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>
              {userStats.podDailyCount}/{plan === "PRO" ? 6 : 2} pods
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "4px" }}>Streak</p>
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>
              {userStats.podStreak} days 🔥
            </p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "4px" }}>This month</p>
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>
              {userStats.podMonthlyCount}/{plan === "PRO" ? 30 : 10}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading slots...</p>
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