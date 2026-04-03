import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "0 16px" }}>
            <div style={{ maxWidth: "480px", margin: "0 auto", paddingTop: "48px" }}>
                <a href="/dashboard" style={{
                    color: "var(--muted)",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    display: "inline-block",
                    marginBottom: "32px",
                }}>
                    Back to dashboard
                </a>
                <SettingsClient
                    user={{
                        name: user.name,
                        email: user.email,
                        plan: user.plan,
                        stripeSubId: user.stripeSubId,
                    }}
                    monthlyPriceId={process.env.STRIPE_PRO_MONTHLY_PRICE_ID!}
                    yearlyPriceId={process.env.STRIPE_PRO_YEARLY_PRICE_ID!}
                />
            </div>
        </div>
    );
}