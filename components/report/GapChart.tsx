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
        background: "var(--color-canvas)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
      }}
    >
      <p
        style={{
          color: "var(--color-body-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "-0.224px",
          marginBottom: "20px",
        }}
      >
        Trend over time
      </p>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--spacing-sm)", height: "100px" }}>
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
                    background: "var(--color-body-muted)",
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
                    background: "var(--color-primary)",
                    borderRadius: "3px 3px 0 0",
                  }}
                  title={`Circle: ${week.circleScore}`}
                />
              )}
            </div>
            <p style={{ color: "var(--color-body-muted)", fontSize: "12px", letterSpacing: "-0.12px" }}>
              W{i + 1}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--color-body-muted)" }} />
          <p style={{ color: "var(--color-body-muted)", fontSize: "12px", letterSpacing: "-0.12px" }}>You</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--color-primary)" }} />
          <p style={{ color: "var(--color-body-muted)", fontSize: "12px", letterSpacing: "-0.12px" }}>Circle</p>
        </div>
      </div>
    </div>
  );
}
