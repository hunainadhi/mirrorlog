import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import PodDashboard from "@/components/pod/PodDashboard";

export const dynamic = "force-dynamic";

export default async function PodPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "0 16px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "48px" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2.2rem",
              color: "var(--text)",
              lineHeight: 1.1,
              margin: 0,
            }}>
              MirrorLog
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <p style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: 500, margin: 0 }}>
                {user.name}
              </p>
              <span style={{ color: "var(--border)" }}>·</span>
              <span style={{
                background: user.plan === "PRO" ? "var(--accent)" : "var(--surface)",
                color: user.plan === "PRO" ? "#0f0f0f" : "var(--muted)",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "100px",
                border: "1px solid var(--border)",
                letterSpacing: "0.05em",
              }}>
                {user.plan}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="/dashboard/settings" style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px 14px",
              color: "var(--muted)",
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              ⚙️ Settings
            </a>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 48, height: 48 },
                },
              }}
            />
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: "flex",
          background: "var(--surface)",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "32px",
          border: "1px solid var(--border)",
        }}>
          <a href="/dashboard" style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--muted)",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}>
            MirrorPulse
          </a>
          <a href="/dashboard/pod" style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            background: "var(--accent)",
            color: "#0f0f0f",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}>
            MirrorPod
          </a>
        </div>

        <PodDashboard
          userId={user.id}
          userName={user.name || user.email}
          pseudonym={user.pseudonym || "Anonymous"}
          plan={user.plan}
        />
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