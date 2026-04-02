
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import HabitsDashboard from "@/components/habits/HabitsDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!user.onboarded) redirect("/dashboard/welcome");
  const habits = await db.habit.findMany({
    where: { userId: user.id, active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 16px",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "48px" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "48px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "2.2rem",
                color: "var(--text)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              MirrorLog
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "6px" }}>
              {user.name} · {user.plan} plan
            </p>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 36, height: 36 },
              },
            }}
          />
        </div>

        <HabitsDashboard initialHabits={habits} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::placeholder { color: #3a3a3a; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}