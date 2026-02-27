# Family Todo

A family task management app with priority lists, long-term backlogs, multi-person assignment, and email reminders. Built with Next.js, deployed on Vercel.

## Features

- **Priority list** — Focus on what matters now, visible as soon as you log in
- **Backlog** — Jot down tasks for "someday", promote them when ready
- **Multi-assignee** — Assign tasks to one or more family members
- **Email reminders** — Get notified so nothing falls through the cracks
- **Google auth** — Sign in with Google, invitation-only access
- **Cheery UI** — Warm, friendly design with obvious CTAs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v4 + Google OAuth
- **Database**: Prisma ORM (SQLite for dev, Vercel Postgres for production)
- **Styling**: Tailwind CSS
- **Email**: Resend
- **Hosting**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in the values:

- **`DATABASE_URL`** — `file:./dev.db` for local dev
- **`NEXTAUTH_SECRET`** — Generate with `openssl rand -base64 32`
- **`GOOGLE_CLIENT_ID`** / **`GOOGLE_CLIENT_SECRET`** — Create at [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
- **`RESEND_API_KEY`** — Get from [resend.com](https://resend.com) (optional for local dev)

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add a Vercel Postgres database (or any Postgres provider)
4. Update `prisma/schema.prisma` to use `provider = "postgresql"`
5. Set all environment variables in Vercel project settings
6. Deploy — Vercel cron jobs will handle reminder emails every 2 hours

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing / login page
│   ├── actions.ts            # Server actions (task/family CRUD)
│   ├── dashboard/page.tsx    # Priority list + quick actions
│   ├── backlog/page.tsx      # Long-term backlog
│   ├── setup/page.tsx        # First-time family setup
│   ├── invite/[code]/page.tsx # Invite acceptance
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth endpoints
│       └── reminders/send/     # Cron endpoint for reminders
├── components/               # UI components
├── lib/                      # Auth, Prisma, email utilities
└── types/                    # TypeScript type augmentations
```
