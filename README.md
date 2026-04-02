# MirrorLog

> Accountability from the people who actually know you.

MirrorLog is a habit accountability app where the people closest to you rate your consistency anonymously every week. You rate yourself too. The app surfaces the gap between how you see yourself and how others actually see you — and helps you close it.

🌐 **Live at [mirrorlog.org](https://mirrorlog.org)**

---

## How It Works

1. **Pick a habit** — choose a goal that's visible to people around you
2. **Invite your circle** — send unique links to 3–5 people who can observe your behavior
3. **They rate you honestly** — every Sunday your circle rates your consistency (1–5), anonymously
4. **See your MirrorReport** — compare your self-score vs your circle's score and track the gap over time

---

## Features

### Core
- Onboarding flow for new users
- Create and manage personal habits with plan-based limits
- Invite raters via unique token links (no account required for raters)
- Anonymous weekly ratings with optional notes
- Duplicate rating prevention per week per rater
- Self-rating flow for owners
- MirrorReport with gap visualization (You vs Circle vs Gap)
- Trend chart across weeks
- Anonymous notes from your circle

### AI
- Claude-powered AI MirrorSummary (Pro) — personalized plain-English weekly analysis of your gap, trends, and anonymous notes

### Emails
- Invite email sent automatically when a rater is added
- Weekly Sunday nudge emails to raters via Resend
- Emails sent from `hello@mirrorlog.org` with full DKIM/SPF/DMARC setup

### Plans
| Feature | Free | Pro |
|---|---|---|
| Habits | 1 | 5 |
| Raters per habit | 3 | 8 |
| History | 4 weeks | Unlimited |
| AI MirrorSummary | — | ✓ |

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + inline styles |
| Auth | Clerk |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Email | Resend |
| AI | Anthropic Claude API |
| Payments | Stripe (coming soon) |
| Hosting | Vercel |

---

## Project Structure
```
mirrorlog/
├── app/
│   ├── dashboard/                  # Protected owner pages
│   │   ├── page.tsx                # Habit dashboard
│   │   ├── welcome/                # Onboarding flow
│   │   └── habits/[id]/            # Individual habit MirrorReport
│   ├── rate/[token]/               # Public rater page (no auth needed)
│   ├── sign-in/                    # Clerk sign in
│   ├── sign-up/                    # Clerk sign up
│   └── api/
│       ├── habits/                 # Create and fetch habits
│       ├── raters/                 # Invite and manage raters
│       ├── ratings/                # Submit weekly ratings
│       ├── self-rating/            # Owner self-rating
│       ├── reports/                # Fetch weekly report data
│       ├── ai/summary/             # Claude AI summary generation
│       ├── onboarding/             # Mark user as onboarded
│       └── cron/weekly/            # Sunday cron trigger
├── components/
│   ├── habits/                     # HabitForm, HabitList, HabitsDashboard, InviteRater
│   ├── rater/                      # RaterForm
│   ├── report/                     # HabitReport, SelfRating, GapChart
│   └── onboarding/                 # WelcomeScreen
├── lib/
│   ├── db.ts                       # Prisma client singleton
│   ├── auth.ts                     # Clerk + DB user sync
│   ├── tokens.ts                   # Secure token generation
│   ├── email.ts                    # Resend email templates
│   └── ai.ts                       # Claude API wrapper
└── prisma/
    └── schema.prisma               # Database schema
```

---

## Database Schema
```
User          → signed up owners (synced from Clerk)
Habit         → goals set by a user
Rater         → people invited to rate a habit (token-based, no account needed)
Rating        → one score per rater per week (null raterId = self rating)
WeeklyReport  → aggregated gap report generated every Monday
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application
- A [Resend](https://resend.com) account
- An [Anthropic](https://console.anthropic.com) API key

### Setup
```bash
git clone https://github.com/hunainadhi/mirrorlog.git
cd mirrorlog
npm install
```

Create a `.env` file:
```bash
DATABASE_URL=your_supabase_pooler_url
DIRECT_URL=your_supabase_direct_url
```

Create a `.env.local` file:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_cron_secret
RESEND_API_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Push the schema to your database:
```bash
npx prisma db push
```

Run the dev server:
```bash
npm run dev
```

---

## Roadmap

### Shipped ✅
- [x] Onboarding flow for new users
- [x] Habit creation with plan-based limits
- [x] Rater invite system via unique token links
- [x] Anonymous rating submission
- [x] Duplicate rating prevention
- [x] Self-rating flow for owners
- [x] MirrorReport with gap visualization
- [x] Trend chart across multiple weeks
- [x] Anonymous notes from circle
- [x] Claude AI MirrorSummary (Pro)
- [x] Sunday email nudges to raters via Resend
- [x] Invite email on rater addition
- [x] Weekly cron job via Vercel
- [x] Custom domain (mirrorlog.org)
- [x] Separate prod/dev databases

### Coming Soon 🚀
- [ ] Stripe Pro plan upgrade flow
- [ ] Monday MirrorReport email to owners
- [ ] Shareable MirrorReport card (viral hook)
- [ ] Delete habit / remove rater
- [ ] Mobile app (React Native)
- [ ] Accountability circles (group habits)
- [ ] Public profile / leaderboard

---

## License

MIT