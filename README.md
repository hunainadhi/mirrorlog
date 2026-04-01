# MirrorLog

> See yourself through the eyes of your circle.

MirrorLog is a habit accountability app with a twist — instead of tracking your own habits, the people closest to you rate your consistency anonymously every week. You rate yourself too. The app surfaces the gap between how you see yourself and how others see you.

---

## How It Works

1. **Set a habit** — describe a goal you want to be held accountable to
2. **Invite your circle** — send unique links to 3–5 people who can observe your behavior
3. **They rate you** — every week, your circle gets a simple prompt and rates your consistency (1–5), anonymously
4. **You see the mirror** — Monday morning you get your MirrorReport showing your self-score vs your circle's score and the gap between them

---

## Features

### Core
- Create and manage personal habits
- Invite raters via unique token links (no account required for raters)
- Anonymous weekly ratings with optional notes
- Duplicate rating prevention per week per rater

### Plan Limits
| Feature | Free | Pro |
|---|---|---|
| Habits | 1 | 5 |
| Raters per habit | 3 | 8 |
| History | 4 weeks | Unlimited |
| AI summary | — | ✓ |

### Coming Soon
- Weekly MirrorReport with gap visualization
- AI-generated plain-English summary (Claude API)
- Email nudges to raters every Sunday
- Stripe-powered Pro plan upgrade

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + inline styles |
| Auth | Clerk |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Email | Resend (coming soon) |
| AI | Anthropic Claude API (coming soon) |
| Payments | Stripe (coming soon) |
| Hosting | Vercel (coming soon) |

---

## Project Structure
```
mirrorlog/
├── app/
│   ├── (dashboard)/        # Protected owner pages
│   ├── rate/[token]/       # Public rater page (no auth)
│   └── api/
│       ├── habits/         # Create and fetch habits
│       ├── raters/         # Invite and manage raters
│       └── ratings/        # Submit weekly ratings
├── components/
│   ├── habits/             # HabitForm, HabitList, HabitsDashboard, InviteRater
│   └── rater/              # RaterForm
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── auth.ts             # Clerk + DB user sync
│   └── tokens.ts           # Secure token generation
└── prisma/
    └── schema.prisma       # Database schema
```

---

## Database Schema
```
User          → signed up owners (synced from Clerk)
Habit         → goals set by a user
Rater         → people invited to rate a habit (token-based access)
Rating        → one score per rater per week
WeeklyReport  → aggregated gap report generated every Monday
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application

### Setup
```bash
git clone https://github.com/hunainadhi/mirrorlog.git
cd mirrorlog
npm install
```

Create a `.env` file:
```bash
DATABASE_URL=your_supabase_postgresql_url
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

- [x] Habit creation with plan-based limits
- [x] Rater invite system via unique token links
- [x] Anonymous rating submission
- [x] Duplicate rating prevention
- [ ] Weekly MirrorReport with gap visualization
- [ ] Self-rating flow for owners
- [ ] Claude AI weekly summary
- [ ] Sunday email nudges to raters
- [ ] Monday report email to owners
- [ ] Stripe Pro plan
- [ ] Vercel deployment

---

## License

MIT