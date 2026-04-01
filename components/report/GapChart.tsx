"use client";

interface Week {
  weekStart: string;
  selfScore: number | null;
  circleScore: number | null;
  gapScore: number | null;
}

interface Props {
  weeks: Week[];
}

export default function GapChart({ weeks }: Props) {
  const maxScore = 5;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "20px",
        }}
      >
        Trend over time
      </p>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "100px" }}>
        {weeks.map((week, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "80px" }}>
              {week.selfScore !== null && (
                <div
                  style={{
                    width: "12px",
                    height: `${(week.selfScore / maxScore) * 80}px`,
                    background: "var(--muted)",
                    borderRadius: "3px 3px 0 0",
                  }}
                  title={`You: ${week.selfScore}`}
                />
              )}
              {week.circleScore !== null && (
                <div
                  style={{
                    width: "12px",
                    height: `${(week.circleScore / maxScore) * 80}px`,
                    background: "var(--accent)",
                    borderRadius: "3px 3px 0 0",
                  }}
                  title={`Circle: ${week.circleScore}`}
                />
              )}
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.6rem" }}>
              W{i + 1}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--muted)" }} />
          <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>You</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--accent)" }} />
          <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Circle</p>
        </div>
      </div>
    </div>
  );
}