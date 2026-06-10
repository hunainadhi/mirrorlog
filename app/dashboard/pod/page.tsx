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
    <div style={{ minHeight: "100vh", background: "var(--color-canvas)", padding: "0 16px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "48px" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--spacing-lg)",
        }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 600,
              color: "var(--color-ink)",
              lineHeight: 1.14,
              letterSpacing: "0.196px",
              margin: 0,
            }}>
              MirrorLog
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", marginTop: "var(--spacing-xs)" }}>
              <p style={{ color: "var(--color-ink)", fontSize: "14px", fontWeight: 400, margin: 0, letterSpacing: "-0.224px" }}>
                {user.name}
              </p>
              <span style={{ color: "var(--color-hairline)" }}>&middot;</span>
              <span style={{
                background: user.plan === "PRO" ? "var(--color-primary)" : "var(--color-canvas-parchment)",
                color: user.plan === "PRO" ? "var(--color-on-dark)" : "var(--color-body-muted)",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                letterSpacing: "-0.12px",
              }}>
                {user.plan}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="/dashboard/settings" style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 14px",
              color: "var(--color-body-muted)",
              fontSize: "14px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              letterSpacing: "-0.224px",
            }}>
              Settings
            </a>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 44, height: 44 },
                },
              }}
            />
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: "flex",
          background: "var(--color-canvas-parchment)",
          borderRadius: "var(--radius-md)",
          padding: "4px",
          marginBottom: "var(--spacing-xl)",
        }}>
          <a href="/dashboard" style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "var(--radius-sm)",
            background: "transparent",
            color: "var(--color-body-muted)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 400,
            letterSpacing: "-0.224px",
          }}>
            MirrorPulse
          </a>
          <a href="/dashboard/pod" style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-primary)",
            color: "var(--color-on-dark)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.224px",
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
    </div>
  );
}
