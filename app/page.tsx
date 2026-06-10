import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-canvas)",
      color: "var(--color-ink)",
      fontFamily: "var(--font-text)",
      overflowX: "hidden",
    }}>

      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--spacing-lg) 40px",
        maxWidth: "1440px",
        margin: "0 auto",
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "21px",
          fontWeight: 600,
          letterSpacing: "0.231px",
          margin: 0,
          color: "var(--color-ink)",
        }}>
          MirrorLog
        </p>
        <div style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "center" }}>
          <Link href="/sign-in" style={{
            color: "var(--color-primary)",
            textDecoration: "none",
            fontSize: "17px",
            fontWeight: 400,
            letterSpacing: "-0.374px",
          }}>
            Sign in
          </Link>
          <Link href="/sign-up" style={{
            background: "var(--color-primary)",
            color: "var(--color-on-dark)",
            textDecoration: "none",
            fontSize: "17px",
            fontWeight: 400,
            padding: "11px 22px",
            borderRadius: "var(--radius-pill)",
          }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "var(--spacing-section) var(--spacing-lg) 60px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5vw, 56px)",
          fontWeight: 600,
          lineHeight: 1.07,
          letterSpacing: "-0.28px",
          margin: "0 0 var(--spacing-lg)",
          color: "var(--color-ink)",
        }}>
          Accountability from people{"\n"}who actually see you.
        </h1>

        <p style={{
          fontSize: "21px",
          fontWeight: 300,
          lineHeight: 1.5,
          color: "var(--color-body-muted)",
          maxWidth: "600px",
          margin: "0 auto var(--spacing-xl)",
          letterSpacing: "0",
        }}>
          Track habits with your inner circle. Focus silently with strangers. Two tools, one goal — becoming the person you say you are.
        </p>

        <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/sign-up" style={{
            background: "var(--color-primary)",
            color: "var(--color-on-dark)",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: 300,
            padding: "14px 28px",
            borderRadius: "var(--radius-pill)",
            display: "inline-block",
          }}>
            Start for free
          </Link>
          <a href="#how-it-works" style={{
            color: "var(--color-primary)",
            textDecoration: "none",
            fontSize: "17px",
            fontWeight: 400,
            padding: "14px 28px",
            display: "inline-block",
            letterSpacing: "-0.374px",
          }}>
            How it works &rsaquo;
          </a>
        </div>
      </section>

      {/* Product overview */}
      <section style={{
        background: "var(--color-canvas-parchment)",
        padding: "var(--spacing-xl) var(--spacing-lg)",
      }}>
        <div style={{
          maxWidth: "640px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <p style={{ color: "var(--color-body-muted)", fontSize: "17px", lineHeight: 1.47, letterSpacing: "-0.374px" }}>
            MirrorLog includes{" "}
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>MirrorPulse</strong>
            {" "}for habit accountability and{" "}
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>MirrorPod</strong>
            {" "}for silent focus sessions with others.
          </p>
        </div>
      </section>

      {/* MirrorPulse mockup */}
      <section style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "var(--spacing-section) var(--spacing-lg)",
      }}>
        <p style={{
          textAlign: "center",
          color: "var(--color-body-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.224px",
          marginBottom: "var(--spacing-lg)",
          textTransform: "uppercase",
        }}>
          MirrorPulse
        </p>
        <div style={{
          maxWidth: "560px",
          margin: "0 auto",
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--spacing-xl)",
          boxShadow: "0 3px 30px rgba(0,0,0,0.08)",
        }}>
          <p style={{ color: "var(--color-body-muted)", fontSize: "14px", letterSpacing: "-0.224px", marginBottom: "var(--spacing-lg)" }}>
            This week's MirrorReport
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "21px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "var(--spacing-lg)", letterSpacing: "0.231px" }}>
            Hit gym 4x a week
          </p>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
            {[
              { label: "You", score: "4.0", color: "var(--color-ink)" },
              { label: "Circle", score: "2.5", color: "var(--color-primary)" },
              { label: "Gap", score: "-1.5", color: "var(--color-danger)" },
            ].map((item) => (
              <div key={item.label} style={{
                flex: 1,
                background: "var(--color-canvas-parchment)",
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-md)",
                textAlign: "center",
              }}>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", marginBottom: "var(--spacing-xs)", letterSpacing: "-0.224px" }}>{item.label}</p>
                <p style={{ color: item.color, fontSize: "28px", fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "0.196px" }}>
                  {item.score}
                </p>
              </div>
            ))}
          </div>
          <div style={{
            background: "var(--color-canvas-parchment)",
            borderRadius: "var(--radius-sm)",
            padding: "14px 16px",
            borderLeft: "3px solid var(--color-danger)",
          }}>
            <p style={{ color: "var(--color-body-muted)", fontSize: "17px", lineHeight: 1.47, fontStyle: "italic", letterSpacing: "-0.374px" }}>
              "You skip more days than you think. We see you leave early too."
            </p>
          </div>
        </div>
      </section>

      {/* MirrorPod mockup */}
      <section style={{
        background: "var(--color-canvas-parchment)",
        padding: "var(--spacing-section) var(--spacing-lg)",
      }}>
        <p style={{
          textAlign: "center",
          color: "var(--color-body-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.224px",
          marginBottom: "var(--spacing-lg)",
          textTransform: "uppercase",
        }}>
          MirrorPod
        </p>
        <div style={{
          maxWidth: "560px",
          margin: "0 auto",
          background: "var(--color-canvas)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--spacing-xl)",
        }}>
          <p style={{ color: "var(--color-body-muted)", fontSize: "14px", letterSpacing: "-0.224px", marginBottom: "var(--spacing-lg)" }}>
            Focus session · 25 min
          </p>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
            {[
              { name: "SwiftFalcon12", task: "Writing essay", initial: "S" },
              { name: "CalmOak44", task: "Coding feature", initial: "C" },
              { name: "BoldRiver91", task: "Reading chapter", initial: "B" },
            ].map((member) => (
              <div key={member.name} style={{
                flex: 1,
                background: "var(--color-canvas-parchment)",
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-md)",
                textAlign: "center",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--color-hairline)",
                  margin: "0 auto var(--spacing-xs)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "var(--color-ink-muted-80)",
                }}>
                  {member.initial}
                </div>
                <p style={{ color: "var(--color-primary)", fontSize: "14px", fontWeight: 600, marginBottom: "4px", letterSpacing: "-0.224px" }}>{member.name}</p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "12px", letterSpacing: "-0.12px" }}>{member.task}</p>
              </div>
            ))}
          </div>
          <div style={{
            background: "var(--color-canvas-parchment)",
            borderRadius: "var(--radius-sm)",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <p style={{ color: "var(--color-body-muted)", fontSize: "14px", margin: 0, letterSpacing: "-0.224px" }}>
              Mic off · Camera on · No chat
            </p>
            <p style={{ color: "var(--color-primary)", fontSize: "21px", fontWeight: 600, margin: 0, fontFamily: "var(--font-display)", letterSpacing: "0.231px" }}>
              18:42
            </p>
          </div>
        </div>
      </section>

      {/* How MirrorPulse works */}
      <section id="how-it-works" style={{
        padding: "var(--spacing-section) var(--spacing-lg)",
        maxWidth: "1080px",
        margin: "0 auto",
      }}>
        <p style={{
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: "40px",
          fontWeight: 600,
          lineHeight: 1.1,
          marginBottom: "var(--spacing-sm)",
          color: "var(--color-ink)",
        }}>
          How MirrorPulse works
        </p>
        <p style={{
          textAlign: "center",
          color: "var(--color-body-muted)",
          fontSize: "17px",
          marginBottom: "var(--spacing-xxl)",
          letterSpacing: "-0.374px",
        }}>
          Habit accountability from people who actually see you
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--spacing-md)" }}>
          {[
            { step: "01", title: "Pick a habit", body: "Choose something your friends can actually observe — hitting the gym, waking up early, eating better, staying off your phone." },
            { step: "02", title: "Invite people who see you", body: "Send a link to 3–5 friends, family, or colleagues. No app download needed. Takes them 60 seconds a week." },
            { step: "03", title: "They rate you honestly", body: "Every Sunday your circle rates how consistent you’ve actually been from 1–5. Completely anonymous so they tell the truth." },
            { step: "04", title: "See your MirrorReport", body: "Every Monday your mirror reflects the truth — your self-score vs what your circle actually saw. Close the gap." },
          ].map((item) => (
            <div key={item.step} style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
            }}>
              <p style={{ color: "var(--color-body-muted)", fontSize: "14px", fontWeight: 600, marginBottom: "var(--spacing-sm)", letterSpacing: "-0.224px" }}>{item.step}</p>
              <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", marginBottom: "var(--spacing-xs)", letterSpacing: "-0.374px" }}>{item.title}</p>
              <p style={{ color: "var(--color-body-muted)", fontSize: "14px", lineHeight: 1.43, letterSpacing: "-0.224px" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How MirrorPod works */}
      <section style={{
        background: "var(--color-canvas-parchment)",
        padding: "var(--spacing-section) var(--spacing-lg)",
      }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <p style={{
            textAlign: "center",
            fontFamily: "var(--font-display)",
            fontSize: "40px",
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: "var(--spacing-sm)",
            color: "var(--color-ink)",
          }}>
            How MirrorPod works
          </p>
          <p style={{
            textAlign: "center",
            color: "var(--color-body-muted)",
            fontSize: "17px",
            marginBottom: "var(--spacing-xxl)",
            letterSpacing: "-0.374px",
          }}>
            Silent focus sessions with real people every 30 minutes
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--spacing-md)" }}>
            {[
              { step: "01", title: "Sign up for a slot", body: "Pods run every 30 minutes. Pick an upcoming slot and choose your category — Study, Coding, Writing, and more." },
              { step: "02", title: "Get matched", body: "Up to 5 people with similar goals are grouped together. You see each other’s pseudonym and task." },
              { step: "03", title: "Work silently on camera", body: "Camera on, mic permanently off. No chat, no distractions. Just the accountability of being seen by real people." },
              { step: "04", title: "Session ends", body: "After 25 minutes the session closes. Your streak and focus history are tracked over time in MirrorLog." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "var(--color-canvas)",
                border: "1px solid var(--color-hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
              }}>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", fontWeight: 600, marginBottom: "var(--spacing-sm)", letterSpacing: "-0.224px" }}>{item.step}</p>
                <p style={{ color: "var(--color-ink)", fontWeight: 600, fontSize: "17px", marginBottom: "var(--spacing-xs)", letterSpacing: "-0.374px" }}>{item.title}</p>
                <p style={{ color: "var(--color-body-muted)", fontSize: "14px", lineHeight: 1.43, letterSpacing: "-0.224px" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "var(--spacing-section) var(--spacing-lg)",
      }}>
        <p style={{
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: "40px",
          fontWeight: 600,
          lineHeight: 1.1,
          marginBottom: "var(--spacing-xxl)",
          color: "var(--color-ink)",
        }}>
          Simple pricing
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          {[
            {
              name: "Free",
              price: "$0",
              features: [
                "2 habits",
                "3 raters per habit",
                "4 weeks history",
                "1 free AI summary",
                "2 MirrorPod sessions/day",
                "10 sessions/month",
              ],
              cta: "Get started",
              href: "/sign-up",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$3/mo",
              features: [
                "10 habits",
                "8 raters per habit",
                "Full history",
                "Unlimited AI summaries",
                "6 MirrorPod sessions/day",
                "30 sessions/month",
              ],
              cta: "Upgrade to Pro",
              href: "/sign-up",
              highlight: true,
            },
          ].map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlight ? "var(--color-primary)" : "var(--color-canvas)",
              border: plan.highlight ? "none" : "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-xl) var(--spacing-lg)",
            }}>
              <p style={{ color: plan.highlight ? "rgba(255,255,255,0.7)" : "var(--color-body-muted)", fontSize: "14px", marginBottom: "var(--spacing-xs)", letterSpacing: "-0.224px" }}>{plan.name}</p>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "40px",
                fontWeight: 600,
                color: plan.highlight ? "var(--color-on-dark)" : "var(--color-ink)",
                marginBottom: "var(--spacing-lg)",
                lineHeight: 1.1,
              }}>
                {plan.price}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)", marginBottom: "var(--spacing-lg)" }}>
                {plan.features.map((f) => (
                  <p key={f} style={{ color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--color-body-muted)", fontSize: "14px", letterSpacing: "-0.224px" }}>
                    {f}
                  </p>
                ))}
              </div>
              <Link href={plan.href} style={{
                display: "block",
                textAlign: "center",
                background: plan.highlight ? "var(--color-canvas)" : "var(--color-primary)",
                color: plan.highlight ? "var(--color-primary)" : "var(--color-on-dark)",
                textDecoration: "none",
                padding: "11px 22px",
                borderRadius: "var(--radius-pill)",
                fontSize: "17px",
                fontWeight: 400,
                letterSpacing: "-0.374px",
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "var(--color-surface-tile-1)",
        padding: "var(--spacing-section) var(--spacing-lg)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "40px",
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: "var(--spacing-md)",
            color: "var(--color-on-dark)",
          }}>
            Real accountability starts here
          </p>
          <p style={{ color: "var(--color-body-muted)", fontSize: "17px", marginBottom: "var(--spacing-xl)", letterSpacing: "-0.374px" }}>
            Free forever. No credit card. Just honest friends.
          </p>
          <Link href="/sign-up" style={{
            background: "var(--color-primary-on-dark)",
            color: "var(--color-on-dark)",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: 300,
            padding: "14px 28px",
            borderRadius: "var(--radius-pill)",
            display: "inline-block",
          }}>
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--color-canvas-parchment)",
        padding: "var(--spacing-xl) 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "var(--spacing-md)",
      }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, color: "var(--color-ink)" }}>
          MirrorLog
        </p>
        <p style={{ color: "var(--color-ink-muted-48)", fontSize: "12px", letterSpacing: "-0.12px" }}>
          &copy; 2026 MirrorLog. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
