import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface WeekData {
  habitTitle: string;
  selfScore: number | null;
  circleScore: number | null;
  gapScore: number | null;
  circleCount: number;
  notes: string[];
  previousWeeks: {
    selfScore: number | null;
    circleScore: number | null;
    gapScore: number | null;
  }[];
}

export async function generateMirrorSummary(data: WeekData): Promise<string> {
  const notesText =
    data.notes.length > 0
      ? `Anonymous notes from your circle:\n${data.notes.map((n) => `- "${n}"`).join("\n")}`
      : "No anonymous notes were left this week.";

  const trendText =
    data.previousWeeks.length > 0
      ? `Previous weeks (most recent first):\n${data.previousWeeks
          .map(
            (w, i) =>
              `Week ${i + 1}: You ${w.selfScore ?? "—"}, Circle ${w.circleScore ?? "—"}, Gap ${w.gapScore ?? "—"}`
          )
          .join("\n")}`
      : "This is the first week of data.";

  const prompt = `You are a supportive but honest accountability coach writing a weekly MirrorReport summary for someone tracking their habits.

Here is this week's data for the habit: "${data.habitTitle}"

This week:
- Self score: ${data.selfScore ?? "not rated"}/5
- Circle score: ${data.circleScore ?? "not rated"}/5 (average of ${data.circleCount} rater${data.circleCount !== 1 ? "s" : ""})
- Gap: ${data.gapScore !== null ? (data.gapScore > 0 ? `+${data.gapScore}` : data.gapScore) : "not available"} (positive means circle rates higher than self, negative means self rates higher)

${notesText}

${trendText}

Write a 3-4 sentence MirrorReport summary. Be direct, warm, and specific. Reference the actual numbers. If there are anonymous notes, weave them in naturally. If there's a trend across weeks, point it out. End with one actionable insight for next week. Do not use bullet points. Write in second person ("your", "you").`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type === "text") return content.text;
  return "Summary unavailable.";
}