import { ImageResponse } from "@vercel/og";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const habitTitle = searchParams.get("title") || "My Habit";
  const userName = searchParams.get("name") || "Anonymous";
  const selfScore = searchParams.get("self") || "—";
  const circleScore = searchParams.get("circle") || "—";
  const gapScore = searchParams.get("gap") || "—";
  const weekStart = searchParams.get("week") || "";

  const gapNum = parseFloat(gapScore);
  const gapColor = isNaN(gapNum) ? "#6b6860" : gapNum >= 0 ? "#c9f97f" : "#ff6b6b";
  const gapLabel = isNaN(gapNum) ? "—" : gapNum > 0 ? `+${gapScore}` : gapScore;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#f0ede8", fontSize: "28px", fontWeight: 700, margin: 0 }}>
            MirrorLog
          </p>
          <p style={{ color: "#6b6860", fontSize: "18px", margin: 0 }}>
            {userName}'s MirrorReport
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ color: "#6b6860", fontSize: "16px", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Habit
          </p>
          <p style={{ color: "#f0ede8", fontSize: "40px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {habitTitle}
          </p>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { label: "YOU", value: selfScore, color: "#f0ede8" },
            { label: "CIRCLE", value: circleScore, color: "#c9f97f" },
            { label: "GAP", value: gapLabel, color: gapColor },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                background: "#111",
                borderRadius: "16px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #1e1e1e",
              }}
            >
              <p style={{ color: "#6b6860", fontSize: "14px", margin: "0 0 12px", letterSpacing: "0.1em" }}>
                {item.label}
              </p>
              <p style={{ color: item.color, fontSize: "56px", fontWeight: 700, margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#6b6860", fontSize: "16px", margin: 0 }}>
            {weekStart}
          </p>
          <p style={{ color: "#6b6860", fontSize: "16px", margin: 0 }}>
            mirrorlog.org
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}