import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM = "MirrorLog <hello@mirrorlog.org>";

// Email sent when a rater is first invited
export async function sendRaterInviteEmail({
  to,
  nickname,
  habitTitle,
  token,
  ownerName,
}: {
  to: string;
  nickname: string | null;
  habitTitle: string;
  token: string;
  ownerName: string;
}) {
  const rateUrl = `${APP_URL}/rate/${token}`;
  const name = nickname || "there";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${ownerName} wants you to track their habit`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0f0f; color: #f0ede8;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">MirrorLog</h1>
        <p style="color: #6b6860; margin-bottom: 32px; font-size: 14px;">Honest reflection, anonymously.</p>

        <p style="font-size: 15px; margin-bottom: 16px;">Hey ${name},</p>
        <p style="font-size: 15px; margin-bottom: 16px;">
  <strong style="color: #c9f97f;">${ownerName}</strong> is working on a habit and wants honest accountability from people who actually know them.
</p>

        <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #6b6860; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Their goal</p>
          <p style="font-size: 16px; font-weight: 600;">${habitTitle}</p>
        </div>

        <p style="font-size: 14px; color: #6b6860; margin-bottom: 24px;">
          Every week you'll get a quick nudge to rate their consistency. It takes under 60 seconds and your response is completely anonymous.
        </p>

        <a href="${rateUrl}" style="display: inline-block; background: #c9f97f; color: #0f0f0f; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Rate them this week
        </a>

        <p style="font-size: 12px; color: #6b6860; margin-top: 32px;">
          You're receiving this because someone added your email to MirrorLog. No account needed.
        </p>
      </div>
    `,
  });
}

// Weekly nudge sent every Sunday
export async function sendWeeklyNudgeEmail({
  to,
  nickname,
  habitTitle,
  token,
  ownerName,
}: {
  to: string;
  nickname: string | null;
  habitTitle: string;
  token: string;
  ownerName: string;
}) {
  const rateUrl = `${APP_URL}/rate/${token}`;
  const name = nickname || "there";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Time to rate ${ownerName}'s habit this week`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0f0f; color: #f0ede8;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">MirrorLog</h1>
        <p style="color: #6b6860; margin-bottom: 32px; font-size: 14px;">Weekly check-in</p>

        <p style="font-size: 15px; margin-bottom: 16px;">Hey ${name},</p>
        <p style="font-size: 15px; margin-bottom: 16px;">
  How consistent has <strong style="color: #c9f97f;">${ownerName}</strong> actually been this week? Be honest — they need real feedback.
</p>

        <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #6b6860; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Their goal</p>
          <p style="font-size: 16px; font-weight: 600;">${habitTitle}</p>
        </div>

        <a href="${rateUrl}" style="display: inline-block; background: #c9f97f; color: #0f0f0f; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Rate now (60 seconds)
        </a>

        <p style="font-size: 12px; color: #6b6860; margin-top: 32px;">
          Your response is anonymous. The person only sees an average score.
        </p>
      </div>
    `,
  });
}

export async function sendOwnerReportEmail({
  to,
  name,
  habitTitle,
  habitId,
  selfScore,
  circleScore,
  gapScore,
  circleCount,
  notes,
}: {
  to: string;
  name: string;
  habitTitle: string;
  habitId: string;
  selfScore: number | null;
  circleScore: number | null;
  gapScore: number | null;
  circleCount: number;
  notes: string[];
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const reportUrl = `${appUrl}/dashboard/habits/${habitId}`;

  const gapLabel =
    gapScore === null
      ? "No data yet"
      : gapScore > 0
      ? `+${gapScore} — your circle rates you higher`
      : gapScore < 0
      ? `${gapScore} — you rate yourself higher`
      : "Perfect alignment";

  const notesHtml =
    notes.length > 0
      ? notes
          .map(
            (note) =>
              `<div style="background:#1a1a1a;border-radius:8px;padding:10px 14px;margin-bottom:8px;color:#f0ede8;font-size:14px;font-style:italic;">"${note}"</div>`
          )
          .join("")
      : `<p style="color:#6b6860;font-size:14px;">No notes left this week.</p>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your MirrorReport is ready — ${habitTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0f0f; color: #f0ede8;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">MirrorLog</h1>
        <p style="color: #6b6860; margin-bottom: 32px; font-size: 14px;">Your weekly MirrorReport</p>

        <p style="font-size: 15px; margin-bottom: 8px;">Hey ${name},</p>
        <p style="font-size: 15px; margin-bottom: 24px; color: #6b6860;">
          Here's how your circle rated you this week on:
        </p>

        <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #6b6860; font-size: 12px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Habit</p>
          <p style="font-size: 16px; font-weight: 600; margin-bottom: 20px;">${habitTitle}</p>

          <div style="display: flex; gap: 12px;">
            <div style="flex: 1; background: #0f0f0f; border-radius: 10px; padding: 14px; text-align: center;">
              <p style="color: #6b6860; font-size: 11px; margin-bottom: 6px;">YOU</p>
              <p style="font-size: 24px; font-weight: 700;">${selfScore !== null ? selfScore : "—"}</p>
            </div>
            <div style="flex: 1; background: #0f0f0f; border-radius: 10px; padding: 14px; text-align: center;">
              <p style="color: #6b6860; font-size: 11px; margin-bottom: 6px;">CIRCLE</p>
              <p style="font-size: 24px; font-weight: 700; color: #c9f97f;">${circleScore !== null ? circleScore : "—"}</p>
            </div>
            <div style="flex: 1; background: #0f0f0f; border-radius: 10px; padding: 14px; text-align: center;">
              <p style="color: #6b6860; font-size: 11px; margin-bottom: 6px;">GAP</p>
              <p style="font-size: 24px; font-weight: 700; color: ${gapScore !== null && gapScore < 0 ? "#ff6b6b" : "#c9f97f"};">${gapScore !== null ? (gapScore > 0 ? `+${gapScore}` : gapScore) : "—"}</p>
            </div>
          </div>

          <p style="color: #6b6860; font-size: 12px; margin-top: 12px; text-align: center;">${gapLabel}</p>
        </div>

        ${notes.length > 0 ? `
        <p style="color: #6b6860; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Anonymous Notes</p>
        ${notesHtml}
        <div style="margin-bottom: 24px;"></div>
        ` : ""}

        <a href="${reportUrl}" style="display: inline-block; background: #c9f97f; color: #0f0f0f; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
          View Full Report
        </a>

        <p style="font-size: 12px; color: #6b6860; margin-top: 32px;">
          You're receiving this because you use MirrorLog to track your habits.
        </p>
      </div>
    `,
  });
}