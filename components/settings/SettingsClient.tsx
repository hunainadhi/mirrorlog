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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
      <div>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          fontWeight: 600,
          color: "var(--color-ink)",
          marginBottom: "4px",
          letterSpacing: "0.196px",
        }}>
          Settings
        </p>
        <p style={{ color: "var(--color-body-muted)", fontSize: "17px", letterSpacing: "-0.374px" }}>
          Manage your account and plan
        </p>
      </div>

      {/* Account */}
      <div style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
      }}>
        <p style={{
          color: "var(--color-body-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.224px",
          marginBottom: "16px",
        }}>
          Account
        </p>
        <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>{user.name || "No name"}</p>
        <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "4px", letterSpacing: "-0.224px" }}>{user.email}</p>
      </div>

      {/* Plan */}
      <div style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
      }}>
        <p style={{
          color: "var(--color-body-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.224px",
          marginBottom: "16px",
        }}>
          Plan
        </p>

        {user.plan === "PRO" ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>Pro</p>
              <span style={{
                background: "var(--color-primary)",
                color: "var(--color-on-dark)",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                letterSpacing: "-0.12px",
              }}>
                ACTIVE
              </span>
            </div>
            <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "16px", letterSpacing: "-0.224px" }}>
              You have access to all Pro features including AI MirrorSummary, 10 habits, and 8 raters per habit.
            </p>
            {!cancelled ? (
              <button
                onClick={handleCancel}
                disabled={loading === "cancel"}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-pill)",
                  padding: "11px 22px",
                  color: "var(--color-body-muted)",
                  fontSize: "17px",
                  cursor: "pointer",
                  width: "100%",
                  fontFamily: "var(--font-text)",
                  letterSpacing: "-0.374px",
                }}
              >
                {loading === "cancel" ? "Cancelling..." : "Cancel subscription"}
              </button>
            ) : (
              <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginTop: "var(--spacing-xs)", letterSpacing: "-0.224px" }}>
                Subscription cancelled. You&apos;ll keep Pro until the end of your billing period.
              </p>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", letterSpacing: "-0.374px" }}>Free</p>
              <span style={{
                background: "var(--color-canvas-parchment)",
                color: "var(--color-body-muted)",
                fontSize: "12px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                letterSpacing: "-0.12px",
              }}>
                CURRENT
              </span>
            </div>

            {/* Billing toggle */}
            <div style={{
              display: "flex",
              background: "var(--color-canvas-parchment)",
              borderRadius: "var(--radius-md)",
              padding: "4px",
              marginBottom: "20px",
              width: "fit-content",
            }}>
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  style={{
                    background: billingCycle === cycle ? "var(--color-primary)" : "transparent",
                    color: billingCycle === cycle ? "var(--color-on-dark)" : "var(--color-body-muted)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: billingCycle === cycle ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "var(--font-text)",
                    letterSpacing: "-0.224px",
                  }}
                >
                  {cycle === "monthly" ? "Monthly — $3" : "Yearly — $24"}
                  {cycle === "yearly" && (
                    <span style={{ marginLeft: "6px", fontSize: "12px", letterSpacing: "-0.12px" }}>Save 33%</span>
                  )}
                </button>
              ))}
            </div>

            {/* Pro features */}
            <div style={{
              background: "var(--color-canvas-parchment)",
              borderRadius: "var(--radius-md)",
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
                  color: "var(--color-ink)",
                  fontSize: "14px",
                  marginBottom: "var(--spacing-xs)",
                  letterSpacing: "-0.224px",
                }}>
                  {feature}
                </p>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading === "upgrade"}
              style={{
                width: "100%",
                background: "var(--color-primary)",
                color: "var(--color-on-dark)",
                border: "none",
                borderRadius: "var(--radius-pill)",
                padding: "14px",
                fontSize: "17px",
                fontWeight: 400,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-text)",
                letterSpacing: "-0.374px",
              }}
            >
              {loading === "upgrade" ? "Redirecting..." : `Upgrade to Pro — ${billingCycle === "monthly" ? "$3/mo" : "$24/yr"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
