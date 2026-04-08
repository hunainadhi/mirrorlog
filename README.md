# MirrorLog

> Accountability from people who actually see you.

MirrorLog is a two-in-one accountability platform. **MirrorPulse** lets the people closest to you rate your habits anonymously every week — showing you the gap between who you think you are and who you actually are. **MirrorPod** puts you in silent 25-minute focus sessions with real people on camera, running every 30 minutes around the clock.

🌐 **[mirrorlog.org](https://mirrorlog.org)**

---

## Products

### MirrorPulse — Habit Accountability
Your circle rates your consistency anonymously every week. You rate yourself too. The gap between your self-score and their score is where real growth happens.

### MirrorPod — Silent Focus Sessions
Sign up for a 25-minute focus pod that runs every 30 minutes. Get matched with up to 4 others. Camera on, mic permanently off. No chat, no distractions — just the accountability of being seen.

---

## How MirrorPulse Works

1. **Pick a habit** — choose something visible to people around you
2. **Invite your circle** — send a unique link to 3–5 people. No account needed. Takes 60 seconds a week.
3. **They rate you honestly** — every Sunday your circle rates your consistency from 1–5, anonymously
4. **See your MirrorReport** — every Monday see your self-score vs your circle's score and the gap between them

## How MirrorPod Works

1. **Sign up for a slot** — pods run every 30 minutes. Pick a time and category.
2. **Get matched** — up to 5 people are grouped together. You see each other's pseudonym and task.
3. **Work silently on camera** — mic permanently off. No chat. 25 minutes of pure focus.
4. **Session ends** — your streak and focus history are tracked over time.

---

## Features

### MirrorPulse
- Onboarding flow for new users
- Create and manage habits with plan-based limits
- Invite raters via unique token links — no account required
- Anonymous weekly ratings with optional notes
- Self-rating flow for owners
- Duplicate rating prevention per week per rater
- MirrorReport with self score vs circle score vs gap visualization
- Anonymous notes from your circle
- Trend chart across multiple weeks
- Claude-powered AI MirrorSummary (Pro)

### MirrorPod
- Pods run every 30 minutes, 24/7
- 10 categories: Study, Coding, Writing, Reading, Design, Job Hunt, Admin, Learning, Business, Deep Work
- Unique pseudonym assigned to every user (e.g. BraveBlaze57)
- Sign up for slots up to 24 hours in advance
- Cancel anytime — late cancellation (within 5 min) costs 1 pod credit
- Auto-matched into groups of max 5 by category
- Camera on enforcement — warnings and community vote to kick after 2 min off
- Mic permanently disabled at token level
- Timer starts from scheduled time, not join time
- Streak tracking with bonus pod credits at 3 and 5 day streaks (Pro)
- Email reminder 15 minutes before session

### Emails
- Invite email sent when a rater is added
- Weekly Sunday nudge emails to raters
- Monday MirrorReport email to owners
- MirrorPod reminder 15 minutes before session
- Sent from hello@mirrorlog.org with full DKIM/SPF/DMARC setup

### Payments
- Free and Pro plans via Stripe
- Subscription management in settings
- Cancel anytime — keeps Pro until end of billing period

---

## Plans

| Feature | Free | Pro |
|---|---|---|
| Habits | 2 | 10 |
| Raters per habit | 3 | 8 |
| History | 4 weeks | Unlimited |
| AI MirrorSummary | 1 free | Unlimited |
| MirrorPod sessions/day | 2 | 6 |
| MirrorPod sessions/month | 10 | 30 |
| Streak bonus pods | — | ✓ |
| Price | $0 | $3/mo or $24/yr |

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
| Video | Daily.co |
| Payments | Stripe |
| Cron Jobs | cron-job.org |
| Hosting | Vercel |
| Domain | mirrorlog.org via Namecheap |

---

## Project Structure

```
mirrorlog/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── dashboard/
│   │   ├── page.tsx                  # MirrorPulse dashboard
│   │   ├── welcome/                  # Onboarding flow
│   │   ├── settings/                 # Account + billing
│   │   ├── pod/                      # MirrorPod dashboard
│   │   └── habits/[id]/              # Individual MirrorReport
│   ├── rate/[token]/                 # Public rater page (no auth)
│   ├── sign-in/                      # Clerk sign in
│   ├── sign-up/                      # Clerk sign up
│   └── api/
│       ├── habits/                   # Create and fetch habits
│       ├── raters/                   # Invite and manage raters
│       ├── ratings/                  # Submit weekly ratings
│       ├── self-rating/              # Owner self-rating
│       ├── reports/                  # Fetch weekly report data
│       ├── ai/summary/               # Claude AI summary generation
│       ├── onboarding/               # Mark user as onboarded
│       ├── stripe/checkout/          # Create Stripe checkout session
│       ├── stripe/cancel/            # Cancel subscription
│       ├── stripe/webhook/           # Handle Stripe events
│       ├── pods/slots/               # Upcoming pod slots
│       ├── pods/signup/              # Sign up / cancel pod signup
│       ├── pods/join/                # Join pod room
│       ├── pods/complete/            # Mark session complete
│       └── cron/
│           ├── weekly/               # Sunday nudges + Monday reports
│           ├── pods/                 # Create pod slots every 30 min
│           ├── assign/               # Assign signups to pods
│           └── remind/               # Pod reminder emails
├── components/
│   ├── habits/                       # HabitForm, HabitList, HabitsDashboard, InviteRater
│   ├── rater/                        # RaterForm
│   ├── report/                       # HabitReport, SelfRating, GapChart
│   ├── settings/                     # SettingsClient
│   ├── onboarding/                   # WelcomeScreen
│   └── pod/                          # PodDashboard, SlotBrowser, PodRoom
├── lib/
│   ├── db.ts                         # Prisma client singleton
│   ├── auth.ts                       # Clerk + DB user sync
│   ├── tokens.ts                     # Secure token generation
│   ├── pseudonyms.ts                 # Pseudonym generation
│   ├── email.ts                      # Resend email templates
│   ├── ai.ts                         # Claude API wrapper
│   ├── daily.ts                      # Daily.co video API
│   └── stripe.ts                     # Stripe client
└── prisma/
    └── schema.prisma                 # Database schema
```

---

## Database Schema

```
User          → signed up users (synced from Clerk, has pseudonym)
Habit         → goals set by a user
Rater         → people invited to rate a habit (token-based, no account needed)
Rating        → one score per rater per week (null raterId = self rating)
WeeklyReport  → aggregated gap report generated every Monday
Pod           → a scheduled 25-minute focus session slot
PodSignup     → a user reserving a spot in a pod slot
PodMember     → a user who has joined and is in the actual session
```

---

## Environment Variables

### `.env` (Prisma)
```
DATABASE_URL=your_supabase_pooler_url
DIRECT_URL=your_supabase_direct_url
```

### `.env.local` (Next.js)
```
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
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_YEARLY_PRICE_ID=
DAILY_API_KEY=
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- [Supabase](https://supabase.com) project
- [Clerk](https://clerk.com) application
- [Resend](https://resend.com) account
- [Anthropic](https://console.anthropic.com) API key
- [Daily.co](https://daily.co) account
- [Stripe](https://stripe.com) account

### Setup

```bash
git clone https://github.com/hunainadhi/mirrorlog.git
cd mirrorlog
npm install
npx prisma db push
npm run dev
```

---

## Cron Jobs (via cron-job.org)

| Job | Schedule | Purpose |
|---|---|---|
| `/api/cron/pods` | Every 30 min | Create pod slots for next 24 hours |
| `/api/cron/assign` | Every 5 min | Assign signups to pods, end expired pods |
| `/api/cron/remind` | Every 5 min | Send 15-min reminder emails |
| `/api/cron/weekly` | Sunday 8pm UTC | Send nudge emails to raters |
| `/api/cron/weekly` | Monday 8am UTC | Send MirrorReport emails to owners |

All cron jobs require `Authorization: Bearer your_cron_secret` header.

---

## Roadmap

### Shipped ✅
- [x] MirrorPulse — full habit accountability loop
- [x] MirrorPod — silent focus sessions with video
- [x] Pseudonym system for anonymous pod identity
- [x] Pod slot scheduling every 30 minutes
- [x] Auto-assignment into groups of max 5 by category
- [x] Permanent mic disable at Daily.co token level
- [x] Timer from scheduled time not join time
- [x] Camera enforcement with community vote to kick
- [x] Streak tracking with Pro bonus credits
- [x] Stripe payments with cancel flow
- [x] Claude AI MirrorSummary (Pro)
- [x] Email reminders and weekly reports
- [x] Custom domain mirrorlog.org
- [x] Separate prod/dev databases

### Coming Soon 🚀
- [ ] Monday MirrorReport email with AI summary
- [ ] Shareable report card
- [ ] Browser push notifications for pod reminders
- [ ] Mobile app
- [ ] Accountability circles (group habits)
- [ ] MirrorPod history and focus analytics

---

## License

MIT