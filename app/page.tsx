import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f0ede8",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>

      {/* Grain overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Glow */}
      <div style={{
        position: "fixed",
        top: "-20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(201,249,127,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Nav */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 40px",
          borderBottom: "1px solid #1a1a1a",
        }}>
          
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.3rem",
            margin: 0,
            color: "#f0ede8",
          }}>
            MirrorLog
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/sign-in" style={{
              color: "#6b6860",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}>
              Sign in
            </Link>
            <Link href="/sign-up" style={{
              background: "#c9f97f",
              color: "#0a0a0a",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              padding: "8px 18px",
              borderRadius: "8px",
            }}>
              Get started free
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}>
          <div style={{
            display: "inline-block",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "100px",
            padding: "6px 16px",
            fontSize: "0.75rem",
            color: "#c9f97f",
            marginBottom: "32px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Honest habit accountability
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            lineHeight: 1.1,
            margin: "0 0 24px",
            color: "#f0ede8",
          }}>
            Accountability from people<br />
            <span style={{ color: "#c9f97f" }}>who actually see you.</span>
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "#6b6860",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 48px",
          }}>
            Track habits with your inner circle. Focus silently with strangers. Two tools, one goal — becoming the person you say you are.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{
              background: "#c9f97f",
              color: "#0a0a0a",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "12px",
              display: "inline-block",
            }}>
              Start for free
            </Link>
            <a href="#how-it-works" style={{
              background: "transparent",
              color: "#6b6860",
              textDecoration: "none",
              fontSize: "1rem",
              padding: "14px 32px",
              borderRadius: "12px",
              border: "1px solid #2a2a2a",
              display: "inline-block",
            }}>
              How it works
            </a>
          </div>
        </section>

        {/* Product overview pill */}
        <section style={{
          maxWidth: "640px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}>
          <div style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "16px",
            padding: "20px 24px",
            textAlign: "center",
          }}>
            <p style={{ color: "#6b6860", fontSize: "0.85rem", margin: 0 }}>
              MirrorLog includes{" "}
              <strong style={{ color: "#f0ede8" }}>MirrorPulse</strong>
              {" "}for habit accountability and{" "}
              <strong style={{ color: "#f0ede8" }}>MirrorPod</strong>
              {" "}for silent focus sessions with others.
            </p>
          </div>
        </section>

        {/* MirrorPulse mockup */}
        <section style={{
          maxWidth: "560px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}>
          <p style={{
            textAlign: "center",
            color: "#6b6860",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
          }}>
            MirrorPulse
          </p>
          <div style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}>
            <p style={{ color: "#6b6860", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>
              This week's MirrorReport
            </p>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#f0ede8", marginBottom: "24px" }}>
              Hit gym 4x a week
            </p>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "You", score: "4.0", color: "#6b6860" },
                { label: "Circle", score: "2.5", color: "#c9f97f" },
                { label: "Gap", score: "-1.5", color: "#ff6b6b" },
              ].map((item) => (
                <div key={item.label} style={{
                  flex: 1,
                  background: "#0a0a0a",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                }}>
                  <p style={{ color: "#6b6860", fontSize: "0.7rem", marginBottom: "8px" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: "1.8rem", fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>
                    {item.score}
                  </p>
                </div>
              ))}
            </div>
            <div style={{
              background: "#0a0a0a",
              borderRadius: "10px",
              padding: "14px 16px",
              borderLeft: "3px solid #ff6b6b",
            }}>
              <p style={{ color: "#6b6860", fontSize: "0.8rem", fontStyle: "italic" }}>
                "You skip more days than you think. We see you leave early too."
              </p>
            </div>
          </div>
        </section>

        {/* MirrorPod mockup */}
        <section style={{
          maxWidth: "560px",
          margin: "0 auto 120px",
          padding: "0 24px",
        }}>
          <p style={{
            textAlign: "center",
            color: "#6b6860",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
          }}>
            MirrorPod
          </p>
          <div style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}>
            <p style={{ color: "#6b6860", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>
              Focus session · 25 min
            </p>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              {[
                { name: "SwiftFalcon12", task: "Writing essay" },
                { name: "CalmOak44", task: "Coding feature" },
                { name: "BoldRiver91", task: "Reading chapter" },
              ].map((member) => (
                <div key={member.name} style={{
                  flex: 1,
                  background: "#0a0a0a",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#1a1a1a",
                    margin: "0 auto 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}>
                    👤
                  </div>
                  <p style={{ color: "#c9f97f", fontSize: "0.7rem", fontWeight: 600, marginBottom: "4px" }}>{member.name}</p>
                  <p style={{ color: "#6b6860", fontSize: "0.65rem" }}>{member.task}</p>
                </div>
              ))}
            </div>
            <div style={{
              background: "#0a0a0a",
              borderRadius: "10px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <p style={{ color: "#6b6860", fontSize: "0.8rem", margin: 0 }}>
                🔇 Mic off · 📹 Camera on · 💬 No chat
              </p>
              <p style={{ color: "#c9f97f", fontSize: "0.9rem", fontWeight: 700, margin: 0, fontFamily: "'DM Serif Display', serif" }}>
                18:42
              </p>
            </div>
          </div>
        </section>

        {/* How MirrorPulse works */}
        <section id="how-it-works" style={{
          maxWidth: "860px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}>
          <p style={{
            textAlign: "center",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2rem",
            marginBottom: "12px",
          }}>
            How MirrorPulse works
          </p>
          <p style={{
            textAlign: "center",
            color: "#6b6860",
            fontSize: "0.9rem",
            marginBottom: "48px",
          }}>
            Habit accountability from people who actually see you
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { step: "01", emoji: "🎯", title: "Pick a habit", body: "Choose something your friends can actually observe — hitting the gym, waking up early, eating better, staying off your phone." },
              { step: "02", emoji: "👥", title: "Invite people who see you", body: "Send a link to 3–5 friends, family, or colleagues. No app download needed. Takes them 60 seconds a week." },
              { step: "03", emoji: "🔒", title: "They rate you honestly", body: "Every Sunday your circle rates how consistent you've actually been from 1–5. Completely anonymous so they tell the truth." },
              { step: "04", emoji: "🪞", title: "See your MirrorReport", body: "Every Monday your mirror reflects the truth — your self-score vs what your circle actually saw. Close the gap." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: "16px",
                padding: "28px",
              }}>
                <p style={{ color: "#2a2a2a", fontSize: "0.75rem", fontWeight: 700, marginBottom: "12px" }}>{item.step}</p>
                <p style={{ fontSize: "1.8rem", marginBottom: "12px" }}>{item.emoji}</p>
                <p style={{ color: "#f0ede8", fontWeight: 600, marginBottom: "8px" }}>{item.title}</p>
                <p style={{ color: "#6b6860", fontSize: "0.85rem", lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How MirrorPod works */}
        <section style={{
          maxWidth: "860px",
          margin: "0 auto 120px",
          padding: "0 24px",
        }}>
          <p style={{
            textAlign: "center",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2rem",
            marginBottom: "12px",
          }}>
            How MirrorPod works
          </p>
          <p style={{
            textAlign: "center",
            color: "#6b6860",
            fontSize: "0.9rem",
            marginBottom: "48px",
          }}>
            Silent focus sessions with real people every 30 minutes
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { step: "01", emoji: "📅", title: "Sign up for a slot", body: "Pods run every 30 minutes. Pick an upcoming slot and choose your category — Study, Coding, Writing, and more." },
              { step: "02", emoji: "👥", title: "Get matched", body: "Up to 5 people with similar goals are grouped together. You see each other's pseudonym and task." },
              { step: "03", emoji: "📹", title: "Work silently on camera", body: "Camera on, mic permanently off. No chat, no distractions. Just the accountability of being seen by real people." },
              { step: "04", emoji: "✅", title: "Session ends", body: "After 25 minutes the session closes. Your streak and focus history are tracked over time in MirrorLog." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#111",
                border: "1px solid #1e1e1e",
                borderRadius: "16px",
                padding: "28px",
              }}>
                <p style={{ color: "#2a2a2a", fontSize: "0.75rem", fontWeight: 700, marginBottom: "12px" }}>{item.step}</p>
                <p style={{ fontSize: "1.8rem", marginBottom: "12px" }}>{item.emoji}</p>
                <p style={{ color: "#f0ede8", fontWeight: 600, marginBottom: "8px" }}>{item.title}</p>
                <p style={{ color: "#6b6860", fontSize: "0.85rem", lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{
          maxWidth: "640px",
          margin: "0 auto 120px",
          padding: "0 24px",
        }}>
          <p style={{
            textAlign: "center",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2rem",
            marginBottom: "48px",
          }}>
            Simple pricing
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                background: plan.highlight ? "#c9f97f" : "#111",
                border: `1px solid ${plan.highlight ? "#c9f97f" : "#1e1e1e"}`,
                borderRadius: "20px",
                padding: "32px 28px",
              }}>
                <p style={{ color: plan.highlight ? "#0a0a0a" : "#6b6860", fontSize: "0.85rem", marginBottom: "8px" }}>{plan.name}</p>
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2rem",
                  color: plan.highlight ? "#0a0a0a" : "#f0ede8",
                  marginBottom: "24px",
                }}>
                  {plan.price}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                  {plan.features.map((f) => (
                    <p key={f} style={{ color: plan.highlight ? "#0a0a0a" : "#6b6860", fontSize: "0.85rem" }}>
                      ✓ {f}
                    </p>
                  ))}
                </div>
                <Link href={plan.href} style={{
                  display: "block",
                  textAlign: "center",
                  background: plan.highlight ? "#0a0a0a" : "#1a1a1a",
                  color: plan.highlight ? "#c9f97f" : "#f0ede8",
                  textDecoration: "none",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          maxWidth: "640px",
          margin: "0 auto 80px",
          padding: "0 24px",
          textAlign: "center",
        }}>
          <div style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "24px",
            padding: "64px 40px",
          }}>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2.2rem",
              marginBottom: "16px",
              color: "#f0ede8",
            }}>
              Real accountability starts here
            </p>
            <p style={{ color: "#6b6860", fontSize: "0.95rem", marginBottom: "32px" }}>
              Free forever. No credit card. Just honest friends.
            </p>
            <Link href="/sign-up" style={{
              background: "#c9f97f",
              color: "#0a0a0a",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 700,
              padding: "14px 40px",
              borderRadius: "12px",
              display: "inline-block",
            }}>
              Get started free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid #1a1a1a",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#f0ede8" }}>
            MirrorLog
          </p>
          <p style={{ color: "#6b6860", fontSize: "0.8rem" }}>
            © 2026 MirrorLog. All rights reserved.
          </p>
        </footer>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { transition: opacity 0.2s ease; }
        a:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}