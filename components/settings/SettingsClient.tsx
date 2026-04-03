"use client";

import { useState } from "react";

interface Props {
  user: {
    name: string | null;
    email: string;
    plan: string;
    stripeSubId: string | null;
  };
  monthlyPriceId: string;
  yearlyPriceId: string;
}

export default function SettingsClient({ user, monthlyPriceId, yearlyPriceId }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [cancelled, setCancelled] = useState(false);

  async function handleUpgrade() {
    const priceId = billingCycle === "monthly" ? monthlyPriceId : yearlyPriceId;
    setLoading("upgrade");

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel? You'll keep Pro until the end of your billing period.")) return;
    setLoading("cancel");

    const res = await fetch("/api/stripe/cancel", { method: "POST" });
    if (res.ok) setCancelled(true);
    setLoading(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <p style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.8rem",
          color: "var(--text)",
          marginBottom: "4px",
        }}>
          Settings
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Manage your account and plan
        </p>
      </div>

      {/* Account */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
      }}>
        <p style={{
          color: "var(--muted)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}>
          Account
        </p>
        <p style={{ color: "var(--text)", fontWeight: 500 }}>{user.name || "No name"}</p>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "4px" }}>{user.email}</p>
      </div>

      {/* Plan */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
      }}>
        <p style={{
          color: "var(--muted)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}>
          Plan
        </p>

        {user.plan === "PRO" ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "1.1rem" }}>Pro</p>
              <span style={{
                background: "var(--accent)",
                color: "#0f0f0f",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "100px",
              }}>
                ACTIVE
              </span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
              You have access to all Pro features including AI MirrorSummary, 5 habits, and 8 raters per habit.
            </p>
            {!cancelled ? (
              <button
                onClick={handleCancel}
                disabled={loading === "cancel"}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading === "cancel" ? "Cancelling..." : "Cancel subscription"}
              </button>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "8px" }}>
                Subscription cancelled. You'll keep Pro until the end of your billing period.
              </p>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "1.1rem" }}>Free</p>
              <span style={{
                background: "var(--border)",
                color: "var(--muted)",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "100px",
              }}>
                CURRENT
              </span>
            </div>

            {/* Billing toggle */}
            <div style={{
              display: "flex",
              background: "#0f0f0f",
              borderRadius: "10px",
              padding: "4px",
              marginBottom: "20px",
              width: "fit-content",
            }}>
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  style={{
                    background: billingCycle === cycle ? "var(--accent)" : "transparent",
                    color: billingCycle === cycle ? "#0f0f0f" : "var(--muted)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {cycle === "monthly" ? "Monthly — $6" : "Yearly — $48"}
                  {cycle === "yearly" && (
                    <span style={{ marginLeft: "6px", fontSize: "0.7rem" }}>Save 33%</span>
                  )}
                </button>
              ))}
            </div>

            {/* Pro features */}
            <div style={{
              background: "#0f0f0f",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
            }}>
              {[
                "5 habits (vs 1 on Free)",
                "8 raters per habit (vs 3)",
                "Full history (vs 4 weeks)",
                "AI MirrorSummary every week",
              ].map((feature) => (
                <p key={feature} style={{
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                }}>
                  ✓ {feature}
                </p>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading === "upgrade"}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "#0f0f0f",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loading === "upgrade" ? "Redirecting..." : `Upgrade to Pro — ${billingCycle === "monthly" ? "$6/mo" : "$48/yr"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}